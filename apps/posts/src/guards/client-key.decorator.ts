import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const stringIsArray = (key: string) => {
  return JSON.parse(key) && Array.isArray(JSON.parse(key));
};

export type ClientKey = string;
export const ClientKey = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request: Request = context.switchToHttp().getRequest();
    const key = request.headers['client-key'] as string;

    if (!key || stringIsArray(key)) {
      throw new InternalServerErrorException();
    }

    return key;
  },
);

export type ClientKeys = string[];
export const ClientKeys = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string[] => {
    const request: Request = context.switchToHttp().getRequest();
    return getKeysFromRequest(request);
  },
);

export const getKeysFromRequest = (request: Request) => {
  const keys = request.headers['client-key'] as string;

  let keysArray = [keys];
  if (!keys) {
    throw new InternalServerErrorException();
  }

  if (stringIsArray(keys)) {
    keysArray = JSON.parse(keys);
  }

  return keysArray;
};
