import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Xatolik', "Ism, familiya va emailni to'ldiring");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
      Alert.alert('Muvaffaqiyatli', "Profil ma'lumotlari yangilandi");
    } catch (e: any) {
      Alert.alert('Xatolik', e?.response?.data?.message ?? "Ma'lumotlarni saqlab bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Profil ma'lumotlari</Text>
      <Input label="Ism" value={firstName} onChangeText={setFirstName} placeholder="Ismingiz" />
      <Input label="Familiya" value={lastName} onChangeText={setLastName} placeholder="Familiyangiz" />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Saqlash" onPress={handleSave} loading={saving} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 20 },
});
