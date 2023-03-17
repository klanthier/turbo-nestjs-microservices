import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger/dist';
import { AppService } from './app.service';
import { PostService } from './post.service';
import { Post as PostDto, Classes } from '../prisma';
import { HttpCacheInterceptor } from './middleware/http-cache.interceptor';
import { ClientKeyGuard } from './guards/client-key.guard';
@ApiTags()
@Controller()
@UseInterceptors(HttpCacheInterceptor)
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
  @UseGuards(ClientKeyGuard)
  @ApiOkResponse({ type: [Classes.Post] })
  async getPublishedPosts(): Promise<PostDto[]> {
    const posts = await this.postService.posts({
      where: { published: true },
    });

    return posts as PostDto[];
  }
  @Get('posts')
  @ApiOkResponse({ type: [Classes.Post] })
  async getAllPosts(): Promise<PostDto[]> {
    const posts = await this.postService.posts({});

    return posts as PostDto[];
  }

  @Post('post')
  @ApiOkResponse({ type: Classes.Post })
  @UseGuards(ClientKeyGuard)
  async createDraft(
    @Body() postData: { title: string; content?: string; clientKey: string },
  ): Promise<PostDto> {
    const { title, content, clientKey } = postData;
    return (await this.postService.createPost({
      title,
      content,
      client_key: clientKey,
    })) as PostDto;
  }

  @Put('publish/:id')
  @ApiOkResponse({ type: Classes.Post })
  async publishPost(@Param('id') id: string): Promise<PostDto> {
    return (await this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    })) as PostDto;
  }

  @Delete('post/:id')
  @ApiOkResponse({ type: Classes.Post })
  async deletePost(@Param('id') id: string): Promise<PostDto> {
    return (await this.postService.deletePost({ id: Number(id) })) as PostDto;
  }
}
