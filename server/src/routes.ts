import { FastifyInstance } from 'fastify';
import prisma from "./lib/prisma";
import { z } from 'zod';
import dayjs from 'dayjs';

// Routes functions must be async
const appRoutes = async (app: FastifyInstance) => {
    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekdays: z.array(z.number().min(0).max(6))
        });

        //zod validate the request body;

        const { title, weekdays } = createHabitBody.parse(request.body);

        // startOf - set the time to: 00:00:00
        const today = dayjs().startOf('day').toDate();


        await prisma.habit.create({
            data: {
                title,
                createdAt: today,
                weekdays: {
                    create: weekdays.map(weekday => {
                        return {
                            weekday
                        }
                    })
                }
            }
        })
    });

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date() //convert a string parameter to date
        });

        const { date } = getDayParams.parse(request.query);

        const parsedDate = dayjs(date).startOf('day');

        const possibleHabits = await prisma.habit.findMany({
            where: {
                createdAt: {
                    lte: date
                },
                weekdays: {
                    some: {
                        weekday: dayjs(parsedDate).get('day')
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabit: true
            }
        })

        const completedHabits = day?.dayHabit.map(habit =>{
            return habit.habitId
        });

        return {
            possibleHabits,
            completedHabits
        }
    });

}

export default appRoutes;