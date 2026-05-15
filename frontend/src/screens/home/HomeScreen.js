import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../colors/colors";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Hello World</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
