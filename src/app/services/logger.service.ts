import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  constructor() { }

  public logInfo(message:string, isPublic = true) {
    console.log(message);
    if (isPublic) {
      alert(message);
    }
  }

  public logError(error:any, isPublic = true) {
    console.error(error);
    if (isPublic) {
      alert(error && error.message ? error.message: error);
    }
  }

}
