import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from '@lucidlink-interview/data'
import { ConfigModule } from '@nestjs/config';
import { StockAnalyzerModule } from '@lucidlink-interview/stock-analyzer'
 
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DataModule,
    StockAnalyzerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
