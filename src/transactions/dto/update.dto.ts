import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionCategories, TransactionTypes } from 'src/common/constants';

export class UpdateTransactionDto {
    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsEnum(TransactionTypes)
    type: TransactionTypes;

    @IsOptional()
    @IsEnum(TransactionCategories)
    category: TransactionCategories;

    @IsOptional()
    @IsString()
    description: string;
}
