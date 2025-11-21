import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useFloorStore } from '../stores/floorStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const ELEMENT_TYPES = [
  { type: 'bar', icon: '🍷', label: 'Bar', defaultWidth: 200, defaultHeight: 80 },
  { type: 'wall', icon: '🧱', label: 'Mur', defaultWidth: 150, defaultHeight: 20 },
  { type: 'door', icon: '🚪', label: 'Porte', defaultWidth: 60, defaultHeight: 80 },
  { type: 'window', icon: '🪟', label: 'Fenêtre', defaultWidth: 120, defaultHeight: 40 },
  { type: 'plant', icon: '🪴', label: 'Plante', defaultWidth: 50, defaultHeight: 50 },
];

export const AddElementScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const createElement = useFloorStore((state) => state.createElement);

  const [selectedType, setSelectedType] = useState('bar');
  const [label, setLabel] = useState('');
  const [width, setWidth] = useState('200');
  const [height, setHeight] = useState('80');
  const [loading, setLoading] = useState(false);

  const handleTypeSelect = (type: string) => {
    const element = ELEMENT_TYPES.find(e => e.type === type);
    if (element) {
      setSelectedType(type);
      setWidth(element.defaultWidth.toString());
      setHeight(element.defaultHeight.toString());
    }
  };

  const handleCreate = async () => {
    const widthNum = parseInt(width);
    const heightNum = parseInt(height);
    if (isNaN(widthNum) || widthNum < 20 || isNaN(heightNum) || heightNum < 20) {
      Alert.alert('Erreur', 'Les dimensions doivent être au moins 20');
      return;
    }

    if (!user?.restaurant_id) {
      Alert.alert('Erreur', 'Restaurant non identifié');
      return;
    }

    setLoading(true);

    const { error } = await createElement({
      restaurant_id: user.restaurant_id,
      type: selectedType as any,
      position: { x: 150, y: 150 },
      width: widthNum,
      height: heightNum,
      label: label.trim() || undefined,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erreur', 'Impossible de créer l\'élément');
      console.error('Create element error:', error);
    } else {
      Alert.alert('Succès', 'Élément créé avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const selectedElement = ELEMENT_TYPES.find(e => e.type === selectedType);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvel élément</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Type d'élément</Text>
            <View style={styles.typesGrid}>
              {ELEMENT_TYPES.map(element => (
                <TouchableOpacity
                  key={element.type}
                  style={[styles.typeOption, selectedType === element.type && styles.typeOptionSelected]}
                  onPress={() => handleTypeSelect(element.type)}
                >
                  <Text style={styles.typeIcon}>{element.icon}</Text>
                  <Text style={[styles.typeLabel, selectedType === element.type && styles.typeLabelSelected]}>
                    {element.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Label (optionnel)</Text>
            <Input
              value={label}
              onChangeText={setLabel}
              placeholder="Ex: Bar principal, Mur nord..."
            />
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Dimensions (pixels)</Text>
            <Input label="Largeur" value={width} onChangeText={setWidth} keyboardType="number-pad" />
            <Input label="Hauteur" value={height} onChangeText={setHeight} keyboardType="number-pad" />
          </Card>

          <Button title="Créer l'élément" onPress={handleCreate} disabled={loading} style={styles.createButton} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 10, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { width: 70 },
  backButtonText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  typesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeOption: { width: '30%', padding: 16, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center' },
  typeOptionSelected: { backgroundColor: '#DBEAFE', borderColor: '#007AFF' },
  typeIcon: { fontSize: 32, marginBottom: 8 },
  typeLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  typeLabelSelected: { color: '#007AFF' },
  createButton: { marginTop: 8 },
});
