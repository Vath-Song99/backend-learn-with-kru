import {
  Get,
    Route
  } from "tsoa";
@Route("v1/auth")
export class UsersController {
  @Get('/')
  public async getExamples(): Promise<string[]> {
    return ['example1', 'example2'];
  }
}