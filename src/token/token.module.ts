import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from 'src/common/models/jwt.model';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [JwtModule, SequelizeModule.forFeature([Token]), UserModule],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
