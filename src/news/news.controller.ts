import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/common/guards';
import { PageableData, Response } from '../core/models';
import { NewsDto } from './models';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService ) {
  }

  @Post('/insert')
  async insertNews(@Body() newsInfo: NewsDto) {
    return this.newsService.insertNews(newsInfo)
  }

  @Post('/search')
  @HttpCode(HttpStatus.OK)
  async searchNewsByText(@Body() req: {q: string}): Promise<Response<PageableData<NewsDto>>> {
    const searchText = req.q.trim();
    const data = await  this.newsService.searchNewsByText(searchText)
    return Response.ok(data)
  }

  @Post('/detail/:newsId')
  @HttpCode(HttpStatus.OK)
  async searchNewsById(@Param('newsId') newsId: string): Promise<Response<PageableData<NewsDto>>> {
    return Response.ok(await this.newsService.searchNewsById(newsId))
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAll() : Promise<Response<PageableData<NewsDto>>> {
    return Response.ok(await this.newsService.getAll())
  }

  @Get()
  async loadNews(@Body() offset: number): Promise<Response<PageableData<NewsDto>>> {
    return Response.ok(await this.newsService.getPage(offset))
  }

  @Post('/reindex')
  async reindex(@Body() obj: any) : Promise<Response<NewsDto>>{
    const field = Object.keys(obj)[0]
    const reindexValue = Object.values(obj)[0]
    return Response.ok(await this.newsService.reIndex(field, reindexValue))
  }

  @Post('/upvote')
  @UseGuards(AtGuard)
  async upvote(@Body() req: {id: string, userId: string}) : Promise<Response<NewsDto>>{
    return Response.ok(await this.newsService.upvote(req))
  }
}
