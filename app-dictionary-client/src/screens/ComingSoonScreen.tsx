import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { colors, themed } from '../theme/colors';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}

/** A section chosen in the profile that is not built yet. */
export default function ComingSoonScreen({ icon, title, text }: Props) {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.box}>
        <View style={styles.ico}>
          <Ionicons name={icon} size={44} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Tez orada</Text>
        </View>
        <Text style={styles.text}>{text}</Text>
        <Button
          title="Yo'nalishlarni o'zgartirish"
          variant="outline"
          onPress={() => navigation.navigate('Profil', { screen: 'Directions' })}
          style={{ alignSelf: 'stretch', marginTop: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
    ico: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.primary}1A` },
    title: { color: colors.text, fontSize: 28, fontWeight: '800' },
    badge: { backgroundColor: colors.amberBg, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 4 },
    badgeText: { color: colors.amberText, fontSize: 12, fontWeight: '800' },
    text: { color: colors.textMuted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  }),
);
