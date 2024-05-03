import { Types } from "mongoose";
import AccountVerificationModel from "../models/account-verification.model";

export class AccountVerificationRepository {
  async CreateVerificationToken({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }) {
    try {
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken: token,
      });

      const newAccountVerification = await accountVerification.save();
      return newAccountVerification;
    } catch (error) {
      throw error;
    }
  }

  async FindVerificationToken({ token }: { token: string }) {
    try {
      const existedToken = await AccountVerificationModel.findOne({
        emailVerificationToken: token,
      });

      return existedToken;
    } catch (error) {
      throw error;
    }
  }
  async DeleteAccountVerifyByAuthId({authId}: {authId: Types.ObjectId}) {
    return await AccountVerificationModel.deleteOne({ authId });
  }
  async DeleteVerificationByToken({ token }: { token: string }) {
    try {
      await AccountVerificationModel.deleteOne({
        emailVerificationToken: token,
      });
    } catch (error) {
      throw error;
    }
  }
}
