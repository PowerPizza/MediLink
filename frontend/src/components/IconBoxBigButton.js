import { FontAwesome } from "@expo/vector-icons";
import { View, Image, Text, StyleSheet, Pressable, TouchableHighlight, TouchableOpacity } from "react-native";
import { COLORS } from "../colors/colors";

export default function IconBoxBigButton({iconName, text, onPress=()=>{}}) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={style.container}>
                <View style={style.icon}>
                    <FontAwesome name={iconName} size={44} color={COLORS.deepDarkGreen} />
                </View>
                <Text style={style.text}>{text}</Text>
                <FontAwesome name="angle-right" size={38} color={COLORS.deepDarkGreen} style={style.arrow} />
            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 12,
        paddingLeft: 18,
        paddingRight: 18,
        gap: 10,
        borderRadius: 14
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.lightGreen,
        borderRadius: '50%',
        width: 60,
        height: 60,
    },
    text: {
        fontFamily: 'RobotoRegular',
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.deepDarkGreen,
        textAlign: 'center',
        margin: 'auto'
    },
    arrow: {
    }
})