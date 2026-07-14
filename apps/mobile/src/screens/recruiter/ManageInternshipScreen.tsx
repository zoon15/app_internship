import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Internship } from './RecruiterDashboardScreen';

export default function ManageInternshipScreen({ route, navigation }: any) {
  const { internship, onSave } = route.params || {};
  const isEditing = !!internship;

  // Form State variables matching the database schema properties
  const [title, setTitle] = useState(internship?.title || '');
  const [location, setLocation] = useState(internship?.location || '');
  const [duration, setDuration] = useState(internship?.duration_months?.toString() || '');
  const [salary, setSalary] = useState(internship?.salary_range || '');
  const [description, setDescription] = useState(internship?.description || '');
  const [requirements, setRequirements] = useState(internship?.requirements || '');

  const handleSave = () => {
    if (!title || !location || !duration || !description) {
      Alert.alert('Incomplete Form', 'Please fill in Title, Location, Duration, and Description.');
      return;
    }

    const payload: Internship = {
      internship_id: isEditing ? internship.internship_id : `int-${Date.now()}`,
      title,
      location,
      duration_months: parseInt(duration, 10) || 3,
      description,
      salary_range: salary,
      requirements,
    };

    onSave(payload);
    Alert.alert('Success', `Internship listing successfully ${isEditing ? 'updated' : 'posted'}.`);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.screenHeader}>{isEditing ? 'Edit Internship' : 'Post New Internship'}</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., Software Engineering Intern" 
            value={title} 
            onChangeText={setTitle} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., London, UK or Remote" 
            value={location} 
            onChangeText={setLocation} 
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Duration (Months) *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., 3" 
              keyboardType="numeric"
              value={duration} 
              onChangeText={setDuration} 
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Est. Compensation</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., £2,500/mo" 
              value={salary} 
              onChangeText={setSalary} 
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Description *</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Outline overall daily tasks, team functions, and mission statements..." 
            multiline 
            numberOfLines={4}
            value={description} 
            onChangeText={setDescription} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Core Requirements</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Key skills, prior language exposure, target major prerequisites..." 
            multiline 
            numberOfLines={3}
            value={requirements} 
            onChangeText={setRequirements} 
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Save Changes' : 'Post Internship'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  screenHeader: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 20 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 32 },
  inputGroup: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 12, fontWeight: '600', color: '#4b5563', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827', backgroundColor: '#fff' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});