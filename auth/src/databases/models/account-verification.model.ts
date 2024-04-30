import { ObjectId } from "mongodb";
import mongoose, { Document, Model } from "mongoose";

export interface IAccountVerificationDocument extends Document {
  authId: mongoose.Types.ObjectId;
  emailVerificationToken: string;
  created_at: Date;
  expired_at: Date;
}

export interface IAccountVerificationModel
  extends Model<IAccountVerificationDocument> {}

const accountVerificationSchema = new mongoose.Schema({
  authId: { type: ObjectId, required: true },
  emailVerificationToken: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expired_at: {
    type: Date,
    required: true,
  }
});

const AccountVerificationModel = mongoose.model<
  IAccountVerificationDocument,
  IAccountVerificationModel
>("verification-request", accountVerificationSchema);

export default AccountVerificationModel;
