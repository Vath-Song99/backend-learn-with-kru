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
      const emailVerificationToken = generateEmailVerificationToken();
      const now = new Date();
      const inTwoMinutes = new Date(now.getTime() + 2 * 60 * 1000);
      const accountVerification = new AccountVerificationModel({
        userId: newUser._id,
        emailVerificationToken,
        expired_at: inTwoMinutes,
      });

      const newAccountVerification = await accountVerification.save();

      const emailSender = EmailSender.getInstance();

      emailSender.sendSignUpVerificationEmail({
        toEmail: newUser.email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });

      return newUser;
    } catch (error: unknown) {
      throw error;
    }
  }

  async SendVerifyEmailToken(userId: Types.ObjectId) {
    try {
      const emailVerificationToken = generateEmailVerificationToken();

      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });

      const newAccountVerification = await accountVerification.save();

      const existedUser = await this.AuthRepo.FindUserById({ id: userId });

      if (!existedUser) {
        throw new BaseCustomError(
          "User does not exist!",
          StatusCode.NOT_ACCEPTABLE
        );
      }

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

      const user = await this.AuthRepo.FindUserById({
        id: isTokenExist.userId,
      });

      if (!user) {
        throw new BaseCustomError("User does not exist.", StatusCode.NOT_FOUND);
      }

      user.is_verified = true;
      await user.save();

      await this.accountVerificationRepo.DeleteVerificationToken({ token });

      return user;
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

      const user = await this.AuthRepo.FindUserByEmail({email});
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
