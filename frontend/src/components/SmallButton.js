import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { THEME } from "../themes/theme";
import { COLORS } from "../colors/colors";

export default function SmallButton({title, onPress = ()=>{}, disabled = false, btnStyle}) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={[style.button, disabled ? style.buttonDisabled : {}, btnStyle]} onPress={disabled ? ()=>{} : onPress}>
            <Text style={style.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    button: {
        backgroundColor: THEME.light.buttonBG,
        padding: 6,
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5
    },
    buttonText: {
        fontSize: 16,
        color: COLORS.white
    },
    buttonDisabled: {
        backgroundColor: COLORS.lightGray1,
        opacity: 0.8
    }
})