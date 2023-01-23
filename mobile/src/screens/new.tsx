import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import BackButton from "../components/back-button";
import Checkbox from "../components/checkbox";
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";
import api from "../lib/axios";

const avaibleWeekdays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
]

const New = () => {
    const [weekdays, setWeekdays] = useState<number[]>([]);

    const [title, setTitle] = useState('');

    const handleToggleWeekday = (weekdayIndex: number) => {
        // remove checked from checkbox;
        if (weekdays.includes(weekdayIndex)) {

            setWeekdays(weekdays.filter((weekday) => weekday !== weekdayIndex));
        }
        else {
            setWeekdays([...weekdays, weekdayIndex]);
        }
    }

    const handleCreateNewHabit = async () => {
        try {
            if (!title.trim() || weekdays.length === 0) {
                Alert.alert('Novo hábito', 'Informe o nome do hábito e escolha a periodicidade');
            }

            await api.post('/habits', { title, weekdays });

            setTitle('');
            setWeekdays([]);

            Alert.alert('Novo hábito', 'Hábito criado com sucesso!');
        } catch (error) {
            console.log(error);

            Alert.alert('Ops', 'Não foi possível criar o novo hábito');
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}>

                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Exercícios, dormir bem, etc..."
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white focus:border-2 border-zinc-800 focus:border-green-600"
                    placeholderTextColor={colors.zinc[400]}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    avaibleWeekdays.map((weekday, index) => {
                        return (
                            <Checkbox
                                onPress={() => handleToggleWeekday(index)}
                                key={weekday}
                                title={weekday}
                                checked={weekdays.includes(index)}
                            />
                        )
                    })
                }

                <TouchableOpacity
                    onPress={handleCreateNewHabit}
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>

                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default New;