import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Post, Prisma, PrismaClient } from '~prisma';

@Injectable()
export class PostService {
  constructor(
    @Inject('PrismaServicePost')
    private prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.client.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async posts(parameters: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = parameters;
    return this.prisma.client.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.client.post.create({
      data,
    });
  }

  async updatePost(parameters: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { data, where } = parameters;
    return this.prisma.client.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.client.post.delete({
      where,
    });
  }
}
