import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import { useShareIntentContext } from 'expo-share-intent';

const App = () => {
  const { hasShareIntent } = useShareIntentContext();
  const router = useRouter();
  useEffect(() => {
    if (hasShareIntent) {
      // we want to handle share intent event in a specific page
      router.replace({
        pathname: 'shareintent',
      });
    }
  }, [hasShareIntent]);

  return (
    <View className="flex-1 items-center justify-center">
      <CustomButton onPress={() => router.push('/home')} title="Get Started" />
    </View>
  );
};

export default App;
