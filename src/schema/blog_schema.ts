import { z } from 'zod'; 
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

const create = z.object({
    title: z.string(),
    content: z.string(),
    fileId: z.string(),
});

const update = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    fileId: z.string(),
});

export default {
    create, update
}