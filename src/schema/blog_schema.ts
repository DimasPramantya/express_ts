import { z } from 'zod'; 
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

const create = z.object({
    title: z.string(),
    content: z.string(),
    fileId: z.number(),
});

export default {
    create
}