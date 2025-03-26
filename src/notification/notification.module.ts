import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { NotificationGateway } from './notification.gateway';

@Module({
    imports: [TokenModule, UserModule],
    providers: [NotificationGateway],
    exports: [NotificationGateway],
})
export class NotificationModule {}
