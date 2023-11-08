import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataService } from '@lucidlink-interview/data';
import { ConfigService } from '@nestjs/config';
import { StockAnalyzerService } from '@lucidlink-interview/stock-analyzer';

@Injectable()
export class AppService implements OnModuleInit {
    constructor(
        private readonly dataService: DataService,
        private configService: ConfigService,
        private sotckAnalyzerService: StockAnalyzerService
    ) {}

    onModuleInit() {
        this.dataService.generateStaticData(
            this.configService.get<number>('START_TIME')
        );
    }

    getData(startDate: number, endDate: number) {
        return this.sotckAnalyzerService.mostProfitInterval(startDate, endDate);
    }

    getGraphData() {
        return this.sotckAnalyzerService.getGraphData();
    }
}
