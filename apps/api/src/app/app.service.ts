import {
    HttpException,
    HttpStatus,
    Injectable,
    OnModuleInit,
} from '@nestjs/common';
import { DataService } from '@lucidlink-interview/data';
import { ConfigService } from '@nestjs/config';
import { StockAnalyzerService } from '@lucidlink-interview/stock-analyzer';
import { IntervalAnalyzerDto } from '@lucidlink-interview/api-types';

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

    getData(startDate: number, endDate: number): IntervalAnalyzerDto {
        if (startDate < this.configService.get<number>('START_TIME'))
            throw new HttpException(
                'Wrong start date!',
                HttpStatus.BAD_REQUEST
            );

        if (endDate > this.configService.get<number>('START_TIME') + 777600000)
            throw new HttpException('Wrong end date!', HttpStatus.BAD_REQUEST);

        return this.sotckAnalyzerService.mostProfitInterval(startDate, endDate);
    }

    getGraphData() {
        return this.sotckAnalyzerService.getGraphData();
    }
}
