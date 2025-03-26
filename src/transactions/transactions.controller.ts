import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create.dto';
import { UpdateTransactionDto } from './dto/update.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @ApiOperation({ summary: 'Create transaction' })
    @ApiResponse({
        status: 201,
        description: 'Transaction created successfully',
    })
    @Post('')
    async create(@Body() dto: CreateTransactionDto) {
        return await this.transactionsService.create(dto);
    }

    @ApiOperation({ summary: 'Get transactions (cached)' })
    @ApiResponse({
        status: 200,
        description: 'Transactions recevied successfully',
    })
    @Get('')
    async getAll() {
        return await this.transactionsService.getAllCached();
    }

    @ApiOperation({ summary: 'Get transaction by id' })
    @ApiParam({ name: 'id', type: 'string', description: 'Transaction id' })
    @ApiResponse({
        status: 200,
        description: 'Transaction recevied successfully',
    })
    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.transactionsService.getById(id);
    }

    @ApiOperation({ summary: 'Update transaction' })
    @ApiParam({ name: 'id', type: 'string', description: 'Transaction id' })
    @ApiResponse({
        status: 200,
        description: 'Update transaction successfully',
    })
    @Patch(':id')
    async updateById(
        @Param('id') id: string,
        @Body() dto: UpdateTransactionDto,
    ) {
        return await this.transactionsService.updateById(id, dto);
    }

    @ApiOperation({ summary: 'Delete transaction' })
    @ApiParam({ name: 'id', type: 'string', description: 'Transaction id' })
    @ApiResponse({
        status: 200,
        description: 'Delete transaction successfully',
    })
    @HttpCode(204)
    @Delete(':id')
    async deleteById(@Param('id') id: string) {
        return await this.transactionsService.deleteById(id);
    }
}
