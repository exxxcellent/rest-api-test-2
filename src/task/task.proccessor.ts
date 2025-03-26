import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TaskService } from './task.service';

@Processor('transactions')
export class TaskProcessor {
    constructor(private readonly taskService: TaskService) {}

    @Process('updateBalance')
    async handleBalanceUpdate(job: Job) {
        console.log('Обработка задачи на обновление баланса');
        await this.taskService.processBalanceUpdate(job);
    }
}
