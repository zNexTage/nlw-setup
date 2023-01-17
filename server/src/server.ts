import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from '@fastify/cors';

const app = Fastify();

const prisma = new PrismaClient()

app.register(cors, {
    origin: ['http://localhost:3000']
}); //CORS config

app.get('/', async () => {
    // const habits = await prisma.habit.findMany({
    //     where:{
    //         title:{
    //             startsWith: 'Beber'
    //         }
    //     }
    // });

    const habits = await prisma.habit.findMany();

    return habits;
});

const PORT = 3333;

app.listen({
    port: PORT
}, (err, address) => {
    console.log(`HTTP Server running! ${address}`);
});