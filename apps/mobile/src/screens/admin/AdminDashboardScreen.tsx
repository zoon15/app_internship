import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

interface UserProfile {
  email: string;
  role: 'student' | 'recruiter' | 'security_admin';
  status: 'Active' | 'Suspended';
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  module: string;
}

interface SystemStats {
  active_users: number;
  failed_logins: number;
  access_requests: number;
  server_uptime: string;
  api_health: string;
  storage_used: string;
  active_sessions: string;
}

const BACKEND_URL = 'http://172.20.10.2:8000';

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    active_users: 0,
    failed_logins: 0,
    access_requests: 0,
    server_uptime: '0%',
    api_health: '0%',
    storage_used: '0%',
    active_sessions: '0%'
  });

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, logsRes, statsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/users`),
        fetch(`${BACKEND_URL}/api/logs`),
        fetch(`${BACKEND_URL}/api/admin/stats`)
      ]);

      if (usersRes.ok && logsRes.ok && statsRes.ok) {
        setUsers(await usersRes.json());
        setLogs(await logsRes.json());
        setStats(await statsRes.json());
      }
    } catch (error) {
      console.error('Error fetching dashboard records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const updateUserStatus = async (email: string, targetStatus: 'Active' | 'Suspended') => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/status?email=${email}&status=${targetStatus}`, {
        method: 'PUT',
      });
      if (res.ok) {
        Alert.alert('Status Updated', `${email} has been set to ${targetStatus}`);
        loadAdminData();
      } else {
        const errorText = await res.text();
        Alert.alert('Update Failed', errorText || 'Status could not be updated.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to your backend.');
    }
  };

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getCleanName = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>System security</Text>
          <Text style={styles.headerSubtitle}>Encryption active • last audit: just now</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={onLogout}>
          <Text style={styles.exitButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        {/* Row 1: Key Metric Cards */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.metricLabel, { color: '#718096' }]}>Active users</Text>
            <Text style={[styles.metricVal, { color: '#1A202C' }]}>{stats.active_users}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#FFF5F5' }]}>
            <Text style={[styles.metricLabel, { color: '#E53E3E' }]}>Failed logins (24h)</Text>
            <Text style={[styles.metricVal, { color: '#C53030' }]}>{stats.failed_logins}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#FEFCBF' }]}>
            <Text style={[styles.metricLabel, { color: '#D69E2E' }]}>Access requests</Text>
            <Text style={[styles.metricVal, { color: '#B7791F' }]}>{stats.access_requests}</Text>
          </View>
        </View>

        {/* Row 2: Diagnostics Progress Indicators */}
        <View style={styles.diagnosticContainer}>
          <View style={styles.diagnosticRow}>
            <View style={styles.diagnosticCol}>
              <Text style={styles.diagnosticLabel}>Server uptime ({stats.server_uptime})</Text>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '99%', backgroundColor: '#2F855A' }]} /></View>
            </View>
            <View style={styles.diagnosticCol}>
              <Text style={styles.diagnosticLabel}>API response health ({stats.api_health})</Text>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '97%', backgroundColor: '#2F855A' }]} /></View>
            </View>
          </View>

          <View style={styles.diagnosticRow}>
            <View style={styles.diagnosticCol}>
              <Text style={styles.diagnosticLabel}>Storage used ({stats.storage_used})</Text>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '62%', backgroundColor: '#9C4221' }]} /></View>
            </View>
            <View style={styles.diagnosticCol}>
              <Text style={styles.diagnosticLabel}>Active sessions ({stats.active_sessions})</Text>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '41%', backgroundColor: '#2B6CB0' }]} /></View>
            </View>
          </View>
        </View>

        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search live users..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Section: Manage Users */}
        <Text style={styles.sectionHeader}>MANAGE USERS</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#3182CE" style={{ marginVertical: 20 }} />
        ) : (
          filteredUsers.map(item => (
            <View key={item.email} style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(item.email)}</Text>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{getCleanName(item.email)}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                
                {/* Role Tag */}
                <View style={[styles.roleTag, item.role === 'security_admin' && styles.roleAdmin]}>
                  <Text style={styles.roleTagText}>{item.role.replace('_', ' ')}</Text>
                </View>
              </View>

              {/* Status Indicator Badge */}
              <View style={[styles.statusIndicator, item.status === 'Active' ? styles.statusActive : styles.statusSuspended]}>
                <Text style={{ 
                  fontSize: 10, 
                  fontWeight: 'bold', 
                  color: item.status === 'Active' ? '#22543D' : '#9B2C2C' 
                }}>
                  {item.status}
                </Text>
              </View>

              {/* Dual Action Buttons (Active / Suspend) */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.actionButton, 
                    styles.activateButton,
                    item.status === 'Active' && styles.disabledButton
                  ]}
                  onPress={() => updateUserStatus(item.email, 'Active')}
                  disabled={item.status === 'Active'}
                >
                  <Text style={[
                    styles.actionButtonText, 
                    styles.activateText,
                    item.status === 'Active' && styles.disabledText
                  ]}>
                    Activate
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton, 
                    styles.suspendButton,
                    item.status === 'Suspended' && styles.disabledButton
                  ]}
                  onPress={() => updateUserStatus(item.email, 'Suspended')}
                  disabled={item.status === 'Suspended'}
                >
                  <Text style={[
                    styles.actionButtonText, 
                    styles.suspendText,
                    item.status === 'Suspended' && styles.disabledText
                  ]}>
                    Suspend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Section: Dynamic Database-Backed Security Overview */}
        <Text style={styles.sectionHeader}>MANAGE SECURITY - ROLES AND PERMISSIONS</Text>
        <View style={styles.rolesPanel}>
          <View style={styles.roleRow}>
            <View>
              <Text style={styles.roleRowTitle}>Student</Text>
              <Text style={styles.roleRowSub}>Own applications and documents only</Text>
            </View>
            <Text style={styles.roleCounter}>
              {users.filter(u => u.role === 'student').length} accounts
            </Text>
          </View>
          <View style={styles.roleRow}>
            <View>
              <Text style={styles.roleRowTitle}>Recruiter</Text>
              <Text style={styles.roleRowSub}>Applications for own postings only</Text>
            </View>
            <Text style={styles.roleCounter}>
              {users.filter(u => u.role === 'recruiter').length} accounts
            </Text>
          </View>
          <View style={[styles.roleRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.roleRowTitle}>Security Admin</Text>
              <Text style={styles.roleRowSub}>Full system access, logged</Text>
            </View>
            <Text style={styles.roleCounter}>
              {users.filter(u => u.role === 'security_admin').length} account
            </Text>
          </View>
        </View>

        {/* Section: Recent Activity Security Log */}
        <Text style={styles.sectionHeader}>RECENT ACTIVITY</Text>
        <View style={styles.logsPanel}>
          {logs.slice(0, 5).map(item => (
            <View key={item.id} style={styles.logItem}>
              <View style={styles.logLeft}>
                <View style={[styles.dot, item.level === 'WARN' && styles.dotWarn]} />
                <Text style={styles.logMsg}>{item.message}</Text>
              </View>
              <Text style={styles.logTime}>{item.timestamp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FA' },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  headerSubtitle: { fontSize: 13, color: '#718096', marginTop: 2 },
  exitButton: { backgroundColor: '#E53E3E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  exitButtonText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  scrollArea: { paddingHorizontal: 16 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14 },
  metricCard: { flex: 1, padding: 14, borderRadius: 8, marginHorizontal: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  metricLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  metricVal: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  diagnosticContainer: { backgroundColor: '#FFF', borderRadius: 8, padding: 14, marginBottom: 14 },
  diagnosticRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  diagnosticCol: { flex: 1, marginHorizontal: 6 },
  diagnosticLabel: { fontSize: 11, color: '#4A5568', fontWeight: '600', marginBottom: 4 },
  progressBarBg: { height: 6, backgroundColor: '#EDF2F7', borderRadius: 3, width: '100%' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  searchInput: { backgroundColor: '#FFF', borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, fontSize: 14, marginBottom: 14, color: '#1A202C' },
  sectionHeader: { fontSize: 12, fontWeight: 'bold', color: '#718096', textTransform: 'uppercase', marginTop: 14, marginBottom: 8, marginHorizontal: 4 },
  userCard: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderColor: '#E2E8F0', borderWidth: 1 },
  avatarContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EDF2F7', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontSize: 13, fontWeight: '700', color: '#4A5568' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  userEmail: { fontSize: 11, color: '#718096', marginTop: 1, marginBottom: 4 },
  roleTag: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#EBF8FF' },
  roleAdmin: { backgroundColor: '#FED7D7' },
  roleTagText: { fontSize: 9, color: '#2B6CB0', fontWeight: 'bold', textTransform: 'capitalize' },
  statusIndicator: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 8 },
  statusActive: { backgroundColor: '#C6F6D5' },
  statusSuspended: { backgroundColor: '#FED7D7' },
  actionButtonsContainer: { flexDirection: 'column', gap: 4 },
  actionButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', minWidth: 72 },
  actionButtonText: { fontSize: 11, fontWeight: '700' },
  activateButton: { borderColor: '#48BB78', backgroundColor: '#F0FFF4' },
  activateText: { color: '#2F855A' },
  suspendButton: { borderColor: '#E53E3E', backgroundColor: '#FFF5F5' },
  suspendText: { color: '#C53030' },
  disabledButton: { borderColor: '#E2E8F0', backgroundColor: '#F7F9FA' },
  disabledText: { color: '#A0AEC0' },
  rolesPanel: { backgroundColor: '#FFF', borderRadius: 8, borderColor: '#E2E8F0', borderWidth: 1, paddingHorizontal: 14, marginBottom: 14 },
  roleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  roleRowTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  roleRowSub: { fontSize: 11, color: '#718096', marginTop: 1 },
  roleCounter: { fontSize: 12, color: '#A0AEC0', fontWeight: '600' },
  logsPanel: { backgroundColor: '#FFF', borderRadius: 8, borderColor: '#E2E8F0', borderWidth: 1, padding: 14, marginBottom: 30 },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  logLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#48BB78', marginRight: 10 },
  dotWarn: { backgroundColor: '#F56565' },
  logMsg: { fontSize: 13, color: '#2D3748', flex: 1 },
  logTime: { fontSize: 12, color: '#A0AEC0' },
});

export default AdminDashboardScreen;