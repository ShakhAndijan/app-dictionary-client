import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const BENEFITS: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: 'add-circle-outline', text: 'Har kuni yangi so\'z qo\'shing' },
  { icon: 'checkmark-done-circle-outline', text: 'Bilimingizni testda sinab ko\'ring' },
  { icon: 'trending-up-outline', text: 'Rivojlanishingizni kuzatib boring' },
];

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
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        bottomOffset={40}
        mode="layout"
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 24 }]}
        >
          <View style={styles.logoBadge}>
            <Ionicons name="person-add-outline" size={32} color="#fff" />
          </View>
          <Text style={styles.appName}>Hisob yarating</Text>
          <Text style={styles.tagline}>Bugundan boshlab so'z boyligingizni oshiring</Text>

          <View style={styles.benefitsCard}>
            {BENEFITS.map((b, idx) => (
              <View key={b.text} style={[styles.benefitRow, idx > 0 && styles.benefitRowSpacing]}>
                <View style={styles.benefitIconWrap}>
                  <Ionicons name={b.icon} size={16} color="#fff" />
                </View>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Ro'yxatdan o'tish</Text>
          <Text style={styles.subtitle}>Ma'lumotlaringizni kiriting va boshlang</Text>

          <Input label="Ism" icon="person-outline" value={firstName} onChangeText={setFirstName} placeholder="Ismingiz" />
          <Input
            label="Familiya"
            icon="person-outline"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Familiyangiz"
          />
          <Input
            label="Foydalanuvchi nomi"
            icon="at-outline"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="username"
          />
          <Input
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="email@example.com"
          />
          <Input
            label="Parol"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
          <Text style={styles.helperText}>Kamida 6 ta belgidan iborat bo'lishi kerak</Text>

          <Button
            title="Ro'yxatdan o'tish"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          <Text style={styles.termsText}>
            Ro'yxatdan o'tish orqali siz foydalanish shartlariga rozilik bildirasiz
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hisobingiz bormi?</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              {' '}
              Kirish
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  hero: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 20, textAlign: 'center' },
  benefitsCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center' },
  benefitRowSpacing: { marginTop: 12 },
  benefitIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  benefitText: { flex: 1, fontSize: 13, color: '#fff', fontWeight: '500' },
  card: {
    flexGrow: 1,
    backgroundColor: colors.background,
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  helperText: { fontSize: 12, color: colors.textMuted, marginTop: -10, marginBottom: 16 },
  submitBtn: { marginTop: 8 },
  termsText: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
}));
