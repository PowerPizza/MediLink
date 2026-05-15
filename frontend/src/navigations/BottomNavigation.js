import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { THEME } from "../themes/theme";
import { COLORS } from "../colors/colors";

const Tab = createBottomTabNavigator();

function TabIconMaker(icon_name) {
    return ({size, color}) => <FontAwesome name={icon_name} size={size} color={color} />
}

export default function BottomTabNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: COLORS.darkGreen,
            tabBarStyle: {backgroundColor: THEME.light.bottomBarBG, borderRadius: 18},
            headerTitleStyle: {color: COLORS.deepDarkGreen},
            headerStyle: {backgroundColor: THEME.light.primaryLightColor, borderBottomStartRadius: 18, borderBottomEndRadius: 18}
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: TabIconMaker('home'), tabBarActiveBackgroundColor: COLORS.lightGreen2 }} />
            <Tab.Screen name="Home2" component={HomeScreen} options={{ tabBarIcon: TabIconMaker('home'), tabBarActiveBackgroundColor: COLORS.lightGreen2 }} />
        </Tab.Navigator>
    )
}