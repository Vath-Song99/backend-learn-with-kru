import AccountVerificationModel from "../databases/models/account-verification.model";
import { generateEmailVerificationToken } from "../utils/account-verification";
import StatusCode from "../utils/http-status-code";
import {
  generatePassword,
  generateSignature,
  validatePassword,
} from "../utils/jwt";
import { AccountVerificationRepository } from "../databases/repositories/account-verification.repository";
import { OauthConfig } from "../utils/oauth-configs";
import { AuthService, UserService } from "./@types/auth-service";
import { AuthRepository } from "../databases/repositories/auth.respository";
import { ObjectId } from "mongodb";
import { GenerateTimeExpire } from "../utils/date-generate";
import { TokenResponse } from "../utils/@types/oauth.type";
import { Login } from "../@types/user.type";
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import { publishDirectMessage } from "../queue/auth.producer";
import { authChannel } from "../server";
import { RequestUserService } from "../utils/http-request";
import { logger } from "../utils/logger";
import getConfig from "../utils/config";

export class AuthServices {
  private AuthRepo: AuthRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.AuthRepo = new AuthRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  async Signup(auth: AuthService): Promise<void> {
    // TODO LIST
    //************************* */
    // 1. hast password
    // 2. check existing user
    // 3. send verify email and handle for exist user
    // 4. create new user
    // 5. send verify email
    try {
      const { firstname, lastname, email, password } = auth;
      // step 1
      const hashedPassword = await generatePassword(password as string);
      // step 2
      const existingUser = await this.AuthRepo.FindUserByEmail({
        email: email as string,
      });
      if (existingUser) {
        if (existingUser.is_verified === true) {
          throw new BaseCustomError(
            "Your account is already signed up. Please log in instead.",
            StatusCode.BAD_REQUEST
          );
        }
        this.accountVerificationRepo.DeleteAccountVerifyByAuthId({
          authId: existingUser._id,
        });
        this.SendVerifyEmailToken({
          authId: existingUser._id,
          email: existingUser.email as string,
        });
        throw new BaseCustomError(
          "Verification email has been resent. Please check your email to verify.",
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
        email: newUser!.email as string,
      });

    } catch (error: unknown) {
      logger.error("The erorr accur in Singup() method! : ", error)
      if(error instanceof BaseCustomError){
        throw error
      }
      throw new ApiError("Songthing went wrong!")
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
      const inTenMinutes = GenerateTimeExpire(now);
      // step 4
      const accountVerification = new AccountVerificationModel({
        authId: authId,
        emailVerificationToken: emailVerificationToken,
        expired_at: inTenMinutes,
      });
      const newAccountVerification = await accountVerification.save();

      // step 5
      const messageDetails = {
        receiverEmail: email,
        verifyLink: `${getConfig().apiGateway}/v1/auth/verify?token=${newAccountVerification.emailVerificationToken}`,
        template: "verifyEmail",
      };

      // console.log(messageDetails)
      // Publish To Notification Service
      await publishDirectMessage(
        authChannel,
        "learnwithkru-verify-email",
        "auth-email",
        JSON.stringify(messageDetails),
        "Verify email message has been sent to notification service"
      );
    } catch (error) {
      logger.error("Unexpected error accurs in SendVerifyEmailToken() method! :",error);
      throw error
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
        await this.accountVerificationRepo.DeleteVerificationByToken({ token });

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
      const newUser = await user.save();

      const { _id, firstname, lastname, email } = newUser;

      // Create user object for the request
      const userData = {
        authId: _id.toString(),
        firstname: firstname as string,
        lastname: lastname as string,
        email: email as string,
        picture: null,
      };
      const requestUser = new RequestUserService();
      const { data } = await requestUser.CreateUser(userData);

      if (!data) {
        throw new ApiError("Can't create new user in to user service!");
      }
      const jwtToken = await generateSignature({
        _id: data._id.toString(),
      });

      await this.accountVerificationRepo.DeleteVerificationByToken({ token });

      return { data, jwtToken };
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
      const { given_name, family_name, email, id, verified_email, picture } =
        userInfoResponse.data;
      const user = await this.AuthRepo.FindUserByEmail({ email });
      if (user) {
        if (!user.googleId) {
          const newUser = await this.AuthRepo.FindUserByIdAndUpdate({
            id: user._id,
            updates: {
              googleId: id,
              is_verified: true,
              picture,
            },
          });

          const userData: UserService = {
            authId: newUser!._id.toString(),
            firstname: newUser!.firstname as string,
            lastname: newUser!.lastname as string,
            email: newUser!.email as string,
            picture: newUser!.picture as string,
          };

          const requestUser = new RequestUserService();
          const { data } = await requestUser.CreateUser(userData);
          const { _id } = data;
          const jwtToken = await generateSignature({ _id: _id.toString() });
          return { data, jwtToken };
        }
        const requestUser = new RequestUserService();
        const { data } = await requestUser.GetUser(user._id.toString());
        const { _id } = data;
        const jwtToken = await generateSignature({ _id: _id.toString() });
        return { data, jwtToken };
      }

      const newUser = await this.AuthRepo.CreateOauthUser({
        firstname: given_name,
        lastname: family_name,
        email,
        googleId: id,
        verified_email,
        picture,
      });
      const userData: UserService = {
        authId: newUser!._id.toString(),
        firstname: newUser!.firstname as string,
        lastname: newUser!.lastname as string,
        email: newUser!.email as string,
        picture: newUser!.picture as string,
      };
      const requestUser = new RequestUserService();
      const { data } = await requestUser.CreateUser(userData);
      if (!data) {
        throw new ApiError("Can't create new user in user service!");
      }

      const jwtToken = await generateSignature({
        _id: data._id.toString(),
      });
      return { data, jwtToken };
    } catch (error) {
      logger.error("The error of SigninwithGoogle() method! :", error)
      if(error instanceof BaseCustomError){
        throw error;
      }
      throw new ApiError("Somthing went wrong!")
    }
  }

