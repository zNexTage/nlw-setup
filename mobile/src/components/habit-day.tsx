import clsx from "clsx";
import dayjs from "dayjs";
import { TouchableOpacity, Dimensions, TouchableHighlightProps } from "react-native"
import generateProgressPercentage from "../utils/generate-progess-percentage";

const WEEKDAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEKDAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

interface IHabitDay extends TouchableHighlightProps {
    amount?:number;
    completed?:number;
    date:Date;
}

const HabitDay = ({ amount = 0, completed = 0, date, ...rest }: IHabitDay) => {
    
    const amountPercentage = amount > 0 ? generateProgressPercentage(amount, completed) : 0;
    const today = dayjs().startOf('day').toDate();

    const isCurrentDay = dayjs(date).isSame(today);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={clsx('rounded-lg border-2 m-1', {
                ['bg-zinc-900 border-zinc-800']: amountPercentage == 0,
                ['bg-violet-900 border-violet-700']: amountPercentage >= 0 && amountPercentage < 20,
                ['bg-violet-800 border-violet-600']: amountPercentage >= 20 && amountPercentage < 40,
                ['bg-violet-700 border-violet-500']: amountPercentage >= 40 && amountPercentage < 60,
                ['bg-violet-600 border-violet-500']: amountPercentage >= 60 && amountPercentage < 80,
                ['bg-violet-500 border-violet-400']: amountPercentage >= 80,
                ['border-white border-4']:isCurrentDay
            })}
            style={{
                width: DAY_SIZE,
                height: DAY_SIZE
            }}
            {...rest}
        />
    )
}

export default HabitDay;