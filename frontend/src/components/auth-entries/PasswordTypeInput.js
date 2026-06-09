import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../colors/colors";

export default function PasswordTypeInput({value, onChangeText, placeholder = "Password", style, ...props}) {
  const [secureText, setSecureText] = useState(true);

  return (
    <View style={[styles.container]}>
      <View style={styles.iconContainer}>
        <FontAwesome name="lock" size={22} color={COLORS.darkGreen} />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A8A8"
        secureTextEntry={secureText}
        style={styles.input}
        {...props}
      />

      <Pressable onPress={() => setSecureText(!secureText)} style={styles.eyeButton} >
        <FontAwesome name={secureText ? "eye-slash" : "eye"} size={22} color="#9A9A9A" />
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: COLORS.lightGray,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.lazyBlack,
    fontWeight: "500",
  },

  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
