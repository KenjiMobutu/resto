import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#3B82F6',
  textColor = '#FFF',
  size = 'medium',
}) => {
  return (
    <View style={[styles.badge, styles[size], { backgroundColor: color }]}>
      <Text style={[styles.text, styles[`${size}Text`], { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 13,
  },
});
