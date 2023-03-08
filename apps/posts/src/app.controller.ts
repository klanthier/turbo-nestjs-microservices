import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger/dist';
import { AppService } from './app.service';
import { PostService } from './post.service';
import { Post as PostDto } from './_gen/prisma-class/post';
@ApiTags()
@Controller()
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
  @ApiOkResponse({ type: PostDto })
  @ApiNotFoundResponse()
  async getPostById(@Param('id') id: string): Promise<PostDto> {
    const post = await this.postService.post({ id: Number(id) });
    if (!post) {
      throw new NotFoundException();
    }

    return post as PostDto;
  }

  @Get('feed')
  @ApiOkResponse({ type: [PostDto] })
  async getPublishedPosts(): Promise<PostDto[]> {
    const posts = await this.postService.posts({
      where: { published: true },
    });

    return posts as PostDto[];
  }

  @Post('post')
  @ApiOkResponse({ type: PostDto })
  async createDraft(
    @Body() postData: { title: string; content?: string },
  ): Promise<PostDto> {
    const { title, content } = postData;
    return (await this.postService.createPost({
      title,
      content,
    })) as PostDto;
  }

  @Put('publish/:id')
  @ApiOkResponse({ type: PostDto })
  async publishPost(@Param('id') id: string): Promise<PostDto> {
    return (await this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    })) as PostDto;
  }

  @Delete('post/:id')
  @ApiOkResponse({ type: PostDto })
  async deletePost(@Param('id') id: string): Promise<PostDto> {
    return (await this.postService.deletePost({ id: Number(id) })) as PostDto;
  }
}
