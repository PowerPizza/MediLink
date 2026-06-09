import { Animated, Easing, Modal, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../colors/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

export default function LoaderOverlay() {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();
    }, []);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.outerContainer}>
            <Animated.View style={{transform: [{rotate: rotation}], width: 54, height: 54}}>
                <FontAwesome name="spinner" size={54} color={COLORS.white} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.modalBlackBG,
        alignItems: 'center',
        justifyContent: 'center'
    }
})