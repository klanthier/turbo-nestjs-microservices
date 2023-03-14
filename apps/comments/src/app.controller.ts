import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger/dist';
import { AppService } from './app.service';
import { Comment as CommentDto, Classes } from '~prisma';
import { CommentService } from './comment.service';
@ApiTags()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  @ApiOkResponse({ status: 200, type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('comment/:id')
  @ApiOkResponse({ type: Classes.Comment })
  @ApiNotFoundResponse()
  async getCommentById(@Param('id') id: string): Promise<CommentDto> {
    const comment = await this.commentService.comment({
      id: Number.parseInt(id),
    });
    if (!comment) {
      throw new NotFoundException();
    }

    return comment as CommentDto;
  }

  @Get('comments/:resourceId')
  @ApiOkResponse({ type: [Classes.Comment] })
  async getCommentsFromResource(
    @Param('resourceId') resourceId: string,
  ): Promise<CommentDto[]> {
    const comments = await this.commentService.comments({
      where: { resource_id: Number.parseInt(resourceId) },
    });

    return comments as CommentDto[];
  }

  @Get('comments')
  @ApiOkResponse({ type: [Classes.Comment] })
  async getAllComments(): Promise<CommentDto[]> {
    const comments = await this.commentService.comments({});

    return comments as CommentDto[];
  }

  @Post('comment')
  @ApiOkResponse({ type: Classes.Comment })
  async createComment(
    @Body() commentData: { resourceId: string; content?: string },
  ): Promise<CommentDto> {
    const { resourceId, content } = commentData;
    return (await this.commentService.createComment({
      resource_id: Number.parseInt(resourceId),
      content,
    })) as CommentDto;
  }

  @Delete('comment/:id')
  @ApiOkResponse({ type: Classes.Comment })
  async deleteComment(@Param('id') id: string): Promise<CommentDto> {
    return (await this.commentService.deleteComment({
      id: Number(id),
    })) as CommentDto;
  }
}
