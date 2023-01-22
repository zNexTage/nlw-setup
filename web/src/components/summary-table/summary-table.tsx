import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "../../lib/axios";
import generateDatesFromYearBeginnig from "../../utils/generate-dates-from-year-beginnig";
import HabitDay from "../habit-day/habit-day";

const weekdays = [
    'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
]

const summaryDates = generateDatesFromYearBeginnig();

const minSummarySize = 18 * 7;
const amountOfDaysToFill = minSummarySize - summaryDates.length;

type Summary = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number
}>

const SummaryTable = () => {
    const [summary, setSummary] = useState<Summary>([]);

    useEffect(() => {
        api.get('summary')
            .then(response => {
                setSummary(response.data);
            })
            .catch((err) => {
                console.log(err);
                alert('Ocorreu um erro...')
            })
    }, []);

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {
                    weekdays.map((weekday, index) => {
                        return (
                            <div
                                key={`${weekday}-${index}`}
                                className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
                                {weekday}
                            </div>
                        )
                    })
                }
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                    summaryDates.map(date => {
                        const dayInSummary = summary.find(day => {
                            return dayjs(date).isSame(day.date, 'day');
                        });

                        return (
                            <HabitDay
                                date={date}
                                amount={dayInSummary?.amount}
                                completed={dayInSummary?.completed}
                                key={date.toString()}
                            />
                        )
                    })
                }

                {
                    amountOfDaysToFill > 0 &&
                    Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                        return (
                            <div
                                key={index}
                                className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SummaryTable;