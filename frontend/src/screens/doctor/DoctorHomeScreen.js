import { Text, View } from "react-native";
import { COMMON_STYLES } from "../../commons/common-styles";

export default function DoctorHomeScreen() {
    return (
        <View style={COMMON_STYLES.screenContent}>
            <Text>Welcome back doctor!</Text>
        </View>
    );
}