import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity, Alert } from 'react-native';
import { FloorElement } from '../../types';

interface FloorElementComponentProps {
  element: FloorElement;
  onPositionChange?: (x: number, y: number) => void;
  onDelete?: (elementId: string) => void;
  editable?: boolean;
}

const ELEMENT_ICONS: Record<string, string> = {
  bar: '🍷',
  wall: '🧱',
  door: '🚪',
  window: '🪟',
  plant: '🪴',
};

const ELEMENT_COLORS: Record<string, string> = {
  bar: '#92400E',
  wall: '#9CA3AF',
  door: '#6B7280',
  window: '#60A5FA',
  plant: '#10B981',
};

export const FloorElementComponent: React.FC<FloorElementComponentProps> = ({
  element,
  onPositionChange,
  onDelete,
  editable = false,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: element.position.x, y: element.position.y })).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return editable && (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2);
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        setIsDragging(false);
        if (onPositionChange) {
          onPositionChange(pan.x._value, pan.y._value);
        }
      },
    })
  ).current;

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'élément',
      `Voulez-vous vraiment supprimer cet élément ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete && onDelete(element.id)
        }
      ]
    );
  };

  const getElementStyle = () => {
    const baseStyle = {
      width: element.width,
      height: element.height,
      backgroundColor: ELEMENT_COLORS[element.type] || '#9CA3AF',
    };

    if (element.type === 'wall') {
      return {
        ...baseStyle,
        borderRadius: 4,
      };
    } else if (element.type === 'door') {
      return {
        ...baseStyle,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4B5563',
      };
    } else if (element.type === 'window') {
      return {
        ...baseStyle,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#3B82F6',
        backgroundColor: '#DBEAFE',
      };
    } else {
      return {
        ...baseStyle,
        borderRadius: 12,
      };
    }
  };

  return (
    <Animated.View
      {...(editable ? panResponder.panHandlers : {})}
      style={[
        styles.container,
        getElementStyle(),
        {
          transform: [
            ...pan.getTranslateTransform(),
            { rotate: `${element.rotation || 0}deg` }
          ],
        },
        isDragging && styles.dragging,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{ELEMENT_ICONS[element.type] || '📦'}</Text>
        {element.label && (
          <Text style={styles.label} numberOfLines={1}>{element.label}</Text>
        )}
      </View>

      {editable && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  dragging: {
    opacity: 0.7,
    shadowOpacity: 0.4,
    elevation: 8,
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 2,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
