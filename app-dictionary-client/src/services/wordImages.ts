import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as wordsApi from '../api/wordsApi';

const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.7;

export type ImageSource = 'library' | 'camera';

/** A picture ready to upload (already shrunk) plus a local preview uri. */
export interface PreparedImage {
  uri: string;
  payload: wordsApi.WordImagePayload;
}

/**
 * Lets the user pick or take a photo, then shrinks it so it stays well under the server's 1 MB limit.
 * Returns null when the user cancels or denies permission.
 */
export async function pickWordImage(source: ImageSource): Promise<PreparedImage | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error('PERMISSION_DENIED');

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    quality: 1,
  };
  const picked =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (picked.canceled || !picked.assets?.length) return null;

  const asset = picked.assets[0];
  const context = ImageManipulator.manipulate(asset.uri);
  if (asset.width > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: JPEG_QUALITY, base64: true });
  if (!saved.base64) throw new Error('IMAGE_FAILED');

  return { uri: saved.uri, payload: { contentType: 'image/jpeg', data: saved.base64 } };
}

// Images are fetched once per (word, version); the version changes whenever the picture is replaced.
const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

export function cachedImageUri(wordId: number, version: number): string | undefined {
  return cache.get(`${wordId}:${version}`);
}

export function loadWordImageUri(wordId: number, version: number): Promise<string> {
  const key = `${wordId}:${version}`;
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  let pending = inflight.get(key);
  if (!pending) {
    pending = wordsApi
      .getWordImage(wordId)
      .then((img) => {
        const uri = `data:${img.contentType};base64,${img.data}`;
        cache.set(key, uri);
        return uri;
      })
      .finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }
  return pending;
}

/** Remembers a freshly uploaded picture so it shows instantly without another download. */
export function primeWordImage(wordId: number, version: number, payload: wordsApi.WordImagePayload) {
  cache.set(`${wordId}:${version}`, `data:${payload.contentType};base64,${payload.data}`);
}
