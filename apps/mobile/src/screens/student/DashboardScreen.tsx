import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// In a real app, this comes from your AuthContext or global state matching your DB schema
const LOGGED_IN_STUDENT = {
  user_id: 'js-9921',
  name: 'Jordan Smith',
  email: 'j.smith@uni.ac.uk',
  university: 'University of Leeds',
  major: 'BSc Computer Science',
};

interface Application {
  application_id: string;
  title: string;
  company_name: string;
  status: 'Applied' | 'In review' | 'Interview' | 'Offer' | 'Rejected';
}

export default function DashboardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(LOGGED_IN_STUDENT);
  const [stats, setStats] = useState({ applied: 6, inReview: 3, offers: 1 });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats and actual student applications mapped from 'applications' DB table
      setRecentApplications([
        {
          application_id: 'app-1',
          title: 'Software engineering intern',
          company_name: 'Northwind labs',
          status: 'In review',
        },
        {
          application_id: 'app-2',
          title: 'Product analytics intern',
          company_name: 'Fenwick co',
          status: 'Offer',
        },
        {
          application_id: 'app-3',
          title: 'Data science intern',
          company_name: 'Arbor systems',
          status: 'Applied',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Offer': return { bg: '#def7ec', text: '#03543f' };
      case 'In review': return { bg: '#fef3c7', text: '#92400e' };
      case 'Interview': return { bg: '#e1effe', text: '#1e429f' };
      case 'Rejected': return { bg: '#fde8e8', text: '#9b1c1c' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={40} color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{student.name}</Text>
          <Text style={styles.universityText}>{student.university} • {student.major}</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}><Text style={styles.avatarText}>JS</Text></View>
        </TouchableOpacity>
      </View>

      {/* Overview Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Applied</Text>
          <Text style={styles.statNumber}>{stats.applied}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>In review</Text>
          <Text style={styles.statNumber}>{stats.inReview}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Offers</Text>
          <Text style={styles.statNumber}>{stats.offers}</Text>
        </View>
      </View>

      {/* Recent Applications Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent applications</Text>
        {recentApplications.map((app) => {
          const colors = getStatusColor(app.status);
          return (
            <View key={app.application_id} style={styles.appRow}>
              <View style={styles.appInfo}>
                <Text style={styles.appTitle}>{app.title}</Text>
                <Text style={styles.appCompany}>{app.company_name}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                <Text style={[styles.statusText, { color: colors.text }]}>{app.status}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Browse')}>
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Browse New Internships</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#6b7280' }]} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="document-text" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Go to Document Hub</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  welcomeText: { fontSize: 14, color: '#6b7280', marginBottom: 2 },
  nameText: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 4 },
  universityText: { fontSize: 14, color: '#4b5563' },
  avatarButton: { padding: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#0369a1', fontWeight: '700', fontSize: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderStyle: 'solid', borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  statLabel: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  statNumber: { fontSize: 28, fontWeight: '700', color: '#111827' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  appRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  appInfo: { flex: 1 },
  appTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  appCompany: { fontSize: 13, color: '#6b7280' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  actionsContainer: { marginBottom: 32 },
  actionButton: { backgroundColor: '#4f46e5', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 12 },
});