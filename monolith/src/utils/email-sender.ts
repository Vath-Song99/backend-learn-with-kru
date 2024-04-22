import {
    EmailApi,
    EmailApiSendEmailResponse,
    EmailApiSendSignUpVerificationEmailArgs,
  } from "./@types/email-sender.type";
  
  // ********************************
  // Singleton Pattern
  // 1. A Class has only single instance
  // 2. Provide a global access point to that instance
  // link: https://refactoring.guru/design-patterns/singleton
  // ********************************
  
  export default class EmailSender implements EmailApi {
    private isActive = false;
    private emailApi: EmailApi | undefined;
    private static emailSenderInstance: EmailSender;
  
    private constructor() {}
  
    static getInstance(): EmailSender {
      if (!this.emailSenderInstance) {
        this.emailSenderInstance = new EmailSender();
      }
      return this.emailSenderInstance;
    }
  
    static resetEmailSenderInstance(): void {
      this.emailSenderInstance = new EmailSender();
    }
  
    activate(): void {
      this.isActive = true;
    }
  
    deactivate(): void {
      this.isActive = false;
    }
  
    setEmailApi(emailApi: EmailApi): void {
      this.emailApi = emailApi;
    }
  
    async sendSignUpVerificationEmail(
      args: EmailApiSendSignUpVerificationEmailArgs
    ): Promise<EmailApiSendEmailResponse> {
      try {
        this.validateEmailSender();
  
        return (this.emailApi as EmailApi).sendSignUpVerificationEmail(args);
      } catch (error) {
        throw error;
      }
    }
  
    private validateEmailSender(): void {
      if (!this.isActive) {
        //   throw new APIError("EmailSender is not active");
        // handel errr api
      }
  
      if (!this.emailApi) {
        //   throw new APIError("EmailApi is not set");
      }
    }
  }
  