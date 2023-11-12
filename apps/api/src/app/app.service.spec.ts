import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { StockAnalyzerService } from '@lucidlink-interview/stock-analyzer';
import { DataService } from '@lucidlink-interview/data';

describe('AppService', () => {
    let appService: AppService;
    let appModule: TestingModule;
    let configService: ConfigService;

    beforeAll(async () => {
        appModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(() => 1698267600000),
                    },
                },
                StockAnalyzerService,
                DataService,
            ],
        }).compile();

        appService = appModule.get<AppService>(AppService);
        configService = appModule.get<ConfigService>(ConfigService);
    });

    describe('getData', () => {
        it('should throw HttpException if startDate is smaller then period startDate"', () => {
            jest.spyOn(configService, 'get');
            expect(() => {
                appService.getData(169826760000, 1698616800000);
            }).toThrow(HttpException);
        });
        it('should throw HttpException if endDate is biger then period endDate"', () => {
            jest.spyOn(configService, 'get');
            expect(() => {
                appService.getData(169826760000, 11698616800000);
            }).toThrow(HttpException);
        });
    });
});
