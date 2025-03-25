import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
    TRANSACTION_NOT_DELETED,
    TRANSACTION_NOT_UPDATED,
    TransactionTypes,
} from 'src/common/constants';
import { Transaction } from 'src/common/models/transactions.model';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';
import { CreateTransactionDto } from './dto/create.dto';
import { UpdateTransactionDto } from './dto/update.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction) private transactionModel: typeof Transaction,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
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
        switch (dto.type) {
            case TransactionTypes.EXPENSE:
                await this.userService.decrementBalance(dto.userId, dto.amount);
                break;
            case TransactionTypes.INCOME:
                await this.userService.incrementBalance(dto.userId, dto.amount);
                break;
            default:
                break;
        }
        await this.redisService.client.del('transactions');
        return await this.transactionModel.create(dto);
    }

    async updateById(id: string, dto: UpdateTransactionDto) {
        const affectedCount = await this.transactionModel.update(dto, {
            where: {
                id,
            },
        });
        if (!affectedCount) {
            throw new BadRequestException(TRANSACTION_NOT_UPDATED);
        }
        await this.redisService.client.del('transactions');
        return await this.getById(id);
    }

    async deleteById(id: string): Promise<boolean> {
        const affectedCount = await this.transactionModel.destroy({
            where: {
                id,
            },
        });
        if (!affectedCount) {
            throw new BadRequestException(TRANSACTION_NOT_DELETED);
        }
        await this.redisService.client.del('transactions');
        return true;
    }
}
