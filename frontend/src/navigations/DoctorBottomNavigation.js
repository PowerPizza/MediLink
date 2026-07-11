import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../colors/colors";
import { THEME } from "../themes/theme";
import HomeScreen from "../screens/doctor/HomeScreen";
import ReportsScreen from "../screens/doctor/ReportsScreen";
import ProfileScreen from "../screens/doctor/ProfileScreen";
import { createStackNavigator } from '@react-navigation/stack';
import CreateReportScreen from "../screens/doctor/CreateReportScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const appBarTheme = {
    headerTitleStyle: {color: COLORS.deepDarkGreen},
    headerStyle: {backgroundColor: THEME.light.primaryColor, borderBottomStartRadius: 18, borderBottomEndRadius: 18}
}

const Tab = createBottomTabNavigator();

function TabIconMaker(icon_name) {
    return ({size, color}) => <FontAwesome name={icon_name} size={size} color={color} />
}

const ReportsStack = createStackNavigator();
function ReportsNavigationStack() {
    return (
        <ReportsStack.Navigator initialRouteName="Reports" screenOptions={{ headerShown: true, ...appBarTheme }}>
            <ReportsStack.Screen component={ReportsScreen} name="Reports" />
            <ReportsStack.Screen component={CreateReportScreen} name="CreateReport" />
        </ReportsStack.Navigator>
    )
}

export default function DoctorBottomNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: COLORS.darkGreen,
            tabBarStyle: {backgroundColor: THEME.light.bottomBarBG, borderRadius: 18},
            ...appBarTheme
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: TabIconMaker('home') }} />
            <Tab.Screen name="ReportNavs" component={ReportsNavigationStack} options={{tabBarIcon: TabIconMaker('sticky-note'), tabBarLabel: "Reports", headerTitle: "Reports" }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: TabIconMaker('user-circle-o') }} />
        </Tab.Navigator>
    )
}