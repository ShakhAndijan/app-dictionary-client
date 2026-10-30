import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Directory, File, Paths } from 'expo-file-system';
import * as wordsApi from '../api/wordsApi';
import { Word } from '../types';

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

// Pictures are also kept on the phone, so cards still show them without internet.
// A file is named after its word and picture version; the version changes whenever the picture is replaced.
function imagesDir(): Directory {
  const dir = new Directory(Paths.document, 'word-images');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

function imageFile(wordId: number, version: number): File {
  return new File(imagesDir(), `${wordId}-${version}.txt`);
}

async function readFromDisk(wordId: number, version: number): Promise<string | null> {
  try {
    const file = imageFile(wordId, version);
    return file.exists ? await file.text() : null;
  } catch {
    return null;
  }
}

async function saveToDisk(wordId: number, version: number, uri: string) {
  try {
    const dir = imagesDir();
    // Drop the pictures this word had before.
    dir.list().forEach((entry) => {
      if (entry instanceof File && entry.name.startsWith(`${wordId}-`)) entry.delete();
    });
    const file = imageFile(wordId, version);
    if (!file.exists) file.create();
    await file.write(uri);
  } catch {
    // The copy on disk is a bonus; the picture itself is already on screen.
  }
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
    pending = readFromDisk(wordId, version)
      .then(async (saved) => {
        if (saved) {
          cache.set(key, saved);
          return saved;
        }
        const img = await wordsApi.getWordImage(wordId);
        const uri = `data:${img.contentType};base64,${img.data}`;
        cache.set(key, uri);
        saveToDisk(wordId, version, uri);
        return uri;
      })
      .finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }
  return pending;
}

/** Remembers a freshly uploaded picture so it shows instantly without another download. */
export function primeWordImage(wordId: number, version: number, payload: wordsApi.WordImagePayload) {
  const uri = `data:${payload.contentType};base64,${payload.data}`;
  cache.set(`${wordId}:${version}`, uri);
  saveToDisk(wordId, version, uri);
}

/** Downloads the pictures of words that have one, a few at a time, so they are on the phone before the internet goes. */
export async function prefetchWordImages(words: Word[]) {
  const wanted = words.filter((w) => w.imageVersion && !cache.has(`${w.id}:${w.imageVersion}`));
  for (let i = 0; i < wanted.length; i += 3) {
    await Promise.all(
      wanted.slice(i, i + 3).map((w) => loadWordImageUri(w.id, w.imageVersion as number).catch(() => undefined))
    );
  }
}
