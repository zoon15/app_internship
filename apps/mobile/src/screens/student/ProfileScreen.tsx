import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

interface StudentProfile {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  graduation_year: number;
  bio: string;
  linkedin_uri: string;
  portfolio_uri: string;
}

interface DocumentFile {
  name: string;
  size?: number;
  uri: string;
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Real-world matched defaults from DB requirements schema
  const [profile, setProfile] = useState<StudentProfile>({
    user_id: 'js-9921',
    name: 'Jordan Smith',
    email: 'j.smith@uni.ac.uk',
    phone: '+44 7700 900077',
    university: 'University of Leeds',
    major: 'BSc Computer Science',
    graduation_year: 2027,
    bio: 'Passionate about React Native, systems design, and beautiful user interfaces.',
    linkedin_uri: 'linkedin.com/in/jordansmith',
    portfolio_uri: 'jordansmith.dev',
  });

  const [formData, setFormData] = useState(profile);
  
  // Documents state supporting CV and Cover Letter files
  const [cvFile, setCvFile] = useState<DocumentFile | null>({
    name: 'Jordan_Smith_CV.pdf',
    size: 248832, // ~243 KB
    uri: 'mock-uri-cv',
  });
  
  const [coverLetterFile, setCoverLetterFile] = useState<DocumentFile | null>({
    name: 'Cover_letter_template.docx',
    size: 40960, // ~40 KB
    uri: 'mock-uri-cl',
  });

  // Notification Preferences matching user interface mockup
  const [notifyStatus, setNotifyStatus] = useState(true);
  const [notifyAISuggested, setNotifyAISuggested] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  const updateField = (field: keyof StudentProfile, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setProfile(formData);
    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Upload Picker Handler
  const handlePickDocument = async (docType: 'CV' | 'CoverLetter') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newDoc: DocumentFile = {
          name: file.name,
          size: file.size,
          uri: file.uri,
        };
        if (docType === 'CV') {
          setCvFile(newDoc);
        } else {
          setCoverLetterFile(newDoc);
        }
      }
    } catch (err) {
      console.error('Error selecting document:', err);
      Alert.alert('Error', 'Unable to import file.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Profile Info Layout */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>JS</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.subtitle}>Student • {profile.major}</Text>
      </View>

      {/* Edit Trigger Section */}
      <View style={styles.buttonRow}>
        {!editing ? (
          <TouchableOpacity style={styles.button} onPress={() => { setEditing(true); setFormData(profile); }}>
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditing(false)}>
              <Text style={[styles.buttonText, { color: '#4f46e5' }]}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Personal Info fields matching schema */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput style={[styles.input, !editing && styles.inputDisabled]} value={formData.name} onChangeText={(v) => updateField('name', v)} editable={editing} />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>University email</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={formData.email} editable={false} />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>University</Text>
          <TextInput style={[styles.input, !editing && styles.inputDisabled]} value={formData.university} onChangeText={(v) => updateField('university', v)} editable={editing} />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Programme</Text>
          <TextInput style={[styles.input, !editing && styles.inputDisabled]} value={formData.major} onChangeText={(v) => updateField('major', v)} editable={editing} />
        </View>
      </View>

      {/* Document Hub Integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Documents</Text>

        {/* CV Slot */}
        <View style={styles.documentRow}>
          <View style={styles.docIconContainer}>
            <Ionicons name="document-text" size={24} color="#6b7280" />
          </View>
          <View style={styles.docDetails}>
            <Text style={styles.docName} numberOfLines={1}>{cvFile ? cvFile.name : 'No CV Uploaded'}</Text>
            {cvFile?.size && <Text style={styles.docMeta}>Uploaded • {formatBytes(cvFile.size)}</Text>}
          </View>
          <TouchableOpacity style={styles.replaceButton} onPress={() => handlePickDocument('CV')}>
            <Text style={styles.replaceButtonText}>Replace</Text>
          </TouchableOpacity>
        </View>

        {/* Cover Letter Slot */}
        <View style={styles.documentRow}>
          <View style={styles.docIconContainer}>
            <Ionicons name="document-text" size={24} color="#6b7280" />
          </View>
          <View style={styles.docDetails}>
            <Text style={styles.docName} numberOfLines={1}>{coverLetterFile ? coverLetterFile.name : 'No Cover Letter Uploaded'}</Text>
            {coverLetterFile?.size && <Text style={styles.docMeta}>Uploaded • {formatBytes(coverLetterFile.size)}</Text>}
          </View>
          <TouchableOpacity style={styles.replaceButton} onPress={() => handlePickDocument('CoverLetter')}>
            <Text style={styles.replaceButtonText}>Replace</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Preferences matching Mockup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Email me when application status changes</Text>
          <Switch value={notifyStatus} onValueChange={setNotifyStatus} trackColor={{ true: '#4f46e5' }} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Email me new AI-suggested listings</Text>
          <Switch value={notifyAISuggested} onValueChange={setNotifyAISuggested} trackColor={{ true: '#4f46e5' }} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>SMS reminders for interviews</Text>
          <Switch value={notifySMS} onValueChange={setNotifySMS} trackColor={{ true: '#4f46e5' }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#4f46e5' },
  name: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280' },
  buttonRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  button: { flex: 1, backgroundColor: '#111827', borderRadius: 8, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  cancelButton: { backgroundColor: '#f3f4f6' },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#111827', backgroundColor: '#fff' },
  inputDisabled: { backgroundColor: '#f9fafb', color: '#4b5563' },
  documentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  docIconContainer: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  docDetails: { flex: 1 },
  docName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  docMeta: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  replaceButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  replaceButtonText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  switchLabel: { fontSize: 13, color: '#374151', flex: 1, paddingRight: 16 },
});