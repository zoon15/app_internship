import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

export default function App() {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [message, setMessage] = useState('Connecting to backend...');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/health');
        const data = await response.json();
        setMessage(data.status === 'ok' ? 'Backend connected successfully' : 'Backend responded');
      } catch (error) {
        setMessage('Backend not reachable yet');
      } finally {
        setStatus('ready');
      }
    };

    fetchHealth();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Phase 1 MVP Shell</Text>
        <Text style={styles.subtitle}>Frontend connected to FastAPI backend.</Text>
        {status === 'loading' ? (
          <ActivityIndicator size="large" color="#4f46e5" style={styles.spinner} />
        ) : null}
        <Text style={styles.status}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 12,
  },
  status: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
});
