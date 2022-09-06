import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { newsSchema } from './models';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from '../auth/strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "news",
        schema: newsSchema
      }
    ]), JwtModule.register({
      secret: "16072002"
    })
  ],
  controllers: [NewsController],
  providers: [NewsService, AtStrategy, RtStrategy]
})
export class NewsModule {}
