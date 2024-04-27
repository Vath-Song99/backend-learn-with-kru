import { Types } from "mongoose";
import AccountVerificationModel from "../databases/models/account-verification.model";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { BaseCustomError } from "../utils/base-custom-error";
import EmailSender from "../utils/email-sender";
import StatusCode from "../utils/http-status-code";
import {
  generatePassword,
  generateSignature,
  validatePassword,
} from "../utils/jwt";
import { AccountVerificationRepository } from "../databases/repositories/account-verification.repository";
import { OauthConfig } from "../utils/oauth-configs";
import { AuthService } from "./@types/auth-service";
import { AuthRepository } from "../databases/repositories/auth.respository";
import { ObjectId } from "mongodb";
import { GenerateTimeExpire } from "../utils/date-generate";

export class AuthServices {
  private AuthRepo: AuthRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.AuthRepo = new AuthRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  async Signup(auth: AuthService) {
    // TODO LIST
    //************************* */
    // 1. hast password
    // 2. check existing user
    // 3. send verify email and handle for exist user
    // 4. create new user
    // 5. send verify email
    // 6. generate jwt token
    try {
      const { firstname, lastname, email, password } = auth;
      // step 1
      const hashedPassword = await generatePassword(password as string);

      // step 2
      const existingUser = await this.AuthRepo.FindUserByEmail({ email });
      if (existingUser) {
        if (existingUser.is_verified === true) {
          throw new BaseCustomError(
            "Your account already signup, please login instead",
            StatusCode.BAD_REQUEST
          );
        }
        this.SendVerifyEmailToken({
          authId: existingUser._id,
          email: existingUser.email as string,
        });
        throw new BaseCustomError(
          "Email was resend, please check your email to verify",
          StatusCode.BAD_REQUEST
        );
      }

      // step 3
      const newUser = await this.AuthRepo.CreateAuthUser({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
      // step 4
      await this.SendVerifyEmailToken({
        authId: newUser._id,
        email: newUser.email as string,
      });
      // step 5
      const jwtToken = await generateSignature({
        payload: newUser._id.toString(),
      });

      return { newUser, jwtToken };
    } catch (error: unknown) {
      throw error;
    }
  }

  async SendVerifyEmailToken({
    authId,
    email,
  }: {
    authId: ObjectId;
    email: string;
  }) {
    //TODO LIST
    //********************** */
    // 1. generate token
    // 2. generate current date
    // 3. generate date expire
    // 4. save user to database verify
    // 6. send email
    try {
      // step 1
      const emailVerificationToken = generateEmailVerificationToken();

      // step 3
      const now = new Date();
      const inOnSecond = GenerateTimeExpire(now)
      // step 4
      const accountVerification = new AccountVerificationModel({
        authId: authId,
        emailVerificationToken,
        expired_at: inOnSecond,
      });
      const newAccountVerification = await accountVerification.save();

      // step 5
      const emailSender = EmailSender.getInstance();
      emailSender.sendSignUpVerificationEmail({
        toEmail: email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });
    } catch (error) {
      throw error;
    }
  }

  async VerifyEmailToken(token: string) {
    try {
      const isTokenExist =
        await this.accountVerificationRepo.FindVerificationToken({ token });

      if (!isTokenExist) {
        throw new BaseCustomError(
          "Verification token is invalid",
          StatusCode.BAD_REQUEST
        );
      }

      const now = new Date();
      if (now > isTokenExist.expired_at) {
        const existAuth = await this.AuthRepo.FindUserById({
          id: isTokenExist.authId,
        });
        await this.SendVerifyEmailToken({
          authId: existAuth?._id as ObjectId,
          email: existAuth?.email as string,
        });
        await this.accountVerificationRepo.DeleteVerificationToken({ token });

        throw new BaseCustomError(
          "Verify Token was expire!",
          StatusCode.UNAUTHORIZED
        );
      }

      const user = await this.AuthRepo.FindUserById({
        id: isTokenExist.authId,
      });

      if (!user) {
        throw new BaseCustomError("User does not exist.", StatusCode.NOT_FOUND);
      }

      user.is_verified = true;
      await user.save();

      const jwtToken = await generateSignature({
        payload: user._id.toString(),
      });
      await this.accountVerificationRepo.DeleteVerificationToken({ token });

      return { user, jwtToken };
    } catch (error) {
      throw error;
    }
  }

  async SigninWithGoogleCallBack(code: string) {
    try {
      const googleConfig = await OauthConfig.getInstance();
      const tokenResponse = await googleConfig.GoogleStrategy(code);

      const accessToken = tokenResponse.access_token;

      const userInfoResponse = await googleConfig.GoogleAccessInfo(accessToken);
      const { given_name, family_name, email, id, verified_email, profile } =
        userInfoResponse.data;

      const user = await this.AuthRepo.FindUserByEmail({ email });
      if (user) {
        const jwtToken = await generateSignature({ payload: id });
        return { jwtToken };
      }

      const newUser = await this.AuthRepo.CreateOauthUser({
        firstname: given_name,
        lastname: family_name,
        email,
        googleId: id,
        verified_email,
        profile: profile,
      });
      const jwtToken = await generateSignature({ payload: id });
      return { newUser, jwtToken };
    } catch (error) {
      throw error;
    }
  }

  async Expiredverify({ token }: { token: string }) {
    const isToken = await this.accountVerificationRepo.FindVerificationToken({
      token,
    });
    return isToken;
  }

  async DeleteVerifyOld(oldToken: Types.ObjectId) {
    return await this.accountVerificationRepo.DeleteVerify(oldToken);
  }

  async Login(authData: { password: string; email: string }) {
    try {
      const user = await this.AuthRepo.FindUserByEmail({
        email: authData.email,
      });

      if (!user) {
        throw new BaseCustomError("User not exist", StatusCode.NOT_FOUND);
      }

      const isPwdCorrect = await validatePassword({
        enteredPassword: authData.password,
        savedPassword: user.password as string,
      });

      if (!isPwdCorrect) {
        throw new BaseCustomError(
          "Email or Password is incorrect",
          StatusCode.BAD_REQUEST
        );
      }

      const token = await generateSignature({ payload: user._id });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async SigninWithFacebookCallBack(code: string) {
    try {
      const config = await OauthConfig.getInstance();
      const data: any = await config.FacebookStrategy(code);
      const { access_token } = data;

      const profile = await config.FacebookAccessInfo(access_token);

      const { id, first_name, last_name, email, picture } = profile.data;

      const existingUser = await this.AuthRepo.FindUserByFacebookId({
        facebookId: id,
      });

      if (existingUser) {
        const jwtToken = await generateSignature({ payload: id });
        return { jwtToken };
      }

      const newUser = await this.AuthRepo.CreateOauthUser({
        firstname: first_name,
        lastname: last_name,
        email,
        facebookId: id,
        verified_email: true,
        profile: picture,
      });

      const jwtToken = await generateSignature({ payload: id });

      return { profile: newUser, jwtToken };
    } catch (error) {
      throw error;
    }
  }
}
