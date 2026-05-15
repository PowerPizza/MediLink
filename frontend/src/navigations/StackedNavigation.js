import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "./BottomNavigation";
import AuthNavigations from "./AuthStackNavigation";
import AuthBaseScreen from "../screens/auth/AuthBaseScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="authNavs">
            <Stack.Screen name="authNavs" component={AuthNavigations} />
            <Stack.Screen name="bottomNav" component={BottomTabNavigation} />
        </Stack.Navigator>
    );
}