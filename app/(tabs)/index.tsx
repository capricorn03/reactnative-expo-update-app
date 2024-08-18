import { View, Text, ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import { useShareIntentContext } from 'expo-share-intent';

const App = () => {
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

  // const { hasShareIntent } = useShareIntentContext();
  // useEffect(() => {
  //   if (hasShareIntent) {
  //     // we want to handle share intent event in a specific page
  //     router.replace({
  //       pathname: 'home',
  //     });
  //   }
  // }, [hasShareIntent]);

  return (
    <View className="flex-1 items-center justify-center">
      <CustomButton onPress={() => router.push('/news')} title="Read news" />
    </View>
  );
};

export default App;
