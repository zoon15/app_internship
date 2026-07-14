import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface SignUpProps {
  role?: 'student' | 'recruiter' | 'security_admin';
  onBackPressed?: () => void;
  onSignUpSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({
  role = 'student',
  onBackPressed,
  onSignUpSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID_HERE', 
    androidClientId: 'YOUR_ANDROID_CLIENT_ID_HERE',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'internhub',
    }),
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      handleGoogleSignUpBackend(response.authentication.accessToken);
    }
  }, [response]);

  const handleStandardSignUp = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password;
    const cleanConfirm = confirmPassword;

    if (!cleanEmail || !cleanPassword || !cleanConfirm) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    console.log(`[SignUp] Attempting connection to http://172.20.10.2:8000/api/auth/register...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // Connects to your Mac's backend using your hotspot IP
      const res = await fetch('http://172.20.10.2:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          role: role,
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register account.');
      }

      setIsLoading(false);
      Alert.alert('Success', 'Your InternHub account has been registered!', [
        { text: 'Log In Now', onPress: () => { if (onSignUpSuccess) onSignUpSuccess(); } }
      ]);
    } catch (error: any) {
      setIsLoading(false);
      clearTimeout(timeoutId);
      
      console.log('[SignUp Error Detail]:', error);

      if (error.name === 'AbortError') {
        Alert.alert(
          'Connection Timeout',
          'The server took too long to respond. Make sure your Python backend is still running on port 8000.'
        );
      } else {
        Alert.alert(
          'Registration Failed',
          'Could not reach the server. Make sure your laptop is connected to your hotspot!'
        );
      }
    }
  };

  const handleGoogleSignUpBackend = async (googleToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://172.20.10.2:8000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken, role: role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google verification failed.');

      setIsLoading(false);
      if (onSignUpSuccess) onSignUpSuccess();
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Google Sign-Up Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onBackPressed} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>InternHub</Text>
          <Text style={styles.subtitle}>Create a new {role.replace('_', ' ')} profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#8E9CAE"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8E9CAE"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#8E9CAE"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleStandardSignUp} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signUpButtonText}>Register</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={() => promptAsync()}
            disabled={isLoading || !request}
          >
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11141A' },
  innerContainer: { flex: 1, justifyContent: 'center' },
  navBar: { paddingHorizontal: 20, paddingVertical: 10, position: 'absolute', top: 20, left: 0, right: 0, zIndex: 10 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#1A1F2C', borderRadius: 6 },
  backButtonText: { color: '#8E9CAE', fontWeight: '600', fontSize: 14 },
  formContainer: { paddingHorizontal: 24, width: '100%' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#8E9CAE', marginBottom: 32, textAlign: 'center', textTransform: 'capitalize' },
  input: { backgroundColor: '#1A1F2C', color: '#FFF', borderWidth: 1, borderColor: '#2F3746', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  signUpButton: { backgroundColor: '#3182CE', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  signUpButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  googleButton: { backgroundColor: '#FFF', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  googleButtonText: { color: '#11141A', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { opacity: 0.6 },
});

export default SignUp;