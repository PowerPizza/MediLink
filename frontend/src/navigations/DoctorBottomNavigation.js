import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../colors/colors";
import { THEME } from "../themes/theme";
import DoctorHomeScreen from "../screens/doctor/DoctorHomeScreen";
import ReportsScreen from "../screens/doctor/ReportsScreen";
import ProfileScreen from "../screens/doctor/ProfileScreen";

const Tab = createBottomTabNavigator();

function TabIconMaker(icon_name) {
    return ({size, color}) => <FontAwesome name={icon_name} size={size} color={color} />
}

export default function DoctorBottomNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: COLORS.darkGreen,
            tabBarStyle: {backgroundColor: THEME.light.bottomBarBG, borderRadius: 18},
            headerTitleStyle: {color: COLORS.deepDarkGreen},
            headerStyle: {backgroundColor: THEME.light.primaryColor, borderBottomStartRadius: 18, borderBottomEndRadius: 18}
        }}>
            <Tab.Screen name="Home" component={DoctorHomeScreen} options={{ tabBarIcon: TabIconMaker('home') }} />
            <Tab.Screen name="Reports" component={ReportsScreen} options={{ tabBarIcon: TabIconMaker('sticky-note') }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: TabIconMaker('user-circle-o') }} />
        </Tab.Navigator>
    )
}