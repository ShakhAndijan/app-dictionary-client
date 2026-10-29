import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { cachedImageUri, loadWordImageUri } from '../services/wordImages';

interface Props {
  wordId: number;
  version: number | null | undefined;
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain';
}

/** Shows a word's picture, downloading it on first use. Renders nothing when the word has no picture. */
export default function WordImage({ wordId, version, style, resizeMode = 'cover' }: Props) {
  const [uri, setUri] = useState<string | undefined>(version ? cachedImageUri(wordId, version) : undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!version) {
      setUri(undefined);
      return;
    }
    let active = true;
    setFailed(false);
    const hit = cachedImageUri(wordId, version);
    if (hit) {
      setUri(hit);
    } else {
      setUri(undefined);
      loadWordImageUri(wordId, version)
        .then((u) => active && setUri(u))
        .catch(() => active && setFailed(true));
    }
    return () => {
      active = false;
    };
  }, [wordId, version]);

  if (!version || failed) return null;

  return (
    <View style={[styles.box, style]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode={resizeMode} />
      ) : (
        <ActivityIndicator color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
