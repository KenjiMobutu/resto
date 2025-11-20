import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Table, TableStatus } from '../../types';

interface TableComponentProps {
  table: Table;
  onPositionChange?: (x: number, y: number) => void;
  editable?: boolean;
}

const STATUS_COLORS: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: '#10B981',
  [TableStatus.OCCUPIED]: '#EF4444',
  [TableStatus.RESERVED]: '#F59E0B',
  [TableStatus.CLEANING]: '#6B7280',
};

export const TableComponent: React.FC<TableComponentProps> = ({
  table,
  onPositionChange,
  editable = false,
}) => {
  const translateX = useSharedValue(table.position.x);
  const translateY = useSharedValue(table.position.y);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      if (editable) {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;
      }
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const getShapeStyle = () => {
    if (table.shape === 'circle') {
      return {
        width: table.width,
        height: table.width,
        borderRadius: table.width / 2,
      };
    }
    return {
      width: table.width,
      height: table.height,
      borderRadius: 8,
    };
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={editable}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          getShapeStyle(),
          { backgroundColor: STATUS_COLORS[table.status] },
        ]}
      >
        <Text style={styles.number}>{table.number}</Text>
        <Text style={styles.capacity}>{table.capacity} pers.</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  capacity: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 2,
  },
});