  async Expiredverify({ token }: { token: string }) {
    const isToken = await this.accountVerificationRepo.FindVerificationToken({
      token,
    });
    return isToken;
  }

  async Login(user: Login) {
    // TODO LIST
    //******************* */
    // 1. find existing user
    // 2. checking user verify or not
    // 3. checking for correct password
    // 4. generate jwt token
    try {
      const { email, password } = user;
      // step 1
      const existingUser = await this.AuthRepo.FindUserByEmail({ email });
      if (!existingUser) {
        throw new BaseCustomError("User not exist", StatusCode.NOT_FOUND);
      }
      // step 2
      if (existingUser.is_verified === false) {
        throw new BaseCustomError(
          "your email isn't verify",
          StatusCode.BAD_REQUEST
        );
      }
      // step 3
      const isPwdCorrect = await validatePassword({
        enteredPassword: password,
        savedPassword: existingUser.password as string,
      });
      if (!isPwdCorrect) {
        throw new BaseCustomError(
          "Email or Password is incorrect",
          StatusCode.BAD_REQUEST
        );
      }
      // step 4
      const requestUser = new RequestUserService();
      const { data } = await requestUser.GetUser(existingUser._id.toString());

      if(!data){
        logger.error("No User found in Login() when request data from user db!")
        throw new ApiError("User doesn't exist!",StatusCode.NOT_FOUND)
      }
      const jwtToken = await generateSignature({
        _id: data._id.toString(),
      });
      return { data, jwtToken };
    } catch (error) {
        logger.error("Login () method error:", error)
        if(error instanceof BaseCustomError){
          throw error;
        }
        throw new ApiError("Somthing when wrong!")
    }
  }

  async SigninWithFacebookCallBack(code: string) {
    //TODO LIST
    //*********************** */
    // 1. access token from facebook
    // 2. take token to access data from facebook user
    // 3. check existing user if exist generate new token
    // 4. create new user
    // 5. generate token
    //*********************** */
    try {
      //step 1
      const config = await OauthConfig.getInstance();
      const data: TokenResponse = await config.FacebookStrategy(code);
      const { access_token } = data;

      //step 2
      const profile = await config.FacebookAccessInfo(access_token);

      const { id, first_name, last_name, email, picture } = profile.data;
      // step 3
      const existingUser = await this.AuthRepo.FindUserByFacebookId({
        facebookId: id,
      });
      if (existingUser) {
        const requestUser = new RequestUserService();
        const { data } = await requestUser.GetUser(existingUser._id.toString());

        const { _id } = data;
        const jwtToken = await generateSignature({ _id: _id.toString() });
        return { data, jwtToken };
      }
      //step 4
      const newUser = await this.AuthRepo.CreateOauthUser({
        firstname: first_name,
        lastname: last_name,
        email,
        facebookId: id,
        verified_email: true,
        picture: picture.data.url,
      });
      //step 5
      const { _id, firstname, lastname } = newUser;

      const userData: UserService = {
        authId: _id.toString(),
        firstname: firstname as string,
        lastname: lastname as string,
        email: newUser!.email as string,
        picture: newUser!.picture as string,
      };
      const requestUser = new RequestUserService();
      const user = await requestUser.CreateUser(userData);
      if (!user.data) {
        throw new ApiError("Can't create new user in user service!");
      }
      const jwtToken = await generateSignature({
        _id: user.data._id.toString(),
      });
      return { data: user.data, jwtToken };
    } catch (error) {
      throw error;
    }
  }

  async ResetPassword({ email }: { email: string }) {
    //***************** */
    // 1. find exist user
    try {
      const existingUser = await this.AuthRepo.FindUserByEmail({ email });
      if (existingUser) {
        if (!existingUser.is_verified) {
          throw new BaseCustomError(
            "Your Email isn't Verify, Please verify your email!",
            StatusCode.UNAUTHORIZED
          );
        } else {
          if (!existingUser.password) {
            throw new BaseCustomError(
              "Your account is sign up with third-party app",
              StatusCode.BAD_REQUEST
            );
          }
          this.SendVerifyEmailToken({
            authId: existingUser._id,
            email: existingUser.email as string,
          });
        }
      }
      throw new BaseCustomError("User not found!", StatusCode.NOT_FOUND);
    } catch (error: unknown) {
      throw error;
    }
  }
}
