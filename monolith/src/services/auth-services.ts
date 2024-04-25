import { Types } from "mongoose";
import AccountVerificationModel from "../databases/models/account-verification.model";
import { AuthRepository } from "../databases/repositories/auth.respository";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { ApiError, BaseCustomError } from "../utils/base-custom-error";
import EmailSender from "../utils/email-sender";
import StatusCode from "../utils/http-status-code";

import { generatePassword, generateSignature, validatePassword } from "../utils/jwt";
import { AuthServiceType } from "./@types/auth-service";

import { AccountVerificationRepository } from "../databases/repositories/account-verification.repository";
import { OauthConfig } from "../utils/oauth-configs";

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
      const googleConfig = await OauthConfig.getInstance();
      const tokenResponse = await googleConfig.GoogleStrategy(code);

      // step 2
      const accessToken = tokenResponse.access_token;
      // step 3
      const userInfoResponse = await googleConfig.GoogleAccessInfo(accessToken);

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
     

        try {
          // Step 1
               
          const emailVerificationToken = generateEmailVerificationToken();
          // Step 2 this save database has token
          const now = new Date();
         const inTwoMinutes = new Date(now.getTime() + 2 * 60 * 1000); 
          const accountVerification = new AccountVerificationModel({
            userId,
            emailVerificationToken,
            expired_at:inTwoMinutes,
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
           return newAccountVerification;
        } catch (error) {
          throw error;
        }
      }
      async  Expiredverify({ token }: { token: string }){
        const isToken =
        await this.accountVerificationRepo.FindVerificationToken({ token });
        return isToken;
      }
      async DeleteVerifyOld(oldToken: Types.ObjectId){
         return await this.accountVerificationRepo.DeleteVerify(oldToken);
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
      async Login(authData: {password: string,email:string}) {
        // TODO:
        // 1. Find user by email
        // 2. Validate the password
        // 3. Generate Token & Return
        // Step 1 email shechma to
        try {
          const user = await this.AuthRepo.FindUser({ email: authData.email });
          if (!user) {
            throw new BaseCustomError("User not exist", StatusCode.NOT_FOUND);
          }
    
          // Step 2
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
    
          // Step 3
          const token = await generateSignature({ userId: user._id });
        } catch (error) {
          throw error;
        }
      }
}

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

  async SigninWithFacebookCallBack(code: string) {
    //********************* */\
    // 1. config facebook strategy
    // 2. destruce access_token from data
    // 3. access data from facebook api
    // 4. create user into database
    // 5. generate jwt token for user
    //*********************** */
    try {
      // step 1
      const config = await OauthConfig.getInstance();
      const data: any = await config.FacebookStrategy(code);
      // step 2
      const { access_token } = data;

      // step 3
      const profile = await config.FacebookAccessInfo(access_token);
      console.log(profile)

      const {id , name ,first_name , last_name , email , picture} = profile.data
      // step 4
      const existingUser = await this.AuthRepo.FindUserByFacebookId({facebookId: id});
      if(existingUser){
        const jwtToken = await generateSignature({payload: id})
        return {jwtToken}
      }
      
      const newUser = await this.AuthRepo.CreateOauthUser({
        firstname: first_name,
        lastname: last_name,
        email,
        facebookId: id,
        verified_email: true,
        profile: picture
      });

      console.log(newUser)
      // step 5
      const jwtToken = await generateSignature({payload: profile.data.id})

      return {profile: profile.data , jwtToken}
    } catch (error: unknown) {
      throw error;
    }
  }
}

