import { Module } from '@nestjs/common';
import { GeneralGateway } from './general.gateway';

@Module({
    providers: [GeneralGateway],
    exports: [GeneralGateway],
})
export class GeneralGatewayModule {}
