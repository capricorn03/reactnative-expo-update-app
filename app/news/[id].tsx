import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

interface Newsitem {
  topic: string;
  description: string;
  createdAt: string;
}

const NewsDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<Newsitem | null>(null); // Set initial state to null
  const [fetcherror, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://nextjs-restapi-beta.vercel.app/api/update/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    if (id) {
      // Make sure you have an ID before fetching
      fetchData();
    }
  }, [id]); // Only fetch when the id changes

  if (fetcherror) {
    return (
      <View className="flex-1 p-4">
        <Text className="text-red-500 text-xl font-bold">
          Error: {fetcherror}
        </Text>
      </View>
    );
  }

  if (!data) {
    // Check if data is still loading or not found
    return (
      <View className="flex-1 p-4">
        <Text className="text-gray-500 text-xl font-bold">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pl-4 pr-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-4">{data.topic}</Text>
        <Text className="text-gray-600">{data.description}</Text>
        <Text className="text-gray-600">Created At: {data.createdAt}</Text>
      </ScrollView>
    </View>
  );
};

export default NewsDetailsScreen;
