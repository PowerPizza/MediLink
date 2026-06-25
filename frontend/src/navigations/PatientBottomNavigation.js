import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../colors/colors";
import { THEME } from "../themes/theme";
import { createStackNavigator } from '@react-navigation/stack';
import CreateReportScreen from "../screens/doctor/CreateReportScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeScreen from "../screens/patient/HomeScreen";
import ProfileScreen from "../screens/patient/ProfileScreen";

const appBarTheme = {
    headerTitleStyle: {color: COLORS.deepDarkGreen},
    headerStyle: {backgroundColor: THEME.light.primaryColor, borderBottomStartRadius: 18, borderBottomEndRadius: 18}
}

const Tab = createBottomTabNavigator();

function TabIconMaker(icon_name) {
    return ({size, color}) => <FontAwesome name={icon_name} size={size} color={color} />
}

export default function PatientBottomNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: COLORS.darkGreen,
            tabBarStyle: {backgroundColor: THEME.light.bottomBarBG, borderRadius: 18},
            ...appBarTheme
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: TabIconMaker('home') }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: TabIconMaker('user-circle-o') }} />
        </Tab.Navigator>
    )
}