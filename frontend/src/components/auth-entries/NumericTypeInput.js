import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../colors/colors";

const sanitizeNumeric = (text) => {
  const filtered = text.replace(/[^0-9.]/g, "");
  const [first, ...rest] = filtered.split(".");
  return rest.length ? `${first}.${rest.join("")}` : first;
};

export default function NumericTypeInput({
  iconName,
  value,
  onChangeText,
  placeholder = "0",
  style,
  isValid = true,
  ...props
}) {
  const handleChangeText = (text) => {
    const cleaned = sanitizeNumeric(text);
    if (onChangeText) {
      onChangeText(cleaned);
    }
  };

  return (
    <View style={[styles.container, style, !isValid ? { borderColor: COLORS.lightRed } : {}]}>
      {iconName ? (
        <View style={[styles.iconContainer, !isValid ? { backgroundColor: COLORS.lightRed } : {}]}>
          <FontAwesome name={iconName} size={22} color={!isValid ? COLORS.darkRed : COLORS.darkGreen} />
        </View>
      ) : null}

      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A8A8"
        keyboardType="decimal-pad"
        autoCapitalize="none"
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
    alignSelf: "stretch",
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
