import { Injectable, Inject } from '@nestjs/common';
import { Comment, Prisma, PrismaClient } from '~prisma';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class CommentService {
  constructor(
    @Inject('PrismaServiceComment')
    private prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async comment(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    return this.prisma.client.comment.findUnique({
      where: commentWhereUniqueInput,
    });
  }

  async comments(parameters: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy } = parameters;
    return this.prisma.client.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.client.comment.create({
      data,
    });
  }

  async updateComment(parameters: {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.CommentUpdateInput;
  }): Promise<Comment> {
    const { data, where } = parameters;
    return this.prisma.client.comment.update({
      data,
      where,
    });
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    return this.prisma.client.comment.delete({
      where,
    });
  }
}
