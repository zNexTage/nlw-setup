import { createNativeStackNavigator } from '@react-navigation/native-stack';


const {
    Navigator,
    Screen
} = createNativeStackNavigator();

import Home from '../screens/home';
import New from '../screens/new';
import Habit from '../screens/habit';

const AppRoutes = () => {
    return (
        <Navigator screenOptions={{
            headerShown: false
        }}>
            <Screen
                name='home'
                component={Home}
            />

            <Screen
                name='new'
                component={New}
            />

            <Screen
                name='habit'
                component={Habit}
            />
        </Navigator>
    )
}

export default AppRoutes;

