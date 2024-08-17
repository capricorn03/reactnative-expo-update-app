import { View, Text } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import news from '../(tabs)/news.json';

const NewsDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  // Assuming you're accessing the news data from news.json
  const newsItem = news.find((item) => item.id === id);

  if (!newsItem) {
    return <Text>News item not found {id}</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">{newsItem.title}</Text>
      <Text className="text-gray-600">{newsItem.content}</Text>
    </View>
  );
};

export default NewsDetailsScreen;
