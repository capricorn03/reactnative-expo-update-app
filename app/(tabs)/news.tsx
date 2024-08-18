import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [fetcherror, setError] = useState(null);

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

  if (fetcherror) {
    return (
      <View className="flex items-center justify-center h-screen">
        <Text className="text-red-500 text-xl font-bold">
          Error: {fetcherror}
        </Text>
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

// import { View, Text, FlatList, Pressable } from 'react-native';
// import React from 'react';

// import news from './news.json';
// import { router } from 'expo-router';

// const updates = () => {
//   return (
//     <View className="flex-1 p-4">
//       <Text className="text-2xl font-bold mb-4">News Feed</Text>

//       <FlatList
//         data={news}
//         keyExtractor={(item) => item.title}
//         renderItem={({ item }) => (
//           <Pressable onPress={() => router.push(`/news/${item.id}`)}>
//             <Text className="text-lg font-semibold mb-2">{item.title}</Text>
//           </Pressable>
//         )}
//       />
//     </View>
//   );
// };

// export default updates;
