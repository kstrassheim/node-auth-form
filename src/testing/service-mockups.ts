import { AuthApiService } from '../app/services/auth-api.service';

export class AuthApiServiceMock extends AuthApiService {

    public login() {
        return new Promise((resolve, reject) => {
          let token = "1234567890";
          let expires:any = 3600;
          this.tokenExpiration.next(Date.now() + expires);
          this.token.next(token);
          resolve()
        });
    }
  }