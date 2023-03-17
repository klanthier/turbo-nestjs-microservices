import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CustomPrismaService } from 'nestjs-prisma';
import { PrismaClient } from '~prisma';
import { getKeysFromRequest } from './guards/client-key.decorator';
import { usingClientKey } from './guards/using-client-keys';

// This service class is a wrapper that will prepare sessions for each request based on client-keys
// sent over in the headers. This ensure data is accessed following RLS in PGSQL and that the micro-service
// can be shared amongst other system and services based on their client key communications

@Injectable({ scope: Scope.REQUEST })
export class DatabaseService {
  client: CustomPrismaService<PrismaClient>['client'];
  constructor(
    @Inject('database')
    private prisma: CustomPrismaService<PrismaClient>,
    @Inject(REQUEST) private request: Request,
  ) {
    this.client = this.prisma.client.$extends(
      usingClientKey(getKeysFromRequest(this.request)),
    ) as CustomPrismaService<PrismaClient>['client'];
  }
}
