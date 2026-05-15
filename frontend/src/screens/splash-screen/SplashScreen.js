import { Image, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../themes/theme";
import { COLORS } from "../../colors/colors";
import { useFonts } from "expo-font";

export default function SplashScreen() {
    return (
        <View style={style.container}>
            <View style={style.circleTop} />
            <View style={style.circleBottom} />
            <Image style={style.appIcon} source={require('../../../assets/splash-icon.png')} />
            <Text style={style.appName}>MediLink</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.light.primaryColor,
        height: '100%'
    },

    circleTop: {
        borderRadius: '50%',
        backgroundColor: THEME.light.primaryLightColor,
        position: 'absolute',
        top: -50,
        left: 120,
        width: 250,
        height: 250
    },

    circleBottom: {
        borderRadius: '50%',
        backgroundColor: THEME.light.primaryLightColor,
        position: 'absolute',
        top: '75%',
        left: '-30%',
        width: 250,
        height: 250
    },

    appName: {
        fontFamily: 'RobotoSlabRegular',
        fontSize: 34,
        color: COLORS.white
    },

    appIcon: {
        width: 120,
        height: 120
    }
})