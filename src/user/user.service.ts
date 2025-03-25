import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from 'src/auth/dto/register.dto';
import {
    USER_NOT_DELETED,
    USER_NOT_FOUND,
    USER_NOT_UPDATED,
} from 'src/common/constants';
import { User } from 'src/common/models';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async getById(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id);
        if (!user) throw new NotFoundException(USER_NOT_FOUND);
        return user;
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({
            where: {
                email,
            },
        });
    }

    async getAll(): Promise<User[]> {
        return await this.userModel.findAll();
    }

    async create(body: RegisterDto): Promise<User> {
        return await this.userModel.create({
            ...body,
        });
    }

    async update(id: number, body: Partial<User>): Promise<User> {
        const [affectedCount] = await this.userModel.update(body, {
            where: {
                id,
            },
        });
        if (affectedCount) {
            throw new BadRequestException(USER_NOT_UPDATED);
        }
        return await this.getById(id);
    }

    async deleteById(id: number): Promise<boolean> {
        const affectedCount = await this.userModel.destroy({
            where: {
                id,
            },
        });
        if (!affectedCount) {
            throw new BadRequestException(USER_NOT_DELETED);
        }
        return true;
    }
}
