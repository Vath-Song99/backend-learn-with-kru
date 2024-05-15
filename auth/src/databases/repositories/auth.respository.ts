import { authModel } from "../models/auth.model";
import { AuthUserRepo, OauthUserRepo, UserUpdates } from "../@types/repo-type";
import { ApiError, BaseCustomError } from "../../error/base-custom-error";
import StatusCode from "../../utils/http-status-code";
import { ObjectId } from "mongodb";
import { logger } from "../../utils/logger";
export class AuthRepository {
  async CreateAuthUser({ firstname, lastname, email, password }: AuthUserRepo) {
    try {
      const existingUser = await this.FindUserByEmail({ email: email as string });
      if (existingUser) {
        throw new BaseCustomError("Email already exists", StatusCode.FORBIDDEN);
      }

      const user = await authModel.create({
        firstname,
        lastname,
        email,
        password,
      });
      if (!user) {
        throw new ApiError("Unable to create use in database!");
      }

      return await user.save();
    } catch (error: unknown) {
      throw error;
    }
  }

  async CreateOauthUser({
    firstname,
    lastname,
    email,
    password,
    googleId,
    facebookId,
    verified_email,
    picture,
  }: OauthUserRepo) {
    try {
      const user = new authModel({
        firstname,
        lastname,
        email,
        password,
        googleId,
        facebookId,
        is_verified: verified_email,
        picture,
      });
      const userResult = await user.save();
      if (!user) {
        throw new ApiError("Unable to create user into Database!");
      }
      return userResult;
    } catch (error: unknown) {
      throw error;
    }
  }

  // async CreateOauthUser({

  // })
  async FindUserByEmail({ email }: { email: string }) {
    try {
      const existingUser = await authModel.findOne({ email: email });
      return existingUser;
    } catch (error) {
      logger.error("Unexpected an accurs error: ", error);
      throw new ApiError("Somthing went wrong!")
    }
  }
  async FindUserById({ id }: { id: string | ObjectId }) {
    try {
      const existingUser = await authModel.findById({ _id: id });

      return existingUser;
    } catch (error) {
      throw error;
    }
  }

  async FindUserByFacebookId({ facebookId }: { facebookId: string }) {
    try {
      const existingUser = await authModel.findOne({
        facebookId: facebookId,
      });

      return existingUser;
    } catch (error: unknown) {
      throw new ApiError(error as string);
    }
  }

  async FindUserByIdAndUpdate ({id , updates }:{
    id: string | ObjectId,
    updates: UserUpdates
  }) {
    try{
      const existUser = await this.FindUserById({id})
      if(!existUser){
        throw new ApiError("User does't exist!")
      }
      const updated = await authModel.findByIdAndUpdate(id , updates ,{
        new: true
      })
      return updated
    }catch(error: unknown){

    }
  }
}
