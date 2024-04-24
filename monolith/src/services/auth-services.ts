import { Types } from "mongoose";
import AccountVerificationModel from "../databases/models/account-verification.model";
import { AuthRepository } from "../databases/repositories/auth.respository";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { ApiError, BaseCustomError } from "../utils/base-custom-error";
import EmailSender from "../utils/email-sender";
import StatusCode from "../utils/http-status-code";
import { generatePassword, generateSignature } from "../utils/jwt";
import { AuthService } from "./@types/auth-service";
import { AccountVerificationRepository } from "../databases/repositories/account-verification.repository";
import { GoogleOauthConfig } from "../utils/oauth-configs";

export class AuthServices {
  private AuthRepo: AuthRepository;
  private accountVerificationRepo: AccountVerificationRepository;
  constructor() {
    this.AuthRepo = new AuthRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  async Signup(auth: AuthService) {
    try {
      const { firstname, lastname, email, password } = auth;
      const hashedPassword = await generatePassword(password as string);

      const newUser = await this.AuthRepo.CreateAuthUser({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
      return newUser;
      //  return await this.AuthRepo.CreateUser(users)
    } catch (error: unknown) {
      throw error;
    }
  }
  async SendVerifyEmailToken(userId: Types.ObjectId) {
    // TODO
    // 1. Generate Verify Token
    // 2. Save the Verify Token in the Database
    // 3. Get the Info User By Id
    // 4. Send the Email to the User

    try {
      // Step 1

      const emailVerificationToken = generateEmailVerificationToken();
      // Step 2 this save database has token
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });

      const newAccountVerification = await accountVerification.save();
      // Step 3
      const existedUser = await this.AuthRepo.FindUserById({ id: userId });
      // this error existedUser
      if (!existedUser) {
        throw new BaseCustomError(
          "User does not exist!",
          StatusCode.NOT_ACCEPTABLE
        );
      }
      // Step  4

      const emailSender = EmailSender.getInstance();

      emailSender.sendSignUpVerificationEmail({
        toEmail: existedUser.email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });
    } catch (error) {
      throw error;
    }
  }
  async VerifyEmailToken({ token }: { token: string }) {
    try {
      const isTokenExist =
        await this.accountVerificationRepo.FindVerificationToken({ token });

      if (!isTokenExist) {
        throw new BaseCustomError(
          "Verification token is invalid",
          StatusCode.BAD_REQUEST
        );
      }
      // const verificationDate = await this.AuthRepo.handleExpire(createdAt);

      // Find the user associated with this token
      const user = await this.AuthRepo.FindUserById({
        id: isTokenExist.userId,
      });
      if (!user) {
        throw new BaseCustomError("User does not exist.", StatusCode.NOT_FOUND);
      }

      // Mark the user's email as verified
      user.is_verified = true;
      await user.save();

      // Remove the verification token
      await this.accountVerificationRepo.DeleteVerificationToken({ token });

      return user;
    } catch (error) {
      throw error;
    }
  }
  async SigninWithGoogleCallBack(code: string) {
    // TODO
    // 1. configure client
    // 2. accessToken from user
    // 3. Use the access token to access user info from Google APIs
    // 4. find you that exist in database
    // 5. create new user to database
    // 6. generate jwt token
    //************************ */

    try {
      // step 1
      const googleConfig = await GoogleOauthConfig.getInstance();
      const tokenResponse = await googleConfig.GoogleStrategy(code);

      // step 2
      const accessToken = tokenResponse.access_token;
      // step 3
      const userInfoResponse = await googleConfig.AccessInfo(accessToken);

      // stept 4
      const { given_name, family_name, email, id, verified_email , profile } =
        userInfoResponse.data;
      const user = await this.AuthRepo.FindUserByEmail({ email: email });
      // Check if the user exists in the database
      if (user) {
        // If the user doesn't exist, create a new user record
        const jwtToken = await generateSignature({payload: id})
        return {jwtToken}
      }
      // steps 5
      const newUser = await this.AuthRepo.CreateOauthUser({
        firstname: given_name,
        lastname: family_name,
        email,
        googleId: id,
        verified_email,
        profile: profile
      });
     
      // step 6
      const jwtToken = await generateSignature({payload: id});
      return { newUser, jwtToken };
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Unable to Singin with google");
    }
  }
}
