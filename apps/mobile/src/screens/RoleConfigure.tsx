import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

type UserRole = 'student' | 'recruiter' | 'security_admin' | null;

interface RoleSelectionProps {
  onRoleSelected: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelected }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Career & Internship Hub</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        {/* Role Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => onRoleSelected('student')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.studentIcon]}>
              <Text style={styles.icon}>👤</Text>
            </View>
            <Text style={styles.roleName}>Student</Text>
            <Text style={styles.roleDescription}>
              Browse internship opportunities and apply to companies
            </Text>
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>Continue as Student →</Text>
            </View>
          </TouchableOpacity>

          {/* Recruiter Card */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => onRoleSelected('recruiter')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.recruiterIcon]}>
              <Text style={styles.icon}>🏢</Text>
            </View>
            <Text style={styles.roleName}>Recruiter</Text>
            <Text style={styles.roleDescription}>
              Post internship opportunities and find top talent
            </Text>
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>Continue as Recruiter →</Text>
            </View>
          </TouchableOpacity>

          {/* Security Admin Card */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => onRoleSelected('security_admin')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.adminIcon]}>
              <Text style={styles.icon}>🔐</Text>
            </View>
            <Text style={styles.roleName}>Security Admin</Text>
            <Text style={styles.roleDescription}>
              Manage user accounts and system security
            </Text>
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>Continue as Security Admin →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can change your role anytime in settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  cardsContainer: {
    marginBottom: 40,
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 'auto',
  },
  studentIcon: {
    backgroundColor: '#eff6ff',
  },
  recruiterIcon: {
    backgroundColor: '#f0fdf4',
  },
  adminIcon: {
    backgroundColor: '#fef3c7',
  },
  icon: {
    fontSize: 44,
  },
  roleName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default RoleSelection;