import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'example@mail.ru', description: 'Email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '12345678', description: 'Password' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'Username' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
