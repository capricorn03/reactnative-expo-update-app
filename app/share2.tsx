import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import PostRequestExample from '@/components/PostRequestExample';
import { useEffect } from 'react';

export default function ShareIntent() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, error, resetShareIntent } =
    useShareIntentContext();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: shareIntent.text }),
  };

  const postExample = async () => {
    try {
      await fetch(
        'https://nextjs-restapi-beta.vercel.app/api/update',
        requestOptions
      ).then((response) => {
        response.json().then((data) => {
          ToastAndroid.show('News is saved sucessfully', ToastAndroid.SHORT);
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (hasShareIntent) {
      postExample();
    }
  }, [hasShareIntent]); // Add dependency for useEffect to run when hasShareIntent changes

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={[styles.logo, styles.gap]}
      />
      {!hasShareIntent && <Text>No Share intent detected</Text>}
      {hasShareIntent && (
        <Text style={[styles.gap, { fontSize: 20 }]}>
          Congratz, a share intent value is available
        </Text>
      )}
      {!!shareIntent.text && (
        <Text style={styles.gap}>
          <PostRequestExample value={shareIntent.text} />
          {shareIntent.text}
        </Text>
      )}
      {!!shareIntent.meta?.title && (
        <Text style={styles.gap}>{JSON.stringify(shareIntent.meta)}</Text>
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
