import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { COMMON_STYLES } from "../../commons/common-styles";

export default function CreateReportScreen() {
    return (
        <View style={COMMON_STYLES.screenContent}>
            <Text>HELLO WORLD</Text>
        </View>
    );
}