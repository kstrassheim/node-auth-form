import { AuthApiService } from '../app/services/auth-api.service';
export const exampleToken = "1234567890";
export const exampleExpires = 3600;
export const exampleUsername = "Mockuser";
export const examplePassword = "Mockpassword";
export const registrationSuccessStatus = 1;
export const registrationExistStatus = 2;
export const testCaseError = 'Test case error';

export abstract class AuthApiServiceMock extends AuthApiService {
  protected errorLog(err:string) { };
}

export class AuthApiServiceMockSuccess extends AuthApiServiceMock {

  protected getReturnRegistrationStatus():number { return registrationSuccessStatus; }

  protected async sendTokenValidation(token:string) {
    return new Promise<boolean>(resolve => resolve(true));
  }

  protected async sendLogin(username:string, password:string) {
    return new Promise<string>(resolve => resolve(exampleToken));
  }

  protected async sendRegistration(username:string, password:string) {
    return new Promise<number>(resolve => resolve(this.getReturnRegistrationStatus()));
  }
}

  
export class AuthApiServiceMockExist extends AuthApiServiceMockSuccess { protected getReturnRegistrationStatus():number { return registrationExistStatus; }}


export class AuthApiServiceMockFail extends AuthApiServiceMock {
  protected async sendTokenValidation(token) {
    return new Promise<boolean>((resolve, reject) => reject(new Error(testCaseError)));
  }

  protected sendLogin(username:string, password:string):Promise<string> {
    return new Promise<string>((resolve, reject) => reject(new Error(testCaseError)));
  }

  protected async sendRegistration(username:string, password:string) {
    return new Promise<number>((resolve, reject) => reject(new Error(testCaseError)));
  }
}