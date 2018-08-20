import { AuthApiService } from '../app/services/auth-api.service';
export var exampleToken = "1234567890";
export var exampleExpires = 3600;
export var exampleUsername = "Mockuser";
export var examplePassword = "Mockpassword";
export var testCaseError = 'Test case error';

export abstract class AuthApiServiceMock extends AuthApiService {
  public getCurrentToken() { 
    return this.token.getValue(); 
  }
  protected errorLog(err:string) { };
}

export class AuthApiServiceMockSuccess extends AuthApiServiceMock {
  protected async sendTokenValidation(token:string) {
    return new Promise<boolean>(resolve => resolve(true));
  }

  protected async sendLogin(username:string, password:string) {
    return new Promise<string>(resolve => resolve(exampleToken));
  }
  
}

export class AuthApiServiceMockFail extends AuthApiServiceMock {
  protected async sendTokenValidation(token) {
    return new Promise<boolean>((resolve, reject) => reject(new Error(testCaseError)));
  }

  protected sendLogin(username:string, password:string):Promise<string> {
    return new Promise<string>((resolve, reject) => reject(new Error(testCaseError)));
  }
}