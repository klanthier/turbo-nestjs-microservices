import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger/dist';
import { Classes, Post as PostDto } from '../prisma';
import { AppService } from './app.service';
import { ClientKey } from './guards/client-key.decorator';
import { ClientKeyGuard } from './guards/client-key.guard';
import { PostService } from './post.service';

@ApiTags()
@Controller()
@UseGuards(ClientKeyGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postService: PostService,
  ) {}

  @Get()
  @ApiOkResponse({ status: 200, type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('post/:id')
  @ApiOkResponse({ type: Classes.Post })
  @ApiNotFoundResponse()
  async getPostById(@Param('id') id: string): Promise<PostDto> {
    const post = await this.postService.post({ id: Number.parseInt(id) });
    if (!post) {
      throw new NotFoundException();
    }

    return post as PostDto;
  }

  @Get('feed')
  @ApiOkResponse({ type: [Classes.Post] })
  async getPublishedPosts(): Promise<PostDto[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }
  @Get('posts')
  @ApiOkResponse({ type: [Classes.Post] })
  async getAllPosts(): Promise<PostDto[]> {
    return this.postService.posts({});
  }

  @Post('post')
  @ApiOkResponse({ type: Classes.Post })
  async createDraft(
    @Body() postData: Pick<Classes.Post, 'content' | 'title' | 'client_key'>,
    @ClientKey() key: string,
  ): Promise<PostDto> {
    return this.postService.createPost({
      ...postData,
      client_key: key,
    });
  }

  @Put('publish/:id')
  @ApiOkResponse({ type: Classes.Post })
  async publishPost(@Param('id') id: string): Promise<PostDto> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  @ApiOkResponse({ type: Classes.Post })
  async deletePost(@Param('id') id: string): Promise<PostDto> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
