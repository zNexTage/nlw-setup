import { TouchableOpacity } from "react-native"
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const { goBack, canGoBack } = useNavigation();

    const onPress = () => {
        if (!canGoBack) return;
        goBack();
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Feather
                name="arrow-left"
                size={32}
                color={colors.zinc[400]}
            />
        </TouchableOpacity>
    )
}

export default BackButton;