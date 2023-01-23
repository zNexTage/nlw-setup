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

        const completedHabits = day?.dayHabit.map(habit => {
            return habit.habitId
        }) ?? [];

        return {
            possibleHabits,
            completedHabits
        }
    });

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params);

        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        });

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        //user has completed the habit?
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                dayId_habitId: {
                    dayId: day.id,
                    habitId: id
                }
            }
        });

        if (dayHabit) {            
            await prisma.dayHabit.delete({
                where:{
                    id: dayHabit.id
                }
            })
        }
        else {
            //complete a habit
            await prisma.dayHabit.create({
                data: {
                    dayId: day.id,
                    habitId: id
                }
            });
        }
    });

    app.get('/summary', async ()=>{
        // [ {date: 17/01, amount: 5, completed: 1}, {}, {} ]

        const summary = await prisma.$queryRaw`
            SELECT D.id, D.date,
            (
                SELECT CAST(count(*) AS FLOAT)
                FROM daysHabits AS DH
                WHERE DH.dayId = D.id
            ) AS completed,
            (
                SELECT CAST(count(*) AS FLOAT)
                FROM habitWeekdays AS HWD
                JOIN habits H ON H.id = HWD.habitId
                WHERE HWD.weekday = CAST(strftime('%w', D.date/1000.0, 'unixepoch') as INT)
                AND H.createdAt <= D.date

            ) AS amount
            FROM days as D
        `;

        return summary;
    }); 
}

export default appRoutes;