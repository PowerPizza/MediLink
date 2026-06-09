import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthBaseScreen from "../screens/auth/AuthBaseScreen";
import PatientInitialScreen from "../screens/auth/patient-auth/PatientInitialScreen";
import DoctorInitialScreen from "../screens/auth/doctor-auth/DoctorInitialScreen";
import { COLORS } from "../colors/colors";
import { THEME } from "../themes/theme";

const AuthStack = createNativeStackNavigator();
export default function AuthNavigations() {
    return (
        <AuthStack.Navigator initialRouteName="auth-base" screenOptions={{headerStyle: {backgroundColor: THEME.light.topBarBG}, headerTintColor: COLORS.white}}>
            <AuthStack.Screen name="auth-base" component={AuthBaseScreen} options={{headerShown: false}} />
            <AuthStack.Screen name="doctor-base" component={DoctorInitialScreen} options={{title: ''}} />
            <AuthStack.Screen name="patient-base" component={PatientInitialScreen} options={{title: ''}} />
        </AuthStack.Navigator>
    );
}
