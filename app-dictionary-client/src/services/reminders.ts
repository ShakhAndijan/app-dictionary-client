import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import * as reviewApi from '../api/reviewApi';

// Reminders are local notifications: scheduling and permission are per device, so the settings live on the
// device. The daily goal itself lives on the server (user.dailyGoal) so it follows the account.

// Expo Go (Android) no longer ships expo-notifications: importing it there logs an error. Reminders need a
// development build or the APK, so in Expo Go the module is never loaded and every call below is a no-op.
export const remindersSupported = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

type NotificationsModule = typeof import('expo-notifications');
const Notifications: NotificationsModule = remindersSupported
  ? require('expo-notifications')
  : (null as unknown as NotificationsModule);

const STORAGE_KEY = 'reminder_settings';
const CHANNEL_ID = 'reminders';
const DAYS_AHEAD = 7;

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = { enabled: false, hour: 20, minute: 0 };

// Show reminders even while the app is open.
Notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function loadReminderSettings(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_REMINDER_SETTINGS;
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export async function getReminderPermission(): Promise<{ granted: boolean; canAskAgain: boolean }> {
  if (!remindersSupported) return { granted: false, canAskAgain: false };
  const p = await Notifications.getPermissionsAsync();
  return { granted: p.granted, canAskAgain: p.canAskAgain };
}

/** Asks the system for notification permission (Android 13+ and iOS show a prompt). */
export async function requestReminderPermission(): Promise<{ granted: boolean; canAskAgain: boolean }> {
  if (!remindersSupported) return { granted: false, canAskAgain: false };
  await ensureChannel();
  const p = await Notifications.requestPermissionsAsync();
  return { granted: p.granted, canAskAgain: p.canAskAgain };
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Eslatmalar',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

const TITLE = "So'zlarni takrorlash vaqti";

async function doSync(): Promise<void> {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();

  const settings = await loadReminderSettings();
  if (!settings.enabled) return;
  if (!(await Notifications.getPermissionsAsync()).granted) return;
  await ensureChannel();

  let summary: Awaited<ReturnType<typeof reviewApi.getReviewSummary>> | null = null;
  try {
    summary = await reviewApi.getReviewSummary();
  } catch {
    // Offline: schedule generic reminders anyway.
  }
  const goalReached = !!summary && summary.todayDone >= summary.dailyGoal;
  const waiting = summary ? summary.dueCount + summary.newCount : 0;

  const now = Date.now();
  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const base = new Date();
    const when = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i, settings.hour, settings.minute, 0, 0);
    if (when.getTime() <= now + 30_000) continue;
    // Do not nag someone who already reached today's goal.
    if (i === 0 && goalReached) continue;

    let body = 'Bugun bir necha so\'z takrorlang: kichik qadamlar katta natija beradi.';
    if (i === 0 && summary) {
      body =
        waiting > 0
          ? `Bugun ${waiting} ta so'z takrorlashni kutyapti.`
          : `Bugungi maqsad: ${summary.dailyGoal} ta so'z. Mashq qiling!`;
    }

    await Notifications.scheduleNotificationAsync({
      content: { title: TITLE, body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: CHANNEL_ID },
    });
  }
}

// Syncs can be triggered from several places at once (app start, foreground, quiz finish);
// running them one after another avoids scheduling duplicates.
let queue: Promise<void> = Promise.resolve();

/** Rebuilds the next days' reminders from the saved settings and today's progress. Never throws. */
export function syncReminders(): Promise<void> {
  queue = queue.then(doSync).catch(() => undefined);
  return queue;
}

/** Removes every scheduled reminder (used on logout). */
export function cancelReminders(): Promise<void> {
  queue = queue.then(() => (remindersSupported ? Notifications.cancelAllScheduledNotificationsAsync() : undefined)).catch(() => undefined);
  return queue;
}

/** Fires a notification in a few seconds so the user can check that reminders work on this device. */
export async function sendTestReminder(): Promise<void> {
  if (!remindersSupported) return;
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: { title: TITLE, body: 'Eslatmalar ishlayapti.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, channelId: CHANNEL_ID },
  });
}
