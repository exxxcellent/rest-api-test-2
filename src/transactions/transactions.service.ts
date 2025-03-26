import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
    EVENT_TRANSACTION_CREATED,
    EVENT_TRANSACTION_DELETED,
    EVENT_TRANSACTION_UPDATED,
    TRANSACTION_CREATED,
    TRANSACTION_DELETED,
    TRANSACTION_NOT_DELETED,
    TRANSACTION_NOT_FOUND,
    TRANSACTION_NOT_UPDATED,
    TRANSACTION_UPDATED,
} from 'src/common/constants';
import { Transaction } from 'src/common/models/transactions.model';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { RedisService } from 'src/redis/redis.service';
import { TaskService } from 'src/task/task.service';
import { CreateTransactionDto } from './dto/create.dto';
import { UpdateTransactionDto } from './dto/update.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction) private transactionModel: typeof Transaction,
        private readonly redisService: RedisService,
        private readonly notificationGateway: NotificationGateway,
        private readonly taskService: TaskService,
    ) {}

    async getAll() {
        return await this.transactionModel.findAll();
    }

    async getAllCached() {
        const cachedTransactions =
            await this.redisService.client.get('transactions');
        if (!cachedTransactions) {
            const transactions = await this.getAll();
            await this.redisService.client.set(
                'transactions',
                JSON.stringify(transactions),
                {
                    EX: 30,
                },
            );
            return transactions;
        }
        return JSON.parse(cachedTransactions);
    }

    async getById(id: string) {
        return await this.transactionModel.findByPk(id);
    }

    async create(dto: CreateTransactionDto) {
        await this.taskService.addTranasactionJob(
            dto.userId,
            dto.amount,
            dto.type,
        );
        await this.redisService.client.del('transactions');
        const transaction = await this.transactionModel.create(dto);
        this.notificationGateway.sendNotification(
            dto.userId,
            TRANSACTION_CREATED,
            EVENT_TRANSACTION_CREATED,
            transaction,
        );
        return transaction;
    }

    async updateById(id: string, dto: UpdateTransactionDto) {
        const transaction = await this.getById(id);
        if (!transaction) {
            throw new NotFoundException(TRANSACTION_NOT_FOUND);
        }
        const affectedCount = await this.transactionModel.update(dto, {
            where: {
                id,
            },
        });
        if (!affectedCount) {
            throw new BadRequestException(TRANSACTION_NOT_UPDATED);
        }
        const updatedTransaction = await this.getById(id);
        this.notificationGateway.sendNotification(
            transaction.userId,
            TRANSACTION_UPDATED,
            EVENT_TRANSACTION_UPDATED,
            updatedTransaction,
        );
        await this.redisService.client.del('transactions');
        return updatedTransaction;
    }

    async deleteById(id: string): Promise<boolean> {
        const transaction = await this.getById(id);
        if (!transaction) {
            throw new NotFoundException(TRANSACTION_NOT_FOUND);
        }
        const affectedCount = await this.transactionModel.destroy({
            where: {
                id,
            },
        });
        if (!affectedCount) {
            throw new BadRequestException(TRANSACTION_NOT_DELETED);
        }
        this.notificationGateway.sendNotification(
            transaction.userId,
            TRANSACTION_DELETED,
            EVENT_TRANSACTION_DELETED,
            transaction,
        );
        await this.redisService.client.del('transactions');
        return true;
    }
}
