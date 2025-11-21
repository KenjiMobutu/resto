import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { useFloorStore } from '../stores/floorStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { TableStatus } from '../types';

export const AddTableScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const createTable = useFloorStore((state) => state.createTable);

  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [shape, setShape] = useState<'circle' | 'rectangle' | 'square'>('circle');
  const [width, setWidth] = useState('80');
  const [height, setHeight] = useState('80');
  const [loading, setLoading] = useState(false);

  const shapes: Array<'circle' | 'rectangle' | 'square'> = ['circle', 'rectangle', 'square'];
  const capacityOptions = [2, 4, 6, 8, 10, 12];

  const handleCreate = async () => {
    if (!number.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de table');
      return;
    }

    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      Alert.alert('Erreur', 'Veuillez entrer une capacité valide');
      return;
    }

    const widthNum = parseInt(width);
    const heightNum = parseInt(height);
    if (isNaN(widthNum) || widthNum < 40 || isNaN(heightNum) || heightNum < 40) {
      Alert.alert('Erreur', 'Les dimensions doivent être au moins 40');
      return;
    }

    if (!user?.restaurant_id) {
      Alert.alert('Erreur', 'Restaurant non identifié');
      return;
    }

    setLoading(true);

    const { error } = await createTable({
      restaurant_id: user.restaurant_id,
      number,
      capacity: capacityNum,
      status: TableStatus.AVAILABLE,
      position: { x: 100, y: 100 }, // Position initiale par défaut
      shape,
      width: widthNum,
      height: heightNum,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erreur', 'Impossible de créer la table');
      console.error('Create table error:', error);
    } else {
      Alert.alert('Succès', 'Table créée avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle table</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Numéro */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Numéro de table</Text>
            <Input
              value={number}
              onChangeText={setNumber}
              placeholder="Ex: 1, A1, T10..."
              keyboardType="default"
            />
          </Card>

          {/* Capacité */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Capacité (personnes)</Text>
            <View style={styles.optionsGrid}>
              {capacityOptions.map(cap => (
                <TouchableOpacity
                  key={cap}
                  style={[
                    styles.optionChip,
                    capacity === cap.toString() && styles.optionChipSelected
                  ]}
                  onPress={() => setCapacity(cap.toString())}
                >
                  <Text style={[
                    styles.optionChipText,
                    capacity === cap.toString() && styles.optionChipTextSelected
                  ]}>
                    {cap}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input
              label="Autre capacité"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="number-pad"
              placeholder="4"
            />
          </Card>

          {/* Forme */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Forme</Text>
            <View style={styles.shapesGrid}>
              {shapes.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.shapeOption,
                    shape === s && styles.shapeOptionSelected
                  ]}
                  onPress={() => setShape(s)}
                >
                  <View style={[
                    styles.shapePreview,
                    s === 'circle' && styles.shapeCircle,
                    s === 'square' && styles.shapeSquare,
                    s === 'rectangle' && styles.shapeRectangle,
                    shape === s && styles.shapePreviewSelected
                  ]} />
                  <Text style={[
                    styles.shapeLabel,
                    shape === s && styles.shapeLabelSelected
                  ]}>
                    {s === 'circle' ? 'Ronde' : s === 'square' ? 'Carrée' : 'Rectangulaire'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Dimensions */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Dimensions (pixels)</Text>
            <Input
              label="Largeur"
              value={width}
              onChangeText={setWidth}
              keyboardType="number-pad"
              placeholder="80"
            />
            {shape === 'rectangle' && (
              <Input
                label="Hauteur"
                value={height}
                onChangeText={setHeight}
                keyboardType="number-pad"
                placeholder="80"
              />
            )}
            <Text style={styles.hint}>Recommandé: 60-120 pixels</Text>
          </Card>

          {/* Aperçu */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Aperçu</Text>
            <View style={styles.previewContainer}>
              <View style={[
                styles.tablePreview,
                shape === 'circle' && { borderRadius: parseInt(width) / 2 },
                shape === 'square' && { borderRadius: 8 },
                shape === 'rectangle' && { borderRadius: 8 },
                { width: parseInt(width) || 80, height: shape === 'rectangle' ? (parseInt(height) || 80) : (parseInt(width) || 80) }
              ]}>
                <Text style={styles.previewNumber}>{number || '?'}</Text>
                <Text style={styles.previewCapacity}>{capacity} pers.</Text>
              </View>
            </View>
          </Card>

          <Button
            title="Créer la table"
            onPress={handleCreate}
            disabled={loading}
            style={styles.createButton}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 10,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { width: 70 },
  backButtonText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
    alignItems: 'center',
  },
  optionChipSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#007AFF',
  },
  optionChipText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  optionChipTextSelected: { color: '#007AFF' },
  shapesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  shapeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  shapeOptionSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#007AFF',
  },
  shapePreview: {
    width: 60,
    height: 60,
    backgroundColor: '#10B981',
    marginBottom: 8,
  },
  shapePreviewSelected: {
    backgroundColor: '#007AFF',
  },
  shapeCircle: {
    borderRadius: 30,
  },
  shapeSquare: {
    borderRadius: 8,
  },
  shapeRectangle: {
    width: 80,
    height: 50,
    borderRadius: 8,
  },
  shapeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  shapeLabelSelected: {
    color: '#007AFF',
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  tablePreview: {
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  previewCapacity: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 2,
  },
  createButton: { marginTop: 8 },
});
