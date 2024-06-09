import { HTTPStatusCode } from "./http_status_code";
import createHttpError from "http-errors";

export class BadRequestException {
    constructor(message: any) {
      throw createHttpError(HTTPStatusCode.BadRequest, message);
    }
}

export class InternalServerErrorException{
    constructor(message: String) {
        throw createHttpError(HTTPStatusCode.BadRequest, message);
      }
}
  
export class ConflictException{
    constructor(message: String){
        throw createHttpError(HTTPStatusCode.Conflict, message)
    }
}

export class UnauthorizedException{
    constructor(message: String){
        throw createHttpError(HTTPStatusCode.Unauthorized, message)
    }
}

