import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../colors/colors";
import { TextInput } from "react-native-gesture-handler";
import SmallButton from "../../../components/SmallButton";
import { useNavigation } from "@react-navigation/native";

export default function CustomTopBar() {
    const navigation = useNavigation();

    const onClickBack = () => {
        navigation.goBack();
    }

    return (
        <View style={style.topBarBody}>
            <TouchableOpacity activeOpacity={0.7} style={style.backIcon} onPress={onClickBack}>
                <FontAwesome name="arrow-left" size={24} color={COLORS.deepDarkGreen} />
            </TouchableOpacity>

            <View style={style.titleArea}>
                <Text style={style.screenTitle}>Create Report</Text>
                <TextInput value="HELLO" style={style.reportTitleInput} />
            </View>

            <View style={style.leftOptions}>
                <SmallButton title={"Save"} />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    topBarBody: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightGray,
        height: 70,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray1,
        alignItems: 'center',
        gap: 20,
    },

    backIcon: {
        marginLeft: 20,
    },

    titleArea: {
        gap: 3
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: COLORS.deepDarkGreen
    },

    reportTitleInput: {
        borderBottomColor: COLORS.darkGreen,
        borderBottomWidth: 2,
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0
    },

    leftOptions: {
        flexDirection: 'row',
        marginLeft: 'auto',
        paddingRight: 20,
    }
});