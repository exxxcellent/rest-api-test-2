import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { LoggerMiddleware } from './common/middlewares';

const sequelizeModuleOptions: SequelizeModuleOptions = {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PWD,
    database: process.env.POSTGRES_DB,
    autoLoadModels: true,
    synchronize: true,
};

@Module({
    imports: [SequelizeModule.forRoot(sequelizeModuleOptions), UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
