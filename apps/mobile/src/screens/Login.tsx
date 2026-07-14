import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';

type UserRole = 'student' | 'recruiter' | 'security_admin';
type ActiveView = 'role_selection' | 'login_form';

interface LoginProps {
  onLoginSuccess: (email: string, role: string) => void;
  onSignUpPressed: () => void;
}

const BACKEND_URL = 'http://172.20.10.2:8000';

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  student: 'Student Portal',
  recruiter: 'Recruiter Hub',
  security_admin: 'Admin Console',
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSignUpPressed }) => {
  const [view, setView] = useState<ActiveView>('role_selection');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Navigates to form for a specific role
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setView('login_form');
  };

  // Takes user back to the Role Selection screen
  const handleGoBack = () => {
    setView('role_selection');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Login Successful', `Welcome back, ${data.email}!`);
        onLoginSuccess(data.email, data.role);
      } else {
        Alert.alert('Login Failed', data.detail || 'Incorrect email, password, or role.');
      }
    } catch (error) {
      console.error('Login connection error:', error);
      Alert.alert(
        'Network Error',
        'Could not connect to the backend server. Please verify your backend server is running on 172.20.10.2:8000.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- VIEW 1: ROLE SELECTION SCREEN ---
  if (view === 'role_selection') {
    return (
      <SafeAreaWrapper>
        <ScrollView contentContainerStyle={styles.selectionScroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Text style={styles.mainTitle}>InternHub</Text>
          <Text style={styles.mainSubtitle}>Choose your role to get started</Text>

          {/* Student Card */}
          <View style={styles.roleCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#EBF8FF' }]}>
              <Text style={styles.roleIconEmoji}>👤</Text>
            </View>
            <Text style={styles.roleCardTitle}>Student</Text>
            <Text style={styles.roleCardDesc}>
              Browse internship opportunities and apply to companies
            </Text>
            <TouchableOpacity 
              style={styles.roleCardButton} 
              onPress={() => handleSelectRole('student')}
            >
              <Text style={styles.roleCardButtonText}>Continue as Student →</Text>
            </TouchableOpacity>
          </View>

          {/* Recruiter Card */}
          <View style={styles.roleCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.roleIconEmoji}>🏢</Text>
            </View>
            <Text style={styles.roleCardTitle}>Recruiter</Text>
            <Text style={styles.roleCardDesc}>
              Post internship opportunities and find top talent
            </Text>
            <TouchableOpacity 
              style={styles.roleCardButton} 
              onPress={() => handleSelectRole('recruiter')}
            >
              <Text style={styles.roleCardButtonText}>Continue as Recruiter →</Text>
            </TouchableOpacity>
          </View>

          {/* Security Admin Card */}
          <View style={styles.roleCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEFCBF' }]}>
              <Text style={styles.roleIconEmoji}>🔒</Text>
            </View>
            <Text style={styles.roleCardTitle}>Security Admin</Text>
            <Text style={styles.roleCardDesc}>
              Monitor active sessions, security logs, and manage user actions
            </Text>
            <TouchableOpacity 
              style={styles.roleCardButton} 
              onPress={() => handleSelectRole('security_admin')}
            >
              <Text style={styles.roleCardButtonText}>Continue as Admin →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaWrapper>
    );
  }

  // --- VIEW 2: SIGN-IN FORM VIEW ---
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          
          {/* Header Row featuring only back navigation */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleGoBack} disabled={isLoading} style={styles.backButton}>
              <Text style={styles.backArrowSymbol}>‹</Text>
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.formTitle}>InternHub</Text>
              <Text style={styles.roleSubBadge}>{ROLE_DISPLAY_NAMES[selectedRole]}</Text>
            </View>

            {/* Empty invisible placeholder to balance the flex layout */}
            <View style={styles.backButtonPlaceholder} />
          </View>

          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. name@domain.com"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Conditional Sign Up Banner (Hidden for Admin) */}
          {selectedRole !== 'security_admin' && (
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSignUpPressed} disabled={isLoading}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Helper component to provide consistent safe area layout for Screen 1
const SafeAreaWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS === 'ios') {
    return <View style={[styles.container, { paddingTop: 44 }]}>{children}</View>;
  }
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  selectionScroll: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 6,
  },
  mainSubtitle: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  roleCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIconEmoji: {
    fontSize: 28,
  },
  roleCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  roleCardDesc: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  roleCardButton: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleCardButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  backArrowSymbol: {
    fontSize: 38,
    fontWeight: '300',
    color: '#2B6CB0',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  roleSubBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B6CB0',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1D242E',
  },
  submitButton: {
    backgroundColor: '#2B6CB0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2B6CB0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 13,
    color: '#718096',
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B6CB0',
  },
});

export default Login;