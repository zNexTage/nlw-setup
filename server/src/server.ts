import Fastify from "fastify";
import cors from '@fastify/cors';
import appRoutes from "./routes";

const app = Fastify();

app.register(cors, {
    origin: ['http://localhost:5173']
}); //CORS config

app.register(appRoutes);

const PORT = 3333;

app.listen({
    port: PORT
}, (err, address) => {
    console.log(`HTTP Server running! ${address}`);
});