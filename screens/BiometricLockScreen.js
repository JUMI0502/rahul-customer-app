// ════════════════════════════════════════════════════════════════
// BiometricLockScreen.js — New Rahul Auto Spares Customer App
// Shown at app launch when the customer has enabled Face ID /
// fingerprint app-lock. Purely a local device-level privacy gate -
// the customer's session/login with the server is already valid;
// this just confirms it's really them before showing their data.
// ════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';

const G = '#C9A84C';

export default function BiometricLockScreen({ onUnlock, onUsePinInstead }) {
  const [status, setStatus] = useState('prompting'); // prompting | failed

  useEffect(() => {
    attemptUnlock();
  }, []);

  const attemptUnlock = async () => {
    setStatus('prompting');
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock New Rahul Auto Spares',
        cancelLabel: 'Use PIN Instead',
        disableDeviceFallback: false,
      });
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUnlock();
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06060E" />
      <View style={s.center}>
        <View style={s.iconBox}>
          <Ionicons name="finger-print" size={64} color={G} />
        </View>
        <Text style={s.title}>New Rahul Auto Spares</Text>
        <Text style={s.sub}>
          {status === 'failed'
            ? "Couldn't verify it's you"
            : 'Unlock with Face ID or fingerprint'}
        </Text>

        {status === 'failed' && (
          <TouchableOpacity style={s.retryBtn} onPress={attemptUnlock}>
            <Ionicons name="finger-print" size={18} color="#07111F" />
            <Text style={s.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={s.pinBtn} onPress={onUsePinInstead}>
          <Text style={s.pinBtnText}>Use PIN Instead</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#06060E' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconBox: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(201,168,76,0.1)', borderWidth: 2, borderColor: G,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32, textAlign: 'center' },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: G, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28,
    marginBottom: 16,
  },
  retryBtnText: { color: '#07111F', fontWeight: 'bold', fontSize: 15 },
  pinBtn: { paddingVertical: 10 },
  pinBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
});
