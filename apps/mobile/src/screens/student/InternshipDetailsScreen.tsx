import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InternshipDetailsScreen({ route, navigation }: any) {
  const { internship } = route.params;
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApply = () => {
    if (applied) {
      setApplied(false);
    } else {
      Alert.alert(
        'Submit Application',
        `Would you like to submit your saved CV and Cover Letter to ${internship.company.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Apply',
            onPress: () => {
              setApplied(true);
              Alert.alert('Success', 'Application submitted safely!');
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Panel */}
      <View style={styles.headerCard}>
        <View style={styles.companyLogoPlaceholder}>
          <Ionicons name="briefcase" size={32} color="#4f46e5" />
        </View>
        <Text style={styles.companyName}>{internship.company.name}</Text>
        <Text style={styles.jobTitle}>{internship.title}</Text>

        {internship.is_ai_suggested && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI-Suggested Opportunity</Text>
          </View>
        )}
      </View>

      {/* Grid Indicators */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailBox}>
          <Ionicons name="location-outline" size={20} color="#4f46e5" />
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{internship.location}</Text>
        </View>
        <View style={styles.detailBox}>
          <Ionicons name="calendar-outline" size={20} color="#4f46e5" />
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{internship.duration_months} months</Text>
        </View>
      </View>

      {/* About The Role Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the Role</Text>
        <Text style={styles.sectionContent}>{internship.description}</Text>
      </View>

      {/* Primary Action Row */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.button, applied && styles.buttonApplied]} 
          onPress={handleApply}
        >
          <Ionicons name={applied ? 'checkmark-circle' : 'paper-plane'} size={20} color="#fff" />
          <Text style={styles.buttonText}>{applied ? 'Applied' : 'Submit Application'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonSecondary, saved && styles.buttonSaved]} 
          onPress={() => setSaved(!saved)}
        >
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#b45309' : '#4f46e5'} />
          <Text style={[styles.buttonSecondaryText, saved && styles.buttonSavedText]}>
            {saved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerCard: { backgroundColor: '#fff', paddingVertical: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingHorizontal: 16 },
  companyLogoPlaceholder: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  companyName: { fontSize: 14, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  jobTitle: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 },
  aiBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  aiBadgeText: { fontSize: 11, fontWeight: '600', color: '#4f46e5' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  detailBox: { flex: 1, minWidth: '45%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  detailLabel: { fontSize: 11, color: '#6b7280', marginTop: 8, marginBottom: 2, textTransform: 'uppercase' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  sectionContent: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
  actionsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  button: { flex: 2, backgroundColor: '#111827', borderRadius: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonApplied: { backgroundColor: '#10b981' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  buttonSecondary: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  buttonSaved: { backgroundColor: '#fef3c7', borderColor: '#fcd34d' },
  buttonSecondaryText: { color: '#4f46e5', fontSize: 15, fontWeight: '600' },
  buttonSavedText: { color: '#92400e' },
});