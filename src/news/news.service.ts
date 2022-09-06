import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PageableData } from '../core';
import { NewsDto } from './models';
@Injectable()
export class NewsService {

  constructor(@InjectModel('news') private newsModel: Model<NewsDto>) {

  }
  async insertNews(newsInfo: NewsDto) {
    const id = `new_${uuidv4()}`
    const news = new this.newsModel({ ...newsInfo, _id: id })
    await news.save()
    return "insert successful"
  }

  async searchNewsById(newsId: string): Promise<PageableData<NewsDto>> {
    const match = await this.newsModel.findById(newsId)
    if (!match) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return {
      total: [match].length,
      data: [match]
    }
  }

  async searchNewsByText(searchText: string): Promise<PageableData<NewsDto>> {
    const news = await this.newsModel.find({ $text: { $search: searchText } }).sort({ score: { $meta: "textScore" } })
    if (!news) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return {
      total: news.length,
      data: news
    }
  }

  async getAll(): Promise<PageableData<NewsDto>> {
    const news = await this.newsModel.find();
    if (!news) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return {
      total: news.length,
      data: news
    }
  }

  async getPage(offset: number): Promise<PageableData<NewsDto>> {
    const limit = 10;
    const data = await this.newsModel.find({}, {}, { skip: (offset - 1) * limit, limit })
    return {
      total: data.length,
      data: data
    }
  }

  async reIndex(field: string, reindexValue: any): Promise<any> {
    await this.newsModel.updateMany({}, { $set: { [field]: reindexValue } }, { multi: true, upsert: true })
    return {
    }
  }

  async upvote(req: { id: string, userId: string }): Promise<PageableData<NewsDto>> {
    const news = await this.newsModel.findOne({_id: req.id})
    const isUpvoted = news.upvoteByIds.includes(req.userId)
    if (isUpvoted) {
      news.upvoteByIds = news.upvoteByIds.filter((userId: string) => userId !== req.userId)
      await news.save()
    }
    else{
      news.upvoteByIds.push(req.userId)
      await news.save()
    }
    return {
      total: [news].length,
      data: [news]
    }
  }
}
