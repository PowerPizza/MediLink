import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../colors/colors";
import { THEME } from "../themes/theme";

export default function SubmitButton({title = "Submit", onPress, loading = false, disabled = false, style, children}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}

      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.light.buttonBG,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    elevation: 4,
    flexDirection: 'row',
    gap: 10
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});