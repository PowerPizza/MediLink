import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../colors/colors';
import { THEME } from '../themes/theme';

export default function ExpandableView({
  title = 'Expandable Section',
  children,
  headerStyle = {},
  contentStyle = {},
  initialExpanded = false,
  onToggle = () => {},
  backgroundColor = THEME.light.secondaryLightColor,
  borderColor = COLORS.lightGray,
  iconColor = COLORS.gray,
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const rotateAnim = React.useRef(new Animated.Value(initialExpanded ? 1 : 0)).current;

  const toggleExpand = () => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
    onToggle(!isExpanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        style={[styles.header, headerStyle]}
      >
        <Text style={styles.headerText}>{title}</Text>

        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={iconColor}
          />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lazyBlack,
    marginLeft: 12,
    flex: 1,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});
