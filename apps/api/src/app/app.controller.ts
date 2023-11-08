import {
    Controller,
    Get,
    ParseFloatPipe,
    ParseIntPipe,
    Query,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getData(
        @Query('startDate', ParseIntPipe) startDate: number,
        @Query('endDate', ParseIntPipe) endDate: number
    ) {
        return this.appService.getData(startDate, endDate);
    }

    @Get('graph')
    getGraph(
        @Query('startDate', ParseIntPipe) startDate: number,
        @Query('endDate', ParseIntPipe) endDate: number
    ) {
        return this.appService
            .getGraphData()
            .filter(
                (item) =>
                    item.timeStamp >= startDate && item.timeStamp <= endDate
            )
            .map((item) => [item.timeStamp, item.price])
            .slice(1000, 2000);
    }
}
