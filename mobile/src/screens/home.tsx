import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import HabitDay, { DAY_SIZE } from "../components/habit-day";
import Header from "../components/header";
import Loading from "../components/loading";

import api from '../lib/axios';
import generateDatesFromYearBeginnig from "../utils/generate-dates-from-year-beginning";

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const dateFromYearStart = generateDatesFromYearBeginnig();

const minSummaryDateSizes = 18 * 5;
const amoutOfDaysToFill = minSummaryDateSizes - dateFromYearStart.length;

type Summary = Array<{
    id:string;
    date:string;
    amount:number;
    completed:number
}>

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<Summary|null>(null);

    const { navigate } = useNavigation();

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('alo mundo');
            

            const response = await api.get('/summary');

            setSummary(response.data);
        } catch (error) {            
            console.error(error);

            Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos');
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(useCallback(()=>{
        fetchData();
    }, []));

    if (loading) return <Loading />;

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    weekdays.map((weekday, index) => (
                        <Text
                            key={`${weekday}_${index}`}
                            className='text-zinc-400 text-xl font-bold text-center mx-1'
                            style={{ width: DAY_SIZE }}
                        >
                            {weekday}
                        </Text>
                    ))
                }
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            dateFromYearStart.map((date) => {
                                const dayWithHabits = summary.find(day => {
                                    dayjs(date).isSame(day.date, 'day');
                                })

                                return (
                                    <HabitDay
                                        date={date}
                                        amount={dayWithHabits?.amount}
                                        completed={dayWithHabits?.completed}
                                        onPress={() => navigate('habit', {
                                            date: date.toISOString()
                                        })}
                                        key={date.toISOString()}
                                    />
                                )
                            })
                        }

                        {
                            amoutOfDaysToFill > 0 &&
                            Array
                                .from({ length: amoutOfDaysToFill })
                                .map((_, index) => (
                                    <View
                                        key={index}
                                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                        style={{
                                            width: DAY_SIZE,
                                            height: DAY_SIZE
                                        }}
                                    />
                                ))

                        }
                    </View>
                }
            </ScrollView>


        </View>
    )
}

export default Home;