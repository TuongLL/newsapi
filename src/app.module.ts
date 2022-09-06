import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [AuthModule, 
    MongooseModule.forRoot(
      "mongodb+srv://lamtuong:1ASn5TqkH7ReRrHb@cluster0.ptetruw.mongodb.net/?retryWrites=true&w=majority", {
      dbName: 'test'}
    ), NewsModule, ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
