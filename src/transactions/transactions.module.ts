import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from 'src/common/models/transactions.model';
import { UserModule } from 'src/user/user.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
    imports: [SequelizeModule.forFeature([Transaction]), UserModule],
    controllers: [TransactionsController],
    providers: [TransactionsService],
})
export class TransactionsModule {}
