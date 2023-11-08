import { Module } from '@nestjs/common';
import { StockAnalyzerService } from './stock-analyzer.service';
import { DataModule } from '@lucidlink-interview/data';

@Module({
  controllers: [],
  imports: [DataModule],
  providers: [StockAnalyzerService],
  exports: [StockAnalyzerService],
})
export class StockAnalyzerModule {}
