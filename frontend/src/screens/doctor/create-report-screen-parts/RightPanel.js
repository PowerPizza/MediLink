import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../colors/colors";

export default function RightPanel() {
    return (
        <View style={style.rightPanelBody}>
            
        </View>
    )
}

const style = StyleSheet.create({
    rightPanelBody: {
        backgroundColor: COLORS.lightGray,
        width: 150,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray1,
        marginLeft: 'auto',
    },
});