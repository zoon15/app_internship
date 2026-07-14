import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Company {
  company_id: string;
  name: string;
  logo_url?: string;
}

interface Internship {
  internship_id: string;
  title: string;
  company: Company;
  location: string;
  duration_months: number;
  description: string;
  is_ai_suggested: boolean;
  posted_time: string;
}

export default function BrowseInternshipsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    const filtered = internships.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInternships(filtered);
  }, [searchQuery, internships]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      // Data represents both manually posted and AI Sourced Listings (Use Case 5)
      setInternships([
        {
          internship_id: '1',
          title: 'Frontend engineering intern',
          company: { company_id: 'c1', name: 'Halberd systems' },
          location: 'remote',
          duration_months: 3,
          description: 'Focus on core UI flows, responsive client experiences, and modular React libraries.',
          is_ai_suggested: true,
          posted_time: 'posted 2h ago',
        },
        {
          internship_id: '2',
          title: 'Marketing intern',
          company: { company_id: 'c2', name: 'Bramwell and co' },
          location: 'London',
          duration_months: 6,
          description: 'Drive multi-channel growth campaigns and construct target consumer reports.',
          is_ai_suggested: false,
          posted_time: 'posted 1d ago',
        },
        {
          internship_id: '3',
          title: 'Backend engineering intern',
          company: { company_id: 'c3', name: 'Northwind labs' },
          location: 'hybrid',
          duration_months: 3,
          description: 'Design RESTful controllers and scale schema indices within core microservices.',
          is_ai_suggested: false,
          posted_time: 'posted 3d ago',
        },
      ]);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInternshipCard = ({ item }: { item: Internship }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('InternshipDetails', { internship: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.infoCol}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>
            {item.company.name} • {item.location} • {item.posted_time}
          </Text>
        </View>

        {item.is_ai_suggested && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI-suggested</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Layout Row matching mockup */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel-outline" size={18} color="#111827" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size={40} color="#4f46e5" />
        </View>
      ) : (
        <FlatList
          data={filteredInternships}
          renderItem={renderInternshipCard}
          keyExtractor={(item) => item.internship_id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 16, marginBottom: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#111827' },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  filterButtonText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoCol: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#6b7280' },
  aiBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  aiBadgeText: { fontSize: 11, fontWeight: '600', color: '#4f46e5' },
});
