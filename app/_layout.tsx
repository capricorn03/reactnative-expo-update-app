import { Slot, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';

import { ShareIntentProvider } from 'expo-share-intent';

export default function Rootlayout() {
  const router = useRouter();

  return (
    <ShareIntentProvider
      options={{
        debug: true,
        resetOnBackground: true,
        onResetShareIntent: () =>
          // used when app going in background and when the reset button is pressed
          router.replace({
            pathname: '/',
          }),
      }}
    >
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarAnimation: 'fade',
            statusBarStyle: 'auto',
          }}
        />
        <Stack.Screen
          name="news/[id]"
          options={{
            headerShown: false,
            statusBarAnimation: 'fade',
            statusBarStyle: 'auto',
          }}
        />
      </Stack>
    </ShareIntentProvider>
  );
}
