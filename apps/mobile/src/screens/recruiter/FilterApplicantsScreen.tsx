import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Applicant {
  applicant_id: string;
  name: string;
  university: string;
  major: string;
  applied_role: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  email: string;
  cv_name: string;
}

const INITIAL_APPLICANTS: Applicant[] = [
  {
    applicant_id: 'a1',
    name: 'Jordan Smith',
    university: 'University of Leeds',
    major: 'BSc Computer Science',
    applied_role: 'Frontend Engineering Intern',
    status: 'Pending',
    email: 'j.smith@uni.ac.uk',
    cv_name: 'Jordan_Smith_CV.pdf',
  },
  {
    applicant_id: 'a2',
    name: 'Sarah Jenkins',
    university: 'University of Bristol',
    major: 'MSc Data Science',
    applied_role: 'Data Analyst Intern',
    status: 'Pending',
    email: 'sarah.j@bristol.ac.uk',
    cv_name: 'S_Jenkins_Resume.pdf',
  },
  {
    applicant_id: 'a3',
    name: 'Alex Rivera',
    university: 'UCL',
    major: 'BSc Business Analytics',
    applied_role: 'Data Analyst Intern',
    status: 'Accepted',
    email: 'a.rivera@ucl.ac.uk',
    cv_name: 'AR_Analytics_CV.pdf',
  },
];

export default function FilterApplicantsScreen({ navigation }: any) {
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected'>('All');

  // Propagate decisions backward from details view
  const updateApplicantStatus = (id: string, nextStatus: 'Accepted' | 'Rejected') => {
    setApplicants(prev => prev.map(app => app.applicant_id === id ? { ...app, status: nextStatus } : app));
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.applied_role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Accepted': return { bg: '#def7ec', text: '#03543f' };
      case 'Rejected': return { bg: '#fde8e8', text: '#9b1c1c' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeader}>Review Applicants</Text>

      {/* Real-time Search Input */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by name or role..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips Row */}
      <View style={styles.filterRow}>
        {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map(status => (
          <TouchableOpacity 
            key={status}
            style={[styles.chip, activeFilter === status && styles.activeChip]}
            onPress={() => setActiveFilter(status)}
          >
            <Text style={[styles.chipText, activeFilter === status && styles.activeChipText]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render Feed */}
      {filteredApplicants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No matching applicants found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplicants}
          keyExtractor={(item) => item.applicant_id}
          renderItem={({ item }) => {
            const badge = getBadgeStyle(item.status);
            return (
              <TouchableOpacity 
                style={styles.applicantCard}
                onPress={() => navigation.navigate('ApplicantDetails', { 
                  applicant: item, 
                  onDecision: updateApplicantStatus 
                })}
              >
                <View style={styles.cardMain}>
                  <Text style={styles.applicantName}>{item.name}</Text>
                  <Text style={styles.applicantRole}>{item.applied_role}</Text>
                  <Text style={styles.applicantSub}>{item.university} • {item.major}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  screenHeader: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#111827' },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb' },
  activeChip: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#4b5563' },
  activeChipText: { color: '#fff' },
  applicantCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardMain: { flex: 1, paddingRight: 8 },
  applicantName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  applicantRole: { fontSize: 13, fontWeight: '500', color: '#4f46e5', marginBottom: 2 },
  applicantSub: { fontSize: 12, color: '#6b7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 32 },
  emptyText: { color: '#6b7280' },
});