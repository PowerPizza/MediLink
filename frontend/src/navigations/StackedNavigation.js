import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigations from "./AuthStackNavigation";
import AuthBaseScreen from "../screens/auth/AuthBaseScreen";
import DoctorBottomNavigation from "./DoctorBottomNavigation";

const Stack = createNativeStackNavigator();

export default function StackNavigation({isLoggedIn, role}) {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={!isLoggedIn ? "authNavs" : (role === "doctor" ? "doctorNavs" : "")}>
            <Stack.Screen name="authNavs" component={AuthNavigations} />
            <Stack.Screen name="doctorNavs" component={DoctorBottomNavigation} />
        </Stack.Navigator>
    );
}