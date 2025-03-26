import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middlewares';
import { NotificationGateway } from './notification/notification.gateway';
import { RedisModule } from './redis/redis.module';
import { TokenModule } from './token/token.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

dotenv.config();

const sequelizeModuleOptions: SequelizeModuleOptions = {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PWD,
    database: process.env.POSTGRES_DB,
    autoLoadModels: true,
    synchronize: true,
    logging: false,
};

@Module({
    imports: [
        SequelizeModule.forRoot(sequelizeModuleOptions),
        UserModule,
        AuthModule,
        TokenModule,
        TransactionsModule,
        RedisModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [AppService, NotificationGateway],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
