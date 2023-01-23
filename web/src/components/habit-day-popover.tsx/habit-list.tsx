import * as  Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';

interface IHabitList {
    date: Date;
    onCompletedChanged: (completed: number) => void;
}

interface IHabitsInfo {
    possibleHabits: Array<{
        id: string,
        title: string,
        createdAt: string
    }>,
    completedHabits: Array<string>
}

const HabitList = ({ date, onCompletedChanged }: IHabitList) => {
    const [habitsInfo, setHabitsInfo] = useState<IHabitsInfo>();

    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString()
            }
        })
            .then((response) => {
                setHabitsInfo(response.data);
            })
            .catch(err => {

            })
    }, []);

    const handleToggleHabit = async (habitId: string) => {
        await api.patch(`/habits/${habitId}/toggle`);

        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

        let completedHabits: Array<string> = [];

        if (isHabitAlreadyCompleted) {
            //remove from list
            completedHabits = habitsInfo!.completedHabits.filter(id => habitId !== id);
        } else {
            //add in list
            completedHabits = [...habitsInfo!.completedHabits, habitId];
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits
        });

        onCompletedChanged(completedHabits.length);
    }

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

    return (
        <div className='mt-6 flex flex-col gap-3'>
            {
                habitsInfo?.possibleHabits.map(habit => (
                    <Checkbox.Root
                        key={habit.id}
                        disabled={isDateInPast}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        checked={habitsInfo.completedHabits.includes(habit.id)}
                        onClick={event => event.stopPropagation()}
                        className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'>

                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                            <Checkbox.Indicator>
                                <Check
                                    size={20}
                                    className='text-white'
                                />
                            </Checkbox.Indicator>
                        </div>

                        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                            {habit.title}
                        </span>

                    </Checkbox.Root>
                ))
            }


        </div>
    )
}

export default HabitList;