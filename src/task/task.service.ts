import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { TransactionTypes } from 'src/common/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
    constructor(
        @InjectQueue('transactionsQueue') private transactionsQueue: Queue,
        private readonly userService: UserService,
    ) {}

    async addTranasactionJob(
        userId: number,
        transactionAmount: number,
        type: TransactionTypes,
    ) {
        console.log('Добавляем задачу на обновление баланса');
        await this.transactionsQueue.add('updateBalance', {
            userId,
            transactionAmount,
            type,
        });
        console.log('Задача добавлена');
    }

    async processBalanceUpdate(job: Job) {
        const { userId, transactionAmount, type } = job.data;
        console.log(
            `Обновляем баланс пользователя ${userId} на ${transactionAmount}`,
        );
        try {
            switch (type) {
                case TransactionTypes.INCOME:
                    console.log(`Увеличиваем баланс на ${transactionAmount}`);
                    await this.userService.incrementBalance(
                        userId,
                        transactionAmount,
                    );
                    break;
                case TransactionTypes.EXPENSE:
                    console.log(`Уменьшаем баланс на ${transactionAmount}`);
                    await this.userService.decrementBalance(
                        userId,
                        transactionAmount,
                    );
                    break;
                default:
                    console.log('Неизвестный тип транзакции');
                    break;
            }
        } catch (error) {
            console.error('Ошибка при обновлении баланса:', error);
        }
    }
}
