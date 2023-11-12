import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntervalAnalyzerDto } from '@lucidlink-interview/api-types';
import { DataService } from '@lucidlink-interview/data';
import { ConfigService } from '@nestjs/config';
import { StockAnalyzerService } from '@lucidlink-interview/stock-analyzer';

describe('AppController', () => {
    let appModule: TestingModule;
    let appService: AppService;
    const analyzerResult: IntervalAnalyzerDto = {
        maxProfit: 38,
        bestBuyPrice: 22,
        bestSellPrice: 60,
        bestBuyTime: 1698526330000,
        bestSellTime: 1698538238000,
        interval: [
            [1698526230000, 37.12],
            [1698526231000, 35.11],
            [1698526232000, 23.51],
            [1698526233000, 41.91],
        ],
    };
    beforeAll(async () => {
        appModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService, DataService, ConfigService, StockAnalyzerService],
        }).compile();

        appService = appModule.get(AppService);
    });

    describe('getData', () => {
        it('should return object of type IntervalAnalyzerDto', () => {
            const appController = appModule.get<AppController>(AppController);

            jest.spyOn(appService, 'getData').mockImplementation(
                () => analyzerResult );

            expect(appController.getData(Date.now(), Date.now())).toMatchObject(analyzerResult);
        });
    });
});
