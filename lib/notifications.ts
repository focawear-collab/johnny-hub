import { Platform } from 'react-native';

export const NOTIFICATION_IDS = { FERMENT_TIMER: 'ferment-timer' } as const;

// All notification APIs are no-ops on web
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export async function requestPermissions() {
  if (!isNative) return { granted: false };
  const { default: Notifications } = await import('expo-notifications');
  return Notifications.requestPermissionsAsync();
}

export function setupNotificationChannel() {
  if (!isNative) return;
  import('expo-notifications').then(({ default: N }) => {
    if (Platform.OS === 'android') {
      N.setNotificationChannelAsync('ferment-timer', {
        name: 'Ferment Timer',
        importance: N.AndroidImportance.MAX,
        sound: 'default',
      });
    }
  });
}

export async function scheduleLocalNotification(title: string, body: string, triggerSeconds: number) {
  if (!isNative) return;
  const { default: N } = await import('expo-notifications');
  await N.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { seconds: triggerSeconds, type: N.SchedulableTriggerInputTypes.TIME_INTERVAL },
  });
}

export async function notifyFermentComplete(readyAt: Date) {
  if (!isNative) return;
  const seconds = Math.max(1, Math.floor((readyAt.getTime() - Date.now()) / 1000));
  await scheduleLocalNotification('¡Tu masa está lista!', `Han pasado las horas de fermentación. Es hora de bolear.`, seconds);
}

export async function cancelFermentNotification() {
  if (!isNative) return;
  const { default: N } = await import('expo-notifications');
  try { await N.cancelScheduledNotificationAsync(NOTIFICATION_IDS.FERMENT_TIMER); } catch {}
}

export function handleForegroundNotification() {
  if (!isNative) return () => {};
  let sub: any;
  import('expo-notifications').then(({ default: N }) => {
    N.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }) });
    sub = N.addNotificationReceivedListener(() => {});
  });
  return () => sub?.remove();
}
