import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import Login from './src/screens/Login'; // Adjust the import path as needed
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen'; // Adjust the import path as needed

// Corrected Student Dashboard Placeholder
const StudentDashboard = ({ onLogout }: { onLogout: () => void }) => (
  <SafeAreaView style={styles.placeholderContainer}>
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1A202C' }}>Student Dashboard</Text>
      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// Corrected Recruiter Dashboard Placeholder
const RecruiterDashboard = ({ onLogout }: { onLogout: () => void }) => (
  <SafeAreaView style={styles.placeholderContainer}>
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1A202C' }}>Recruiter Dashboard</Text>
      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLoginSuccess = (email: string, role: string) => {
    setUserEmail(email);
    setUserRole(role); // Will be 'security_admin', 'student', or 'recruiter'
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);
  };

  const handleSignUpPressed = () => {
    console.log('Navigate to Sign Up Screen');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {!isLoggedIn ? (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onSignUpPressed={handleSignUpPressed} 
        />
      ) : (
        <>
          {userRole === 'security_admin' && (
            <AdminDashboardScreen onLogout={handleLogout} />
          )}
          
          {userRole === 'student' && (
            <StudentDashboard onLogout={handleLogout} />
          )}
          
          {userRole === 'recruiter' && (
            <RecruiterDashboard onLogout={handleLogout} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: '#E53E3E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  }
});