import { AuthApiService, ITokenResponse } from '../app/services/auth-api.service';
export var exampleToken = "1234567890";
export var exampleExpires = 3600;
export var exampleUsername = "Mockuser";
export var examplePassword = "Mockpassword";
export var testCaseError = 'Test case error';
export var exampleLoginResult = <ITokenResponse>{token:exampleToken, expires: exampleExpires};

export abstract class AuthApiServiceMock extends AuthApiService {
  public getCurrentToken() { return this.token.getValue(); }
  public getCurrentTokenExpiration() { return this.tokenExpiration.getValue(); }
  public getCurrentUsername() { return this.username.getValue(); }
  public getCurrentPassword() {  return this.password.getValue(); }
  public setCurrentTokenExpiration(expiration:number) { this.tokenExpiration.next(expiration); }
}

export class AuthApiServiceMockSuccess extends AuthApiServiceMock {
  protected sendLogin(username:string, password:string):Promise<ITokenResponse> {
    return Promise.resolve(exampleLoginResult);
  }
}

export class AuthApiServiceMockFail extends AuthApiServiceMock {
  protected sendLogin(username:string, password:string):Promise<ITokenResponse> {
    return new Promise((resolve, reject) => {
      reject(new Error('Test case error'))
    });
  }
}