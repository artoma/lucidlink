import { Module } from '@nestjs/common';
import { DataService } from './data.service';

@Module({
    controllers: [],
    providers: [DataService],
    exports: [DataService],
    imports: [],
})
export class DataModule {}
