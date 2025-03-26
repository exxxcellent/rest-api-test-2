import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from 'src/user/user.module';
import { TaskService } from './task.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'transactionsQueue',
        }),
        RedisModule,
        UserModule,
        ScheduleModule.forRoot(),
    ],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {}
