import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigations from "./AuthStackNavigation";
import AuthBaseScreen from "../screens/auth/AuthBaseScreen";
import DoctorBottomNavigation from "./DoctorBottomNavigation";
import PatientBottomNavigation from "./PatientBottomNavigation";

const Stack = createNativeStackNavigator();

export default function StackNavigation({isLoggedIn, role}) {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={!isLoggedIn ? "authNavs" : (role === "doctor" ? "doctorNavs" : role === "patient" ? "patientNavs": "")}>
            <Stack.Screen name="authNavs" component={AuthNavigations} />
            <Stack.Screen name="doctorNavs" component={DoctorBottomNavigation} />
            <Stack.Screen name="patientNavs" component={PatientBottomNavigation} />
        </Stack.Navigator>
    );
}