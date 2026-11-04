import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors, themed } from '../../theme/colors';
import * as adminApi from '../../api/adminApi';
import { ACTION_LABEL, ago } from './format';

export default function AdminAuditScreen() {
  const [list, setList] = useState<adminApi.AuditEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    adminApi.audit(100).then(setList).catch(() => setFailed(true));
  }, []);
  useFocusEffect(load);

  return (
    <ScreenContainer>
      {!list ? (
        failed ? <Text style={styles.muted}>Yuklab bo'lmadi</Text> : <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />
      ) : list.length === 0 ? (
        <Text style={styles.muted}>Hali harakat yo'q.</Text>
      ) : (
        list.map((e) => (
          <Card key={e.id} style={styles.item}>
            <Text style={styles.line}>
              <Text style={styles.bold}>@{e.actor}</Text> {e.target ? <Text style={styles.bold}>@{e.target} </Text> : null}
              {ACTION_LABEL[e.action] ?? e.action}
            </Text>
            {!!e.details && <Text style={styles.sub}>{e.details}</Text>}
            <Text style={styles.sub}>{ago(e.at)}</Text>
          </Card>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 30 },
  item: { marginBottom: 10 },
  line: { fontSize: 14, color: colors.text },
  bold: { fontWeight: '800' },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
}));
