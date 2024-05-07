import AccountVerificationModel from "../databases/models/account-verification.model";
import { generateEmailVerificationToken } from "../utils/account-verification";
import EmailSender from "../utils/email-sender";
import StatusCode from "../utils/http-status-code";
import {
  generateSignature,
} from "../utils/jwt";
import { AccountVerificationRepository } from "../databases/repositories/account-verification.repository";
import { ObjectId } from "mongodb";
import { GenerateTimeExpire } from "../utils/date-generate";
import { BaseCustomError } from "../error/base-custom-error";

export class AuthServices {
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.accountVerificationRepo = new AccountVerificationRepository();
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
        emailVerificationToken,
        expired_at: inTenMinutes,
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
      await user.save();

      const jwtToken = await generateSignature({
        payload: user._id.toString(),
      });
      await this.accountVerificationRepo.DeleteVerificationByToken({ token });

      return { user, jwtToken };
    } catch (error) {
      throw error;
    }
  }
}
