import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AlertModal, { AlertContent } from '../../components/AlertModal';
import { isNetworkError } from '../../utils/errors';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'add-circle-outline', label: "So'z qo'shish" },
  { icon: 'checkmark-done-circle-outline', label: 'Baholash' },
  { icon: 'stats-chart-outline', label: 'Statistika' },
];

function loginErrorAlert(e: any, retry: () => void): AlertContent {
  if (isNetworkError(e)) {
    return {
      variant: 'network',
      title: "Server bilan aloqa yo'q",
      message: "Internetga ulanganingizni tekshiring yoki birozdan so'ng qayta urinib ko'ring.",
      confirmText: "Qayta urinish",
      cancelText: 'Yopish',
      onConfirm: retry,
    };
  }
  const status = e?.response?.status;
  if (status === 401 || status === 400 || status === 404) {
    return {
      variant: 'error',
      title: "Kirib bo'lmadi",
      message: "Foydalanuvchi nomi yoki parol noto'g'ri. Iltimos, tekshirib qayta urinib ko'ring.",
    };
  }
  if (status === 429) {
    return {
      variant: 'warning',
      title: "Juda ko'p urinish",
      message: "Birozdan so'ng qayta urinib ko'ring.",
    };
  }
  return {
    variant: 'error',
    title: 'Xatolik yuz berdi',
    message: "Serverda muammo bor. Birozdan so'ng qayta urinib ko'ring.",
    confirmText: 'Qayta urinish',
    cancelText: 'Yopish',
    onConfirm: retry,
  };
}

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertContent | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setAlert({
        variant: 'warning',
        title: "Ma'lumotlar yetarli emas",
        message: 'Davom etish uchun foydalanuvchi nomi va parolni kiriting.',
      });
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e: any) {
      setAlert(loginErrorAlert(e, handleLogin));
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
          style={[styles.hero, { paddingTop: insets.top + 28 }]}
        >
          <View style={styles.logoBadge}>
            <Ionicons name="book-outline" size={34} color="#fff" />
          </View>
          <Text style={styles.appName}>Dictionary</Text>
          <Text style={styles.tagline}>Kunlik so'z boyligingizni oshiring</Text>

          <View style={styles.featureRow}>
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={f.icon} size={18} color="#fff" />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Xush kelibsiz</Text>
          <Text style={styles.subtitle}>Davom etish uchun hisobingizga kiring</Text>

          <Input
            label="Foydalanuvchi nomi"
            icon="person-outline"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="username"
          />
          <Input
            label="Parol"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <Button title="Kirish" onPress={handleLogin} loading={loading} style={styles.submitBtn} />

          <View style={styles.secureNote}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
            <Text style={styles.secureNoteText}>Ma'lumotlaringiz xavfsiz tarzda saqlanadi</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hisobingiz yo'qmi?</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
              {' '}
              Ro'yxatdan o'tish
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <AlertModal alert={alert} onClose={() => setAlert(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  hero: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 24, textAlign: 'center' },
  featureRow: { flexDirection: 'row', gap: 20 },
  featureItem: { alignItems: 'center', gap: 6, width: 76 },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: { fontSize: 11, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
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
  submitBtn: { marginTop: 8 },
  secureNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 },
  secureNoteText: { fontSize: 12, color: colors.textMuted },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
});
