import { Types } from "mongoose";
import AccountVerificationModel from "../databases/models/account-verification.model";
import { AuthRepository } from "../databases/repositories/auth.respository";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { BaseCustomError } from "../utils/base-custom-error";
import EmailSender from "../utils/email-sender";
import StatusCode from "../utils/http-status-code";
import { generatePassword } from "../utils/jwt";
import { AuthServiceType } from "./@types/auth-service";
import { AccountVerificationRepository } from "../databases/repositories/account-verification.repository";

export class AuthServices{
    private AuthRepo: AuthRepository
    private accountVerificationRepo: AccountVerificationRepository;
    constructor(){
        this.AuthRepo = new AuthRepository()
        this.accountVerificationRepo = new AccountVerificationRepository();
    }

    async Signup(auth:AuthServiceType ){
        try{
            const { firstname,lastname, email , password } = auth;
            const hashedPassword = await generatePassword(password);
         
            const newUser = await this.AuthRepo.CreateUser({
                firstname,
                lastname,
                email,
                password: hashedPassword,
              });
              return  newUser;
          //  return await this.AuthRepo.CreateUser(users)
        }catch(error: unknown){
            throw error
        }
    }
    async SendVerifyEmailToken(userId:  Types.ObjectId) {
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
}