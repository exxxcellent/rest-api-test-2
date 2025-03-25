import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { TransactionCategories, TransactionTypes } from 'src/common/constants';

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsEnum(TransactionTypes)
    type: TransactionTypes;

    @IsNotEmpty()
    @IsEnum(TransactionCategories)
    category: TransactionCategories;

    @IsOptional()
    @IsString()
    description?: string;
}
