import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { AU, AuthBackground, AuthButton, AuthInput, BrandPill, GlassCard, Reveal } from '../../components/AuthKit';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password) {
      Alert.alert('Xatolik', "Barcha maydonlarni to'ldiring");
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Xatolik', "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (password.length < 6) {
      Alert.alert('Xatolik', "Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    setLoading(true);
    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), username.trim(), password);
    } catch (e: any) {
      if (__DEV__) {
        // Debug only: request body (password) and tokens are deliberately not logged.
        console.log('[register] xato:', {
          message: e?.message,
          code: e?.code,
          status: e?.response?.status,
          data: e?.response?.data,
          url: `${e?.config?.baseURL ?? ''}${e?.config?.url ?? ''}`,
        });
      }
      Alert.alert('Xatolik', e?.response?.data?.message ?? "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar style="light" />
      <AuthBackground />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 }]}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        bottomOffset={40}
        mode="layout"
      >
        <Reveal index={0}>
          <BrandPill />
        </Reveal>
        <Reveal index={1} style={styles.headWrap}>
          <Text style={styles.headline}>
            Bugun{'\n'}
            <Text style={styles.headlineAccent}>boshlaymiz.</Text>
          </Text>
          <Text style={styles.lede}>Har kuni bir oz, lekin abadiy.</Text>
        </Reveal>

        <GlassCard>
          <Text style={styles.eyebrow}>YANGI HISOB</Text>
          <Text style={styles.title}>Hisob yarating</Text>
          <Text style={styles.subtitle}>Bir daqiqada tayyor bo'ladi.</Text>

          <AuthInput label="Ism" icon="person-outline" value={firstName} onChangeText={setFirstName} />
          <AuthInput label="Familiya" icon="person-outline" value={lastName} onChangeText={setLastName} />
          <AuthInput
            label="Foydalanuvchi nomi"
            icon="at-outline"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <AuthInput
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <AuthInput label="Parol" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry />
          <Text style={styles.helper}>Kamida 6 ta belgi</Text>
          <AuthButton title="Ro'yxatdan o'tish" onPress={handleRegister} loading={loading} />

          <Text style={styles.footer}>
            Hisobingiz bormi?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              Kirish
            </Text>
          </Text>
        </GlassCard>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AU.bg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 22 },
  headWrap: { marginTop: 22, marginBottom: 24 },
  headline: { fontSize: 42, lineHeight: 46, fontWeight: '800', letterSpacing: -1.4, color: '#fff' },
  headlineAccent: { color: '#A5B4FC' },
  lede: { fontSize: 15, color: AU.muted, marginTop: 10 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: AU.cyan, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6, color: '#fff' },
  subtitle: { fontSize: 14, color: AU.muted, marginTop: 6, marginBottom: 22 },
  helper: { fontSize: 12, color: AU.faint, marginTop: -4, marginBottom: 10, marginLeft: 4 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: AU.muted },
  link: { color: '#C7D2FE', fontWeight: '700' },
});
