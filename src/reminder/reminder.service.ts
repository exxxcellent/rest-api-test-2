import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReminderService {
    @Cron('0 12 * * *', { timeZone: 'Europe/Moscow' })
    handleReminder() {
        console.log('Андрей, проверь финансы...');
    }
}
