import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/common/models';

@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
