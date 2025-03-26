import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionCategories, TransactionTypes } from 'src/common/constants';

export class UpdateTransactionDto {
    @ApiPropertyOptional({
        example: '1000',
        description: 'Sum of the transaction',
    })
    @IsOptional()
    @IsNumber()
    amount: number;

    @ApiPropertyOptional({
        example: 'INCOME',
        description: 'Type of the transaction',
        enum: TransactionTypes,
    })
    @IsOptional()
    @IsEnum(TransactionTypes)
    type: TransactionTypes;

    @ApiPropertyOptional({
        example: 'SALARY',
        description: 'Category of the transaction',
        enum: TransactionCategories,
    })
    @IsOptional()
    @IsEnum(TransactionCategories)
    category: TransactionCategories;

    @ApiPropertyOptional({
        example: 'Salary from the company',
        description: 'Description of the transaction',
    })
    @IsOptional()
    @IsString()
    description: string;
}
