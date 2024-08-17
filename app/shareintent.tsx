// import { Button, Image, StyleSheet, Text, View } from 'react-native';

// import { useRouter } from 'expo-router';
// import { useShareIntentContext } from 'expo-share-intent';
// import PostRequestExample from '@/components/PostRequestExample';

// export default function ShareIntent() {
//   const router = useRouter();
//   const { hasShareIntent, shareIntent, error, resetShareIntent } =
//     useShareIntentContext();

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../assets/images/icon.png')}
//         style={[styles.logo, styles.gap]}
//       />
//       {!hasShareIntent && <Text>No Share intent detected</Text>}
//       {hasShareIntent && (
//         <Text style={[styles.gap, { fontSize: 20 }]}>
//           Congratz, a share intent value is available
//         </Text>
//       )}
//       {!!shareIntent.text && (
//         <Text style={styles.gap}>
//           <PostRequestExample  value= {shareIntent.text} />
//           {shareIntent.text}
//         </Text>
//       )}
//       {!!shareIntent.meta?.title && (
//         <Text style={styles.gap}>{JSON.stringify(shareIntent.meta)}</Text>
//       )}
//       {shareIntent?.files?.map((file) => (
//         <Image
//           key={file.path}
//           source={{ uri: file.path }}
//           style={[styles.image, styles.gap]}
//         />
//       ))}
//       {hasShareIntent && (
//         <Button onPress={() => resetShareIntent()} title="Reset" />
//       )}
//       <Text style={[styles.error]}>{error}</Text>
//       <Button onPress={() => router.replace('/')} title="Go home" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: 75,
//     height: 75,
//     resizeMode: 'contain',
//   },
//   image: {
//     width: 200,
//     height: 200,
//     resizeMode: 'contain',
//   },
//   gap: {
//     marginBottom: 20,
//   },
//   error: {
//     color: 'red',
//   },
// });

import { Button, Image, StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const SHARE_INTENT_TASK = 'SHARE_INTENT_TASK';

// Example function to send data to the server
async function sendDataToServer(data: string) {
  console.log('Sending data to server:', data);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: data }),
  };

  try {
    const response = await fetch(
      'https://nextjs-restapi-beta.vercel.app/api/update',
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Server response:', result);
    Alert.alert('Post created at : ', result.createdAt); // Assuming your API returns a createdAt property
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

// Define the background task
TaskManager.defineTask(SHARE_INTENT_TASK, async () => {
  const { shareIntent, resetShareIntent } = useShareIntentContext();
  if (shareIntent.text) {
    await sendDataToServer(shareIntent.text);
    await resetShareIntent(); // Clear the share intent after processing
  }
});

// Register the background task
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, error, resetShareIntent } =
    useShareIntentContext();

  // Function to handle share intent in background
  const handleShareIntent = async () => {
    if (hasShareIntent && !error && shareIntent.text) {
      // Trigger the background task with a silent notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Share Intent Processed',
          body: 'Data is being sent to the server',
        },
        trigger: null,
      });
    }
  };

  // Use useEffect to watch for changes in the share intent state
  useEffect(() => {
    handleShareIntent();
  }, [hasShareIntent, shareIntent, error]); // Add dependencies for the effect

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={[styles.logo, styles.gap]}
      />

      {!hasShareIntent && <Text>No Share intent detected</Text>}
      {hasShareIntent && (
        <Text style={[styles.gap, { fontSize: 20 }]}>
          Share intent value is available
        </Text>
      )}

      {!!shareIntent.text && (
        <Text style={styles.gap}>Shared Text: {shareIntent.text}</Text>
      )}

      {!!shareIntent.meta?.title && (
        <Text style={styles.gap}>
          Meta Data: {JSON.stringify(shareIntent.meta)}
        </Text>
      )}

      {shareIntent?.files?.map((file) => (
        <Image
          key={file.path}
          source={{ uri: file.path }}
          style={[styles.image, styles.gap]}
        />
      ))}

      {hasShareIntent && (
        <Button onPress={() => resetShareIntent()} title="Reset" />
      )}

      <Text style={[styles.error]}>{error}</Text>

      <Button onPress={() => router.replace('/')} title="Go home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  gap: {
    marginBottom: 20,
  },
  error: {
    color: 'red',
  },
});
