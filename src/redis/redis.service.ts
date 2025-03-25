import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    public client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL,
        });
    }

    onModuleInit() {
        this.client.connect();
        this.client.on('error', (error) => {
            console.error('Redis client error', error);
        });
    }
}
