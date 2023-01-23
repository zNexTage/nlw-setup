import { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import BackButton from "../components/back-button";
import dayjs from 'dayjs';
import ProgressBar from "../components/progress-bar";
import Checkbox from "../components/checkbox";
import Loading from '../components/loading';
import api from '../lib/axios';
import generateProgressPercentage from '../utils/generate-progess-percentage';
import HabitsEmpty from '../components/habits-empty';
import clsx from 'clsx';

interface IHabitRouteParams {
    date: string;
}

interface IDayInfo {
    completedHabits: string[],
    possibleHabits: Array<{
        id: string,
        title: string
    }>
}

const Habit = () => {
    const route = useRoute();

    const { date } = route.params as IHabitRouteParams;

    const parsedDate = dayjs(date);
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());

    const [dayInfo, setDayInfo] = useState<IDayInfo | null>(null);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo?.possibleHabits.length, completedHabits.length) : 0;

    const [isLoading, setIsLoading] = useState(false);

    const fetchHabits = async () => {
        try {
            setIsLoading(true);

            const response = await api.get('/day', { params: date });

            setDayInfo(response.data);

            setCompletedHabits(response.data.completedHabits);
        } catch (error) {
            console.log(error);

            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos');
        }
    }

    const handleToggleHabit = async (habitId: string) => {
        try{
            await api.patch(`/habits/${habitId}/toggle`);
            
            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevState => prevState.filter(id => id !== habitId));
            }
            else {
                setCompletedHabits(prevState => [...prevState, habitId]);
    
                
            }
        }
        catch(e){
            Alert.alert('Ops', 'Não foi atualizar o status do hábito');
        }
    }

    useEffect(() => {
        fetchHabits();
    }, []);

    if (isLoading) return <Loading />;

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text
                    className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text
                    className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar
                    progress={habitsProgress} />

                <View className={clsx('mt-6', {
                    ['opacity-50']: isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits ?
                            dayInfo?.possibleHabits.map(habit => {
                                return (
                                    <Checkbox
                                        key={habit.id}
                                        title={habit.title}
                                        disabled={isDateInPast}
                                        onPress={() => handleToggleHabit(habit.id)}
                                        checked={completedHabits.includes(habit.id)}
                                    />
                                )
                            }) :
                            <HabitsEmpty />

                    }

                </View>

                {
                    isDateInPast &&
                    <Text className='text-white mt-10 text-center'>
                        Você não pode editar hábitos de uma data passada.
                    </Text>
                }
            </ScrollView>
        </View>
    )
}

export default Habit;