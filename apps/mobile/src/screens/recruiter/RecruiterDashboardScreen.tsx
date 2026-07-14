import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock Database State matching your 'internships' table schema
export interface Internship {
  internship_id: string;
  title: string;
  location: string;
  duration_months: number;
  description: string;
  salary_range?: string;
  requirements?: string;
}

const INITIAL_INTERNSHIPS: Internship[] = [
  {
    internship_id: 'int-1',
    title: 'Frontend Engineering Intern',
    location: 'Remote',
    duration_months: 3,
    description: 'Build components using React Native and assist with beautiful layout design systems.',
    salary_range: '£2,500 - £3,000 / month',
    requirements: 'Familiarity with JS/TS, React, and CSS styling layouts.',
  },
  {
    internship_id: 'int-2',
    title: 'Data Analyst Intern',
    location: 'London (Hybrid)',
    duration_months: 6,
    description: 'Work alongside the strategy team parsing and cleaning core product pipelines.',
    salary_range: '£2,800 / month',
    requirements: 'SQL, Python (Pandas/NumPy), and basic Tableau skills.',
  },
];

export default function RecruiterDashboardScreen({ navigation }: any) {
  const [internships, setInternships] = useState<Internship[]>(INITIAL_INTERNSHIPS);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to permanently delete this internship listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setInternships(prev => prev.filter(item => item.internship_id !== id));
          },
        },
      ]
    );
  };

  const handleSaveInternship = (updatedOrNew: Internship) => {
    setInternships(prev => {
      const exists = prev.some(item => item.internship_id === updatedOrNew.internship_id);
      if (exists) {
        return prev.map(item => item.internship_id === updatedOrNew.internship_id ? updatedOrNew : item);
      }
      return [updatedOrNew, ...prev];
    });
  };

  return (
    <View style={styles.container}>
      {/* Recruiter Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Recruiter Space</Text>
          <Text style={styles.companyText}>Global Tech Corp</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('ManageInternship', { 
            onSave: handleSaveInternship 
          })}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Post Role</Text>
        </TouchableOpacity>
      </View>

      {/* Overview Stat Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Live Listings</Text>
          <Text style={styles.statValue}>{internships.length}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.statCard, styles.interactiveCard]}
          onPress={() => navigation.navigate('FilterApplicants')}
        >
          <Text style={styles.statLabel}>Pending Reviews</Text>
          <Text style={[styles.statValue, { color: '#4f46e5' }]}>5</Text>
        </TouchableOpacity>
      </View>

      {/* List of Active Internships */}
      <Text style={styles.sectionTitle}>Manage Live Listings</Text>
      
      {internships.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No active listings found.</Text>
        </View>
      ) : (
        <FlatList
          data={internships}
          keyExtractor={(item) => item.internship_id}
          renderItem={({ item }) => (
            <View style={styles.internshipCard}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.location} • {item.duration_months} months</Text>
                </View>
                <View style={styles.actionIcons}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('ManageInternship', { 
                      internship: item, 
                      onSave: handleSaveInternship 
                    })}
                  >
                    <Ionicons name="pencil" size={18} color="#4b5563" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => handleDelete(item.internship_id)}
                  >
                    <Ionicons name="trash" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  companyText: { fontSize: 24, fontWeight: '700', color: '#111827' },
  addButton: { backgroundColor: '#111827', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  interactiveCard: { borderColor: '#e0e7ff', backgroundColor: '#f5f3ff' },
  statLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  internshipCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  cardMeta: { fontSize: 13, color: '#6b7280' },
  actionIcons: { flexDirection: 'row', gap: 12 },
  iconButton: { padding: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyText: { color: '#6b7280', marginTop: 12, fontSize: 14 },
});