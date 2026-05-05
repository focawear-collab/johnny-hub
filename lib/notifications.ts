import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Notification identifiers
// ---------------------------------------------------------------------------
export const NOTIFICATION_IDS = {
  FERMENT_TIMER: 'ferment-timer',
} as const;

// ---------------------------------------------------------------------------
// Handler: how to display notifications when the app is in the foreground
// ---------------------------------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ---------------------------------------------------------------------------
// requestPermissions
// Asks for iOS push notification permission (and returns the granted state).
// ---------------------------------------------------------------------------
export async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// ---------------------------------------------------------------------------
// setupNotificationChannel
// Creates an Android notification channel for the ferment timer with MAX
// importance.  No-op on iOS.
// ---------------------------------------------------------------------------
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_IDS.FERMENT_TIMER, {
    name: 'Ferment Timer',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF5722',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
    sound: 'default',
    enableLights: true,
    enableVibrate: true,
    showBadge: false,
  });
}

// ---------------------------------------------------------------------------
// scheduleLocalNotification
// Generic helper that schedules a local notification to fire after
// `triggerSeconds` seconds.  Returns the notification identifier.
// ---------------------------------------------------------------------------
export async function scheduleLocalNotification(
  title: string,
  body: string,
  triggerSeconds: number
): Promise<string | null> {
  const granted = await requestPermissions();
  if (!granted) return null;

  const id = await Notifications.scheduleNotificationAsync({
    identifier: undefined, // let Expo assign an ID
    content: {
      title,
      body,
      sound: true,
      data: { type: 'local' },
    },
    trigger: {
      seconds: Math.max(1, Math.floor(triggerSeconds)),
    },
  });

  return id;
}

// ---------------------------------------------------------------------------
// notifyFermentComplete
// Schedules a notification at the exact Date when the ferment will be ready.
// Uses a fixed identifier so it can be cancelled later.
// ---------------------------------------------------------------------------
export async function notifyFermentComplete(readyAt: Date): Promise<string | null> {
  const granted = await requestPermissions();
  if (!granted) return null;

  // Cancel any previously scheduled ferment notification before creating a new one
  await cancelFermentNotification();

  const secondsFromNow = Math.floor((readyAt.getTime() - Date.now()) / 1000);
  if (secondsFromNow <= 0) return null;

  const hours = Math.round(secondsFromNow / 3600);
  const bodyText =
    hours > 0
      ? `Han pasado ${hours}h. Saca la masa del frío.`
      : 'Saca la masa del frío.';

  const id = await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.FERMENT_TIMER,
    content: {
      title: '¡Tu masa está lista!',
      body: bodyText,
      sound: true,
      data: { type: 'ferment_complete', readyAt: readyAt.toISOString() },
    },
    trigger: {
      seconds: Math.max(1, secondsFromNow),
    },
  });

  return id;
}

// ---------------------------------------------------------------------------
// cancelFermentNotification
// Cancels the pending ferment-timer notification by its fixed identifier.
// ---------------------------------------------------------------------------
export async function cancelFermentNotification(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.FERMENT_TIMER);
  } catch {
    // The notification may not exist yet — that's fine.
  }
}

// ---------------------------------------------------------------------------
// handleForegroundNotification
// Sets up a listener for notifications received while the app is in the
// foreground.  Returns the subscription so the caller can remove it on
// unmount.
// ---------------------------------------------------------------------------
export function handleForegroundNotification(
  onNotification?: (notification: Notifications.Notification) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (onNotification) {
      onNotification(notification);
    }
  });
}
