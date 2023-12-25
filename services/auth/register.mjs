import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { responseConstructor } from "../../utils/common.mjs";

const prisma = new PrismaClient();

export const register = async (event) => {
    try {
        const { body } = event;
        const userData = JSON.parse(body);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Perform registration logic using Prisma queries
        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                updatedAt: new Date()
            },
        });

        const token = jwt.sign(user, process.env.JWT_SECRETE, {
            expiresIn: '1h', // You can set the expiration time as needed
        });

        return responseConstructor(200, { message: 'Registration successful', user, token });
       
    } catch (error) {
        return responseConstructor(500, { message: 'Error Registering',error });
    } finally {
        await prisma.$disconnect();
    }
};

const handler = register
        
export {handler};

