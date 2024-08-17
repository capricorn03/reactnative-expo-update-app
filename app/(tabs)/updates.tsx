import React, { useState, useEffect } from 'react';
import { Text, View, Button, ScrollView } from 'react-native';

export default function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://nextjs-restapi-beta.vercel.app/api/update'
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
    fetchData();
  }, []);

  if (error) {
    return (
      <View className="flex items-center justify-center h-screen">
        <Text className="text-red-500 text-xl font-bold">Error: {error}</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View className="flex items-center justify-center h-screen">
        <Text className="text-gray-500 text-xl font-bold">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex items-center justify-center h-screen bg-gray-100 pt-2">
      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold mb-2">Data from API:</Text>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {data.map((item: any, index: number) => (
            <View key={index} className="p-1 border-b border-gray-200">
              <Text className="text-gray-700">
                {JSON.stringify(item.topic)}
              </Text>
              <Text className="text-gray-700">
                {JSON.stringify(item.createdAt)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
