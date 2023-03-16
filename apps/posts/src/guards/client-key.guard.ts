import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ClientKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // checking if the request contain a client key in the header
    console.log('hello', request.headers['client-key']);

    return !!request.headers['client-key'];
  }
}
