import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middlewares';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationModule } from './notification/notification.module';
import { RedisModule } from './redis/redis.module';
import { ReminderService } from './reminder/reminder.service';
import { TokenModule } from './token/token.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

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
        ScheduleModule.forRoot(),
        UserModule,
        AuthModule,
        TokenModule,
        TransactionsModule,
        RedisModule,
        NotificationModule,
        TaskModule,
    ],
    controllers: [AppController],
    providers: [AppService, NotificationGateway, ReminderService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
