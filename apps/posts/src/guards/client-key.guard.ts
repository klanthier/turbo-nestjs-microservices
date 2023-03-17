import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { stringIsArray } from './client-key.decorator';

@Injectable()
export class ClientKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const keys = request.headers['client-key'] as string;

    // Blocker to ensure you cannot provide an array of keys on any other endpoints other than get requests
    const isGETRequest = request.method.toUpperCase() === 'GET';
    if (!isGETRequest && stringIsArray(keys)) {
      console.log(keys);
      throw new BadRequestException();
    }

    return !!request.headers['client-key'];
  }
}
