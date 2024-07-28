import { View, Text } from 'react-native';
import React from 'react';
import PostRequestExample from '@/components/PostRequestExample';

const updates = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-blue-500">My notes App</Text>
      <PostRequestExample />
    </View>
  );
};

export default updates;
