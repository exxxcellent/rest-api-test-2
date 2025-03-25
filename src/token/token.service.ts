import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { REFRESH_TOKEN_NOT_FOUND } from 'src/common/constants';
import { User } from 'src/common/models';
import { Token } from 'src/common/models/jwt.model';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token) private tokenModel: typeof Token,
        private readonly jwtService: JwtService,
    ) {}

    async getAll() {
        return await this.tokenModel.findAll();
    }

    async getTokenByRefresh(refreshToken: string) {
        return await this.tokenModel.findOne({
            where: {
                refreshToken,
            },
        });
    }

    async getTokenByUserId(userId: number): Promise<Token | null> {
        const token = await this.tokenModel.findOne({
            where: {
                userId,
            },
        });
        if (!token) return null;
        return token;
    }

    async generateTokens({ email, name }: User) {
        const accessToken = await this.generateAccessToken(email, name);
        const refreshToken = await this.generateRefreshToken(email, name);
        return {
            accessToken,
            refreshToken,
        };
    }

    async generateAccessToken(email: string, name: string) {
        const sub = {
            email,
            name,
        };
        return await this.jwtService.signAsync(sub, {
            expiresIn: '1h',
            secret: process.env.ACCESS_TOKEN_SECRET,
        });
    }

    async generateRefreshToken(email: string, name: string) {
        const sub = {
            email,
            name,
        };
        return await this.jwtService.signAsync(sub, {
            expiresIn: '1d',
            secret: process.env.REFRESH_TOKEN_SECRET,
        });
    }

    async validateAccessToken(accessToken: string) {
        await this.jwtService.verifyAsync(accessToken, {
            secret: process.env.ACCESS_TOKEN_SECRET,
        });
    }

    async validateRefreshToken(refreshToken: string) {
        return await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.REFRESH_TOKEN_SECRET,
        });
    }

    async saveRefreshToken(
        userId: string,
        refreshToken: string,
        userAgent: string,
    ) {
        const refreshTokenInDb = await this.getTokenByUserId(+userId);
        if (!refreshTokenInDb) {
            return await this.tokenModel.create({
                userId,
                refreshToken,
                userAgent,
            });
        }
        if (refreshTokenInDb.userAgent === userAgent) {
            await this.tokenModel.update(
                { refreshToken },
                {
                    where: {
                        userAgent,
                        userId,
                    },
                },
            );
        }
    }

    async removeToken(refreshToken: string) {
        const refreshTokenInDb = await this.getTokenByRefresh(refreshToken);
        if (!refreshTokenInDb)
            throw new NotFoundException(REFRESH_TOKEN_NOT_FOUND);
        await this.tokenModel.destroy({
            where: {
                refreshToken,
            },
        });
    }
}
