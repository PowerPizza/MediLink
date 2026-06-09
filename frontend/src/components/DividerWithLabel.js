import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../colors/colors';

export default function DividerWithLabel({ label = '' }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />

      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  line: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.lightGray,
  },

  label: {
    marginHorizontal: 10,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
});