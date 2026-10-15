import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Xatolik', "Barcha maydonlarni to'ldiring");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Xatolik', "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Xatolik', 'Yangi parollar mos kelmadi');
      return;
    }
    setSaving(true);
    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert('Muvaffaqiyatli', 'Parol muvaffaqiyatli almashtirildi');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      Alert.alert('Xatolik', e?.response?.data?.message ?? "Parolni almashtirib bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Parolni almashtirish</Text>
      <Input label="Joriy parol" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
      <Input label="Yangi parol" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
      <Input
        label="Yangi parolni tasdiqlang"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Saqlash" onPress={handleSave} loading={saving} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 20 },
});
