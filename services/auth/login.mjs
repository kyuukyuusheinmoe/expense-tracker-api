import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { responseConstructor } from "../../utils/common.mjs";

const prisma = new PrismaClient();

export const login = async (event) => {
    try {
        const { body } = event;
        const {email, password} = JSON.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid email or password' }),
            };
        }

        const token = jwt.sign(user, process.env.JWT_SECRETE, {
            expiresIn: '1h', // You can set the expiration time as needed
        });

        return responseConstructor(200, { token, user });
       
    } catch (error) {
        return responseConstructor(500, { message: 'Error Login',error });
    } finally {
        await prisma.$disconnect();
    }
};

const handler = login
        
export {handler};

