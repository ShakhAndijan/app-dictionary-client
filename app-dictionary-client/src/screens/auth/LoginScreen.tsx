import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { AU, AuthBackground, AuthButton, AuthInput, BrandPill, GlassCard, Reveal, WordStage } from '../../components/AuthKit';
import AlertModal, { AlertContent } from '../../components/AlertModal';
import { isNetworkError } from '../../utils/errors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

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
  if (status === 403) {
    return {
      variant: 'error',
      title: 'Hisob bloklangan',
      message: "Hisobingiz bloklangan. Administrator bilan bog'laning.",
    };
  }
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
            So'zlarni{'\n'}
            <Text style={styles.headlineAccent}>eslab qoling,</Text>
            {'\n'}unutmang.
          </Text>
        </Reveal>
        <Reveal index={2} style={styles.stageWrap}>
          <WordStage />
        </Reveal>

        <GlassCard>
          <Text style={styles.eyebrow}>KIRISH</Text>
          <Text style={styles.title}>Qaytganingiz yaxshi</Text>
          <Text style={styles.subtitle}>Davom etish uchun hisobingizga kiring.</Text>

          <AuthInput
            label="Foydalanuvchi nomi"
            icon="person-outline"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <AuthInput label="Parol" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry />
          <AuthButton title="Kirish" onPress={handleLogin} loading={loading} />

          <Text style={styles.footer}>
            Hisobingiz yo'qmi?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
              Ro'yxatdan o'tish
            </Text>
          </Text>
        </GlassCard>
      </KeyboardAwareScrollView>
      <AlertModal alert={alert} onClose={() => setAlert(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AU.bg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 22 },
  headWrap: { marginTop: 22 },
  headline: { fontSize: 42, lineHeight: 46, fontWeight: '800', letterSpacing: -1.4, color: '#fff' },
  headlineAccent: { color: '#A5B4FC' },
  stageWrap: { marginTop: 22, marginBottom: 26 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: AU.cyan, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6, color: '#fff' },
  subtitle: { fontSize: 14, color: AU.muted, marginTop: 6, marginBottom: 22 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: AU.muted },
  link: { color: '#C7D2FE', fontWeight: '700' },
});
