import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { TransactionCategories, TransactionTypes } from 'src/common/constants';

export class CreateTransactionDto {
    @ApiProperty({
        example: '1',
        description: 'The user id of the transaction',
    })
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: '1000',
        description: 'Sum of the transaction',
    })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({
        example: 'INCOME',
        description: 'Type of the transaction',
        enum: TransactionTypes,
    })
    @IsNotEmpty()
    @IsEnum(TransactionTypes)
    type: TransactionTypes;

    @ApiProperty({
        example: 'SALARY',
        description: 'Category of the transaction',
        enum: TransactionCategories,
    })
    @IsNotEmpty()
    @IsEnum(TransactionCategories)
    category: TransactionCategories;

    @ApiPropertyOptional({
        example: 'Salary from the company',
        description: 'Description of the transaction',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
