import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
    EMAIL_IS_EXISTS,
    PASSWORD_INCORRECT,
    REFRESH_TOKEN_NOT_FOUND,
    REFRESH_TOKEN_NOT_VALID,
    USER_NOT_FOUND,
} from 'src/common/constants';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    async login(
        { email, password }: LoginDto,
        userAgent: string,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const user = await this.userService.getByEmail(email);
        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND);
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new BadRequestException(PASSWORD_INCORRECT);
        }
        const accessToken = await this.tokenService.generateAccessToken(
            email,
            user.name,
        );
        const token = await this.tokenService.getTokenByUserId(user.id);
        if (token === null) {
            const newRefreshToken =
                await this.tokenService.generateRefreshToken(
                    user.email,
                    user.name,
                );
            await this.tokenService.saveRefreshToken(
                user.id.toString(),
                newRefreshToken,
                userAgent,
            );
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        }
        return {
            accessToken,
            refreshToken: token?.refreshToken,
        };
    }

    async register(
        userDto: RegisterDto,
        userAgent: string,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const userIsExists = await this.userService.getByEmail(userDto.email);
        if (userIsExists) {
            throw new BadRequestException(EMAIL_IS_EXISTS);
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const user = await this.userService.create({
            ...userDto,
            password: hashedPassword,
        });
        const { accessToken, refreshToken } =
            await this.tokenService.generateTokens(user);
        await this.tokenService.saveRefreshToken(
            user.id.toString(),
            refreshToken,
            userAgent,
        );
        return {
            accessToken,
            refreshToken,
        };
    }

    async refresh(refreshToken: string, userAgent: string) {
        const token = await this.tokenService.getTokenByRefresh(refreshToken);
        if (!token) throw new NotFoundException(REFRESH_TOKEN_NOT_FOUND);
        const tokenIsValid =
            await this.tokenService.validateRefreshToken(refreshToken);
        if (!tokenIsValid) {
            throw new NotFoundException(REFRESH_TOKEN_NOT_VALID);
        }
        const user = await this.userService.getById(token.userId);
        if (!user) throw new NotFoundException(USER_NOT_FOUND);
        const accessToken = await this.tokenService.generateAccessToken(
            user.email,
            user.name,
        );
        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(refreshToken: string) {
        const token = await this.tokenService.getTokenByRefresh(refreshToken);
        if (!token) throw new NotFoundException(USER_NOT_FOUND);
        await this.tokenService.removeToken(refreshToken);
    }

    async getUsers() {
        return await this.userService.getAll();
    }

    async getTokens() {
        return await this.tokenService.getAll();
    }
}
