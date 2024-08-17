import { View, Text, FlatList, Pressable } from 'react-native';
import React from 'react';

import news from './news.json';
import { router } from 'expo-router';

const HomeScreen = () => {
  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">News Feed</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/news/${item.id}`)}>
            <Text className="text-lg font-semibold mb-2">{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default HomeScreen;
