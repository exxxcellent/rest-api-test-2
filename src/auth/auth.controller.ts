import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginRto } from './rto/login.rto';
import { LogoutRto } from './rto/logout.rto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Register' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Incorrect data' })
    @Post('register')
    public async register(
        @Body() dto: RegisterDto,
        @Res() res: Response,
        @Headers() headers: Request['headers'],
    ) {
        const userAgent = headers['user-agent'] as string;
        const tokens = await this.authService.register(dto, userAgent);
        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });
        res.json(new LoginRto(tokens));
        res.end();
    }

    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 201, description: 'Loggined!' })
    @ApiResponse({ status: 400, description: 'Incorrect data' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Post('login')
    public async login(
        @Body() dto: LoginDto,
        @Res() res: Response,
        @Headers() headers: Request['headers'],
    ) {
        const userAgent = headers['user-agent'] as string;
        const tokens = await this.authService.login(dto, userAgent);
        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });
        res.json(new LoginRto(tokens));
        res.end();
    }

    @ApiOperation({ summary: 'Refresh' })
    @ApiResponse({ status: 200, description: 'Tokens recevied' })
    @ApiResponse({ status: 400, description: 'Incorrect data' })
    @ApiResponse({ status: 404, description: 'Token not found' })
    @Get('refresh')
    public async refresh(
        @Req() req: Request,
        @Res() res: Response,
        @Headers() headers: Request['headers'],
    ) {
        const { refreshToken } = req.cookies;
        const userAgent = headers['user-agent'] as string;
        const tokens = await this.authService.refresh(refreshToken, userAgent);
        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });
        res.json(new LoginRto(tokens));
        res.end();
    }

    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 200, description: 'Logout!' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get('logout')
    public async logout(@Req() req: Request, @Res() res: Response) {
        const { refreshToken } = req.cookies;
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.json(new LogoutRto());
        res.end();
    }

    // for testing
    @Get('users')
    public async getUsers() {
        return await this.authService.getUsers();
    }

    // for testing
    @Get('tokens')
    public async getTokens() {
        return await this.authService.getTokens();
    }
}
