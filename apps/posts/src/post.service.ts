import { Injectable } from '@nestjs/common';
import { Prisma } from '~prisma';
import { DatabaseService } from './database.service';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    return this.databaseService.client.post.findUniqueOrThrow({
      where: postWhereUniqueInput,
    });
  }

  async posts(parameters: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { skip = 0, take = 20, cursor, where, orderBy } = parameters;
    return this.databaseService.client.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPost(data: Prisma.PostCreateInput) {
    return this.databaseService.client.post.create({
      data,
    });
  }

  async updatePost(parameters: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }) {
    const { data, where } = parameters;
    return this.databaseService.client.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput) {
    return this.databaseService.client.post.delete({
      where,
    });
  }
}
