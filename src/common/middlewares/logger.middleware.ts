import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        switch (req.method) {
            case 'GET': {
                console.log(req.ip, req.baseUrl, req.method);
                break;
            }
            case 'POST':
            case 'PUT':
            case 'PUTCH':
            case 'DELETE': {
                const log = {
                    body: req.body,
                    headers: req.headers,
                };
                console.log(
                    req.ip,
                    req.baseUrl,
                    req.method,
                    JSON.stringify(log, null, 2),
                );
            }
            default: {
                break;
            }
        }
        next();
    }
}
