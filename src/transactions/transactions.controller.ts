import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create.dto';
import { UpdateTransactionDto } from './dto/update.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post('')
    async create(@Body() dto: CreateTransactionDto) {
        return await this.transactionsService.create(dto);
    }

    @Get('')
    async getAll() {
        return await this.transactionsService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.transactionsService.getById(id);
    }

    @Patch(':id')
    async updateById(
        @Param('id') id: string,
        @Body() dto: UpdateTransactionDto,
    ) {
        return await this.transactionsService.updateById(id, dto);
    }

    @Delete(':id')
    async deleteById(@Param('id') id: string) {
        return await this.transactionsService.deleteById(id);
    }
}
