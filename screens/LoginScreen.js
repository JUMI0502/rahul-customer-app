// ════════════════════════════════════════════════════════════════
// LoginScreen.js — New Rahul Auto Spares Customer App
// Professional, modern design — Ready for Play Store
// ════════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput,
  KeyboardAvoidingView, Platform,
  ScrollView, Alert, ActivityIndicator,
  Animated, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const API_URL = 'https://rahul-auto-spares-backend.onrender.com';

export default function LoginScreen({ onCustomerLogin, onMechanicLogin, onMechanicPending }) {
  const [mode, setMode]         = useState('select');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [shopName, setShopName] = useState('');
  const [area, setArea]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [customerStep, setCustomerStep] = useState('details'); // 'details' | 'create-pin' | 'enter-pin'
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const goToMode = (m) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(m);
    setTimeout(animateIn, 10);
  };

  const handleCustomerContinue = async () => {
    if (!name.trim())       { Alert.alert('', 'Please enter your name'); return; }
    if (phone.length < 10)  { Alert.alert('', 'Enter valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/customers/${phone.trim()}/has-pin`);
      const d = await r.json();
      setLoading(false);
      if (d.has_pin) {
        setCustomerStep('enter-pin');
      } else {
        setCustomerStep('create-pin');
      }
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Could not connect. Check your internet.');
    }
  };

  const handleCreatePin = async () => {
    if (pin.length !== 4) { setPinError('PIN must be 4 digits'); return; }
    if (pin !== pinConfirm) { setPinError('PINs do not match'); return; }
    setPinError('');
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/customers/set-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), pin })
      });
      const d = await r.json();
      setLoading(false);
      if (d.error) { setPinError(d.error); return; }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const user = { name: name.trim(), phone: phone.trim(), type: 'customer' };
      await AsyncStorage.setItem('customer_profile', JSON.stringify(user));
      onCustomerLogin(user);
    } catch {
      setLoading(false);
      setPinError('Could not connect. Check your internet.');
    }
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 4) { setPinError('Enter your 4-digit PIN'); return; }
    setPinError('');
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/customers/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), pin })
      });
      const d = await r.json();
      setLoading(false);
      if (!d.verified) { setPinError('Incorrect PIN. Please try again.'); setPin(''); return; }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const user = { name: d.name || name.trim(), phone: phone.trim(), type: 'customer' };
      await AsyncStorage.setItem('customer_profile', JSON.stringify(user));
      onCustomerLogin(user);
    } catch {
      setLoading(false);
      setPinError('Could not connect. Check your internet.');
    }
  };

  const handleMechanicCheck = async () => {
    if (phone.length < 10) { Alert.alert('', 'Enter valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/mechanics/check/${phone.trim()}`);
      const d = await r.json();
      setLoading(false);
      if (d.status === 'approved') {
        const m = { name: d.name, phone: d.phone, shop_name: d.shop_name, area: d.area, type: 'mechanic', status: 'approved' };
        await AsyncStorage.setItem('mechanic_profile', JSON.stringify(m));
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onMechanicLogin(m);
      } else if (d.status === 'pending' || d.status === 'rejected') {
        const m = { name: d.name, phone: d.phone, shop_name: d.shop_name, area: d.area, type: 'mechanic', status: d.status };
        await AsyncStorage.setItem('mechanic_profile', JSON.stringify(m));
        onMechanicPending(m, d.status);
      } else {
        setMode('mechanic_register');
        setTimeout(animateIn, 10);
      }
    } catch {
      setLoading(false);
      setMode('mechanic_register');
      setTimeout(animateIn, 10);
    }
  };

  const handleMechanicRegister = async () => {
    if (!name.trim())      { Alert.alert('', 'Please enter your name'); return; }
    if (phone.length < 10) { Alert.alert('', 'Enter valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/mechanics/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), shop_name: shopName.trim(), area: area.trim() })
      });
      const d = await r.json();
      setLoading(false);
      const m = { name: name.trim(), phone: phone.trim(), shop_name: shopName.trim(), area: area.trim(), type: 'mechanic', status: d.status || 'pending' };
      await AsyncStorage.setItem('mechanic_profile', JSON.stringify(m));
      if (d.status === 'approved') onMechanicLogin(m);
      else onMechanicPending(m, d.status || 'pending');
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Check your internet connection');
    }
  };

  // ══════════════════════════════════════
  // SELECT SCREEN
  // ══════════════════════════════════════
  if (mode === 'select') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor="#07111F" />
        <ScrollView contentContainerStyle={s.selectScroll} showsVerticalScrollIndicator={false}>

          {/* HERO SECTION */}
          <View style={s.hero}>
            {/* Shield Logo */}
            <View style={s.shieldWrap}>
              <View style={s.shield}>
                <Text style={s.shieldRAS}>RAS</Text>
              </View>
            </View>
            <Text style={s.heroTagline}>YOUR TRUSTED SPARES PARTNER</Text>
            <Text style={s.heroName}>New Rahul Auto Spares</Text>
            <View style={s.heroLocationRow}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.4)" />
              <Text style={s.heroLocation}>Telugu Peta, Nandyal · Est. 2002</Text>
            </View>

            {/* STATS ROW */}
            <View style={s.statsRow}>
              {[
                { num: '500+', label: 'Products' },
                { num: '20+', label: 'Bike Models' },
                { num: '5.0', label: 'Rating' },
              ].map((stat, i) => (
                <View key={i} style={s.statBox}>
                  <Text style={s.statNum}>{stat.num}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* WHO ARE YOU */}
          <Text style={s.sectionLabel}>SELECT YOUR ACCOUNT TYPE</Text>

          {/* CUSTOMER CARD */}
          <TouchableOpacity style={s.roleCard} onPress={() => goToMode('customer')} activeOpacity={0.8}>
            <View style={[s.roleIconBox, { backgroundColor: 'rgba(79,110,247,0.12)' }]}>
              <Ionicons name="bag-handle-outline" size={26} color="#4F6EF7" />
            </View>
            <View style={s.roleInfo}>
              <Text style={s.roleTitle}>Customer</Text>
              <Text style={s.roleSub}>Browse · Order · Track</Text>
              <Text style={s.roleTe}>స్పేర్ పార్ట్స్ కొనండి</Text>
              <View style={s.roleTagRow}>
                {['Free Account', 'All Bikes', 'Fast Pickup'].map((tag, i) => (
                  <View key={i} style={[s.roleTag, { backgroundColor: 'rgba(79,110,247,0.1)' }]}>
                    <Text style={[s.roleTagText, { color: '#4F6EF7' }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={s.roleArrow}>
              <Ionicons name="chevron-forward" size={18} color="#4F6EF7" />
            </View>
          </TouchableOpacity>

          {/* MECHANIC CARD */}
          <TouchableOpacity style={[s.roleCard, s.mechCard]} onPress={() => goToMode('mechanic')} activeOpacity={0.8}>
            <View style={[s.roleIconBox, { backgroundColor: 'rgba(255,193,7,0.12)' }]}>
              <Ionicons name="construct-outline" size={26} color="#FFC107" />
            </View>
            <View style={s.roleInfo}>
              <Text style={[s.roleTitle, { color: '#FFC107' }]}>Mechanic / Trade</Text>
              <Text style={s.roleSub}>For garages and workshops</Text>
              <Text style={s.roleTe}>మెకానిక్ ఖాతా</Text>
            </View>
            <View style={[s.roleArrow, { backgroundColor: 'rgba(255,193,7,0.1)' }]}>
              <Ionicons name="chevron-forward" size={18} color="#FFC107" />
            </View>
          </TouchableOpacity>

          {/* STORE INFO */}
          <View style={s.storeInfoBox}>
            <View style={s.storeInfoRow}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.4)" style={s.storeInfoIcon} />
              <Text style={s.storeInfoText}>Mon–Sat: 10AM–9PM · Sun: 10AM–3PM</Text>
            </View>
            <View style={s.storeInfoRow}>
              <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.4)" style={s.storeInfoIcon} />
              <Text style={s.storeInfoText}>08514-244944</Text>
            </View>
            <View style={s.storeInfoRow}>
              <Ionicons name="logo-whatsapp" size={16} color="rgba(255,255,255,0.4)" style={s.storeInfoIcon} />
              <Text style={s.storeInfoText}>WhatsApp: +91 6300281504</Text>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════
  // CUSTOMER LOGIN
  // ══════════════════════════════════════
  if (mode === 'customer' && customerStep === 'details') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor="#07111F" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.formScroll} keyboardShouldPersistTaps="handled">

            <TouchableOpacity style={s.backBtn} onPress={() => setMode('select')}>
              <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" />
              <Text style={s.backBtnText}>Back</Text>
            </TouchableOpacity>

            {/* HEADER */}
            <View style={s.formHeader}>
              <View style={[s.formHeaderIcon, { backgroundColor: 'rgba(79,110,247,0.1)', borderColor: 'rgba(79,110,247,0.3)' }]}>
                <Ionicons name="bag-handle-outline" size={32} color="#4F6EF7" />
              </View>
              <Text style={s.formTitle}>Customer Login</Text>
              <Text style={s.formSub}>Enter once · Saved for next time</Text>
            </View>

            {/* INPUTS */}
            <View style={s.inputCard}>
              <Text style={s.inputCardTitle}>Your Details</Text>

              <Text style={s.inputLabel}>FULL NAME</Text>
              <View style={s.inputRow}>
                <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.35)" />
                <TextInput
                  style={s.inputField}
                  placeholder="e.g. Rahul Kumar"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={name} onChangeText={setName}
                  autoCapitalize="words" />
              </View>

              <Text style={[s.inputLabel, { marginTop: 16 }]}>PHONE NUMBER</Text>
              <View style={s.inputRow}>
                <Text style={s.inputIcon}>+91</Text>
                <TextInput
                  style={s.inputField}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={phone} onChangeText={setPhone}
                  keyboardType="phone-pad" maxLength={10} />
              </View>
              {phone.length === 10 && (
                <View style={s.validRow}>
                  <Ionicons name="checkmark-circle" size={14} color="#4ADE80" />
                  <Text style={s.validText}>Valid number</Text>
                </View>
              )}
            </View>

            {/* FEATURES */}
            <View style={s.featuresBox}>
              {[
                { icon: 'bicycle-outline', text: 'Browse parts by your bike model' },
                { icon: 'cube-outline', text: 'Track your order in real-time' },
                { icon: 'notifications-outline', text: 'Get notified when order is ready' },
                { icon: 'diamond-outline', text: 'Earn loyalty points on every order' },
              ].map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <Ionicons name={f.icon} size={19} color="rgba(255,255,255,0.5)" style={{ width: 26 }} />
                  <Text style={s.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[s.submitBtn, { backgroundColor: '#4F6EF7' }, (!name || phone.length < 10 || loading) && { opacity: 0.4 }]}
              onPress={handleCustomerContinue}
              disabled={!name || phone.length < 10 || loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.submitBtnText}>Continue</Text>}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (mode === 'customer' && (customerStep === 'create-pin' || customerStep === 'enter-pin')) {
    const isNew = customerStep === 'create-pin';
    return (
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor="#07111F" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.formScroll} keyboardShouldPersistTaps="handled">

            <TouchableOpacity style={s.backBtn} onPress={() => { setCustomerStep('details'); setPin(''); setPinConfirm(''); setPinError(''); }}>
              <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" />
              <Text style={s.backBtnText}>Back</Text>
            </TouchableOpacity>

            <View style={s.formHeader}>
              <View style={[s.formHeaderIcon, { backgroundColor: 'rgba(79,110,247,0.1)', borderColor: 'rgba(79,110,247,0.3)' }]}>
                <Ionicons name="keypad-outline" size={32} color="#4F6EF7" />
              </View>
              <Text style={s.formTitle}>{isNew ? 'Create Your PIN' : 'Enter Your PIN'}</Text>
              <Text style={s.formSub}>
                {isNew ? 'Set a 4-digit PIN to protect your account' : `Welcome back! Enter your PIN to continue`}
              </Text>
            </View>

            <View style={s.inputCard}>
              <Text style={s.inputLabel}>{isNew ? 'CREATE 4-DIGIT PIN' : '4-DIGIT PIN'}</Text>
              <View style={s.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.35)" />
                <TextInput
                  style={s.inputField}
                  placeholder="••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={pin} onChangeText={(v) => { setPin(v); setPinError(''); }}
                  keyboardType="number-pad" maxLength={4} secureTextEntry />
              </View>

              {isNew && (
                <>
                  <Text style={[s.inputLabel, { marginTop: 16 }]}>CONFIRM PIN</Text>
                  <View style={s.inputRow}>
                    <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.35)" />
                    <TextInput
                      style={s.inputField}
                      placeholder="••••"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      value={pinConfirm} onChangeText={(v) => { setPinConfirm(v); setPinError(''); }}
                      keyboardType="number-pad" maxLength={4} secureTextEntry />
                  </View>
                </>
              )}

              {pinError ? (
                <View style={[s.validRow, { marginTop: 10 }]}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={[s.validText, { color: '#EF4444' }]}>{pinError}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[s.submitBtn, { backgroundColor: '#4F6EF7' },
                (isNew ? (pin.length !== 4 || pinConfirm.length !== 4) : pin.length !== 4) && { opacity: 0.4 }]}
              onPress={isNew ? handleCreatePin : handleVerifyPin}
              disabled={loading || (isNew ? (pin.length !== 4 || pinConfirm.length !== 4) : pin.length !== 4)}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.submitBtnText}>{isNew ? 'Create PIN & Continue' : 'Verify & Continue'}</Text>}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════
  // MECHANIC LOGIN
  // ══════════════════════════════════════
  if (mode === 'mechanic') {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor="#07111F" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.formScroll} keyboardShouldPersistTaps="handled">

            <TouchableOpacity style={s.backBtn} onPress={() => setMode('select')}>
              <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" />
              <Text style={s.backBtnText}>Back</Text>
            </TouchableOpacity>

            <View style={s.formHeader}>
              <View style={[s.formHeaderIcon, { backgroundColor: 'rgba(255,193,7,0.1)', borderColor: 'rgba(255,193,7,0.3)' }]}>
                <Ionicons name="construct-outline" size={32} color="#FFC107" />
              </View>
              <Text style={[s.formTitle, { color: '#FFC107' }]}>Mechanic Login</Text>
              <Text style={s.formSub}>Check your approved account</Text>
            </View>

            {/* BENEFITS */}
            <View style={s.mechBenefitsCard}>
              <Text style={s.mechBenefitsTitle}>Mechanic Account Benefits</Text>
              {[
                { icon: 'pricetag-outline', text: 'Trade discount on all parts' },
                { icon: 'cube-outline', text: 'Wholesale pricing for bulk orders' },
                { icon: 'flash-outline', text: 'Priority order processing' },
                { icon: 'headset-outline', text: 'Dedicated mechanic support' },
              ].map((b, i) => (
                <View key={i} style={s.mechBenefitRow}>
                  <Ionicons name={b.icon} size={18} color="#FFC107" style={{ width: 26 }} />
                  <Text style={s.mechBenefitText}>{b.text}</Text>
                </View>
              ))}
            </View>

            <View style={s.inputCard}>
              <Text style={s.inputCardTitle}>Enter Your Phone</Text>
              <Text style={s.inputLabel}>REGISTERED PHONE NUMBER</Text>
              <View style={[s.inputRow, { borderColor: 'rgba(255,193,7,0.3)' }]}>
                <Text style={s.inputIcon}>+91</Text>
                <TextInput
                  style={s.inputField}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={phone} onChangeText={setPhone}
                  keyboardType="phone-pad" maxLength={10} />
              </View>
            </View>

            <TouchableOpacity
              style={[s.submitBtn, { backgroundColor: '#FFC107' }, (phone.length < 10 || loading) && { opacity: 0.4 }]}
              onPress={handleMechanicCheck}
              disabled={phone.length < 10 || loading}>
              {loading
                ? <ActivityIndicator color="#07111F" />
                : <Text style={[s.submitBtnText, { color: '#07111F' }]}>Check My Account</Text>}
            </TouchableOpacity>

            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerLabel}>New Mechanic?</Text>
              <View style={s.dividerLine} />
            </View>

            <TouchableOpacity
              style={[s.outlineBtn, { borderColor: 'rgba(255,193,7,0.3)' }]}
              onPress={() => goToMode('mechanic_register')}>
              <Text style={[s.outlineBtnText, { color: '#FFC107' }]}>Register as New Mechanic</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════
  // MECHANIC REGISTER
  // ══════════════════════════════════════
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07111F" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.formScroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={s.backBtn} onPress={() => goToMode('mechanic')}>
            <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" />
            <Text style={s.backBtnText}>Back</Text>
          </TouchableOpacity>

          <View style={s.formHeader}>
            <View style={[s.formHeaderIcon, { backgroundColor: 'rgba(255,193,7,0.1)', borderColor: 'rgba(255,193,7,0.3)' }]}>
              <Ionicons name="document-text-outline" size={32} color="#FFC107" />
            </View>
            <Text style={[s.formTitle, { color: '#FFC107' }]}>Register as Mechanic</Text>
            <Text style={s.formSub}>Fill details · Owner will approve you!</Text>
          </View>

          <View style={s.inputCard}>
            <Text style={s.inputCardTitle}>Your Details</Text>

            {[
              { label: 'FULL NAME *', icon: 'person-outline', value: name, setter: setName, placeholder: 'Your full name', caps: 'words' },
              { label: 'PHONE NUMBER *', icon: null, value: phone, setter: setPhone, placeholder: '10-digit number', keyboard: 'phone-pad', max: 10 },
              { label: 'GARAGE / SHOP NAME', icon: 'storefront-outline', value: shopName, setter: setShopName, placeholder: 'Your shop name (optional)', caps: 'words' },
              { label: 'AREA IN NANDYAL', icon: 'location-outline', value: area, setter: setArea, placeholder: 'Your area (optional)', caps: 'words' },
            ].map((field, i) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={s.inputLabel}>{field.label}</Text>
                <View style={[s.inputRow, { borderColor: 'rgba(255,193,7,0.25)' }]}>
                  {field.icon
                    ? <Ionicons name={field.icon} size={18} color="rgba(255,255,255,0.35)" />
                    : <Text style={s.inputIcon}>+91</Text>}
                  <TextInput
                    style={s.inputField}
                    placeholder={field.placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={field.value} onChangeText={field.setter}
                    keyboardType={field.keyboard || 'default'}
                    autoCapitalize={field.caps || 'none'}
                    maxLength={field.max} />
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[s.submitBtn, { backgroundColor: '#FFC107' }, (!name || phone.length < 10 || loading) && { opacity: 0.4 }]}
            onPress={handleMechanicRegister}
            disabled={!name || phone.length < 10 || loading}>
            {loading
              ? <ActivityIndicator color="#07111F" />
              : <Text style={[s.submitBtnText, { color: '#07111F' }]}>Submit for Approval</Text>}
          </TouchableOpacity>

          <View style={s.approvalCard}>
            <Text style={s.approvalTitle}>What happens next?</Text>
            {[
              { num: '1', text: 'Your request is sent to the store owner' },
              { num: '2', text: 'Owner reviews and approves within 24 hours' },
              { num: '3', text: 'Your trade account is activated' },
            ].map((step, i) => (
              <View key={i} style={s.approvalStep}>
                <View style={s.approvalStepNum}>
                  <Text style={s.approvalStepNumText}>{step.num}</Text>
                </View>
                <Text style={s.approvalStepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07111F' },

  // Select screen
  selectScroll: { padding: 20 },

  // Hero
  hero: { alignItems: 'center', paddingVertical: 24 },
  shieldWrap: { marginBottom: 16 },
  shield: {
    width: 110, height: 130, backgroundColor: '#0D1F3C',
    borderWidth: 2.5, borderColor: '#C9A84C',
    borderRadius: 20, borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50, alignItems: 'center',
    justifyContent: 'center', gap: 4,
    shadowColor: '#C9A84C', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  shieldRAS: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 4 },
  heroTagline: { fontSize: 9, color: '#C9A84C', letterSpacing: 4, marginBottom: 6 },
  heroName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4, textAlign: 'center' },
  heroLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  heroLocation: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },

  // Stats
  statsRow: {
    flexDirection: 'row', gap: 0,
    backgroundColor: '#0D1F3C', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    overflow: 'hidden', width: width - 40,
  },
  statBox: { flex: 1, alignItems: 'center', padding: 14 },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#C9A84C', marginBottom: 2 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },

  // Section label
  sectionLabel: {
    fontSize: 10, color: 'rgba(255,255,255,0.3)',
    letterSpacing: 3, marginBottom: 14, marginTop: 8,
  },

  // Role cards
  roleCard: {
    backgroundColor: '#0D1F3C', borderRadius: 20,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    gap: 14, marginBottom: 12, borderWidth: 1,
    borderColor: 'rgba(79,110,247,0.25)',
    shadowColor: '#4F6EF7', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  mechCard: {
    borderColor: 'rgba(255,193,7,0.25)',
    shadowColor: '#FFC107',
  },
  roleIconBox: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  roleInfo: { flex: 1 },
  roleTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  roleSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  roleTe: { fontSize: 11, color: 'rgba(79,110,247,0.5)', marginBottom: 8 },
  roleTagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  roleTag: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  roleTagText: { fontSize: 10, fontWeight: 'bold' },
  roleArrow: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(79,110,247,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Store info
  storeInfoBox: {
    backgroundColor: '#0D1F3C', borderRadius: 16,
    padding: 14, marginTop: 8, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)', gap: 10,
  },
  storeInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  storeInfoIcon: { width: 24 },
  storeInfoText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', flex: 1 },

  // Form screens
  formScroll: { flexGrow: 1, padding: 20 },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)', alignSelf: 'flex-start',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 24,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  backBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 'bold' },

  formHeader: { alignItems: 'center', marginBottom: 24 },
  formHeaderIcon: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, marginBottom: 14,
  },
  formTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  formSub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },

  // Input card
  inputCard: {
    backgroundColor: '#0D1F3C', borderRadius: 20,
    padding: 16, marginBottom: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputCardTitle: { fontSize: 13, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  inputLabel: {
    fontSize: 10, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2, marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(79,110,247,0.2)', gap: 10,
  },
  inputIcon: { fontSize: 15, color: 'rgba(255,255,255,0.35)', fontWeight: 'bold', minWidth: 28 },
  inputField: { flex: 1, color: '#fff', fontSize: 16 },
  validRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, marginLeft: 4 },
  validText: { fontSize: 11, color: '#4ADE80' },

  // Features box
  featuresBox: {
    backgroundColor: '#0D1F3C', borderRadius: 16,
    padding: 14, marginBottom: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)', gap: 12,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1 },

  // Submit button
  submitBtn: {
    borderRadius: 20, padding: 18, alignItems: 'center',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  // Mechanic benefits
  mechBenefitsCard: {
    backgroundColor: 'rgba(255,193,7,0.06)', borderRadius: 16,
    padding: 14, marginBottom: 16, borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.15)',
  },
  mechBenefitsTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFC107', marginBottom: 12 },
  mechBenefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  mechBenefitText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1 },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },

  // Outline button
  outlineBtn: {
    borderRadius: 16, padding: 16, borderWidth: 1,
    alignItems: 'center', marginBottom: 10,
  },
  outlineBtnText: { fontSize: 15, fontWeight: 'bold' },

  // Approval card
  approvalCard: {
    backgroundColor: 'rgba(255,193,7,0.06)', borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: 'rgba(255,193,7,0.15)',
  },
  approvalTitle: { fontSize: 13, fontWeight: 'bold', color: '#FFC107', marginBottom: 12 },
  approvalStep: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  approvalStepNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(255,193,7,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  approvalStepNumText: { fontSize: 11, fontWeight: 'bold', color: '#FFC107' },
  approvalStepText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1, lineHeight: 20 },
});
