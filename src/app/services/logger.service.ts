import { Injectable } from '@angular/core';
import * as toastr from '../../../node_modules/toastr'

@Injectable()
export class LoggerService {

  constructor() { }

  public logInfo(message:string, isPublic = true) {
    console.log(message);
    if (isPublic) {
      toastr.success(message);
    }
  }

  public logError(error:any, isPublic = true) {
    console.error(error);
    if (isPublic) {
      toastr.error(error && error.message ? error.message: error);
    }
  }
}
