import { z } from 'zod'; 
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

const register = z.object({
    email: z.string().email(),
    username: z.string().min(3), 
    password: z.string().min(8), 
});

const login = z.object({
    username: z.string(),
    password: z.string()
})

class UserResponse {
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

export default {
    register, login, UserResponse
}