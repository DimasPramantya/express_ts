// sama seperti dto
import { z } from 'zod'; 

const register = z.object({
    email: z.string().email(),
    username: z.string().min(3), 
    password: z.string().min(8), 
});

const login = z.object({
    username: z.string(),
    password: z.string()
})

export default {
    register, login
}