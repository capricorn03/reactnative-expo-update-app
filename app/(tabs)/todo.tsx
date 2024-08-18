import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'; // Import icons

interface Newsitem {
  _id: string;
  topic: string;
  description: string;
  createdAt: string;
  saved: boolean;
  updatedAt: string;
}

const updates = () => {
  const [data, setData] = useState<Newsitem[]>([]);
  const [fetcherror, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://nextjs-restapi-beta.vercel.app/api/update'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      // Sort by updatedAt in descending order (newest first)
      json.sort((a: Newsitem, b: Newsitem) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      setData(json);
    } catch (error: any) {
      setError(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://nextjs-restapi-beta.vercel.app/api/update/${id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the data state after successful deletion
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorite = async (id: string) => {
    try {
      const response = await fetch(
        `https://nextjs-restapi-beta.vercel.app/api/update/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the data state after successful toggle
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, saved: !item.saved } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [handleDelete]); // Fetch data only on initial mount

  if (fetcherror) {
    return (
      <View className="flex items-center justify-center h-screen bg-gray-100">
        <Text className="text-red-500 text-xl font-bold">
          Error: {fetcherror}
        </Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View className="flex items-center justify-center h-screen bg-gray-100">
        <Text className="text-gray-500 text-xl font-bold">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Saved News</Text>

      <FlatList
        data={data.filter((item) => item.saved === true)} // Filter for saved news
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-4 rounded-md shadow-md bg-white mb-4 flex-row justify-between items-center">
            <Pressable
              onPress={() => router.push(`/news/${item._id}`)}
              className="flex-1"
            >
              <Text className="text-lg font-medium text-gray-800 mb-2">
                {item.topic}
              </Text>
              <Text className="text-gray-500">{item.createdAt}</Text>
            </Pressable>
            <View className="absolute bottom-0 right-2 flex-1 flex-row gap-3 ">
              <TouchableOpacity
                className="px-6 py-4 "
                onPress={() => handleDelete(item._id)}
              >
                <AntDesign name="delete" size={18} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFavorite(item._id)}
                className="px-6 py-4 "
              >
                <AntDesign
                  name={item.saved ? 'heart' : 'hearto'}
                  size={18}
                  color={item.saved ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default updates;
