import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../colors/colors";

export default function TextTypeInput({iconName, value, onChangeText, placeholder = "Text", style, isValid = true, ...props}) {
  return (
    <View style={[styles.container, style, !isValid ? {borderColor: COLORS.lightRed} : {}]}>
      {iconName ? 
        <View style={[styles.iconContainer, !isValid ? {backgroundColor: COLORS.lightRed} : {}]}>
          <FontAwesome name={iconName} size={22} color={!isValid ? COLORS.darkRed: COLORS.darkGreen} />
        </View>
      : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A8A8"
        style={styles.input}
        {...props}
      />
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
    alignSelf: 'stretch',
    borderRadius: 14,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
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
});
