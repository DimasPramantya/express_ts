import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UserDTO {
    @Expose() @IsString()
    id?: string;

    @Expose() @IsString()
    username?: string;

    @Expose() @IsEmail()
    email?: string;

    @Expose() @IsString()
    name?: string;

    @Expose() @IsOptional() @IsString()
    profilePicture?: string;
}