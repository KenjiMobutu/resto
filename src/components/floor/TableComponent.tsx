import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity, Alert, Modal } from 'react-native';
import { Table, TableStatus } from '../../types';

interface TableComponentProps {
  table: Table;
  onPositionChange?: (x: number, y: number) => void;
  onPress?: (table: Table) => void;
  onDelete?: (tableId: string) => void;
  onStatusChange?: (tableId: string, status: TableStatus) => void;
  editable?: boolean;
}

const STATUS_COLORS: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: '#10B981',
  [TableStatus.OCCUPIED]: '#EF4444',
  [TableStatus.RESERVED]: '#F59E0B',
  [TableStatus.CLEANING]: '#6B7280',
};

const STATUS_LABELS: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: 'Disponible',
  [TableStatus.OCCUPIED]: 'Occupée',
  [TableStatus.RESERVED]: 'Réservée',
  [TableStatus.CLEANING]: 'Nettoyage',
};

export const TableComponent: React.FC<TableComponentProps> = ({
  table,
  onPositionChange,
  onPress,
  onDelete,
  onStatusChange,
  editable = false,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: table.position.x, y: table.position.y })).current;
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate pan responder if editable and if there's significant movement
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

  const handlePress = () => {
    if (isDragging) return; // Don't trigger press if dragging

    if (editable) {
      setShowMenu(true);
    } else if (onPress) {
      onPress(table);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert(
      'Supprimer la table',
      `Voulez-vous vraiment supprimer la table ${table.number} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete && onDelete(table.id)
        }
      ]
    );
  };

  const handleStatusChange = (status: TableStatus) => {
    setShowMenu(false);
    onStatusChange && onStatusChange(table.id, status);
  };

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
    <>
      <Animated.View
        {...(editable ? panResponder.panHandlers : {})}
        style={[
          styles.container,
          getShapeStyle(),
          { backgroundColor: STATUS_COLORS[table.status] },
          {
            transform: pan.getTranslateTransform(),
          },
          isDragging && styles.dragging,
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.number}>{table.number}</Text>
          <Text style={styles.capacity}>{table.capacity} pers.</Text>
        </TouchableOpacity>

        {editable && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Menu contextuel */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Table {table.number}</Text>

            <Text style={styles.menuSectionTitle}>Changer le statut</Text>
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.menuItem,
                  table.status === status && styles.menuItemActive
                ]}
                onPress={() => handleStatusChange(status as TableStatus)}
              >
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[status as TableStatus] }]} />
                <Text style={[
                  styles.menuItemText,
                  table.status === status && styles.menuItemTextActive
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={handleDelete}
            >
              <Text style={styles.menuItemTextDanger}>Supprimer la table</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragging: {
    opacity: 0.7,
    shadowOpacity: 0.4,
    elevation: 10,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  menuItemTextActive: {
    fontWeight: '600',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  menuItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuItemTextDanger: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
