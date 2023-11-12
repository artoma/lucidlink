import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';

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
    getGraph() {
        return this.appService
            .getGraphData()
            .slice(1000, 2000)
            .map((item) => [item.timeStamp, item.price]);
    }
}
