import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'; // Import icons

interface Newsitem {
  _id: string;
  topic: string;
  description: string;
  createdAt: string;
  saved: boolean; // Assuming you have a 'saved' field in your data
}

export default function HomeScreen() {
  const [data, setData] = useState<Newsitem[]>([]);
  const [fetcherror, setError] = useState(null);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://nextjs-restapi-beta.vercel.app/api/update'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      json.reverse();
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
  }, [handleDelete]);

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
    <View className="flex items-center justify-start h-screen bg-gray-100 p-4 ">
      <View className=" w-full">
        <Text className="text-2xl font-bold mb-4">News Feed</Text>

        <FlatList
          className="mb-14"
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }: { item: Newsitem }) => (
            <View
              className=" relative p-4 pb-2 rounded-md shadow-md bg-white mb-4 flex-row justify-between items-center"
              key={item._id}
            >
              <Pressable
                onPress={() => router.navigate(`/news/${item._id}`)}
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
    </View>
  );
}

// import React, { useState, useEffect } from 'react';
// import { Text, View, FlatList, Pressable } from 'react-native';
// import { useRouter } from 'expo-router';
// interface Newsitem {
//   _id: string;
//   topic: string;
//   description: string;
//   createdAt: string;
// }

// export default function HomeScreen() {
//   const [data, setData] = useState<Newsitem[]>([]);
//   const [fetcherror, setError] = useState(null);

//   const router = useRouter();

//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         'https://nextjs-restapi-beta.vercel.app/api/update'
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const json = await response.json();
//       json.reverse();
//       setData(json);
//     } catch (error: any) {
//       setError(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (fetcherror) {
//     return (
//       <View className="flex items-center justify-center h-screen">
//         <Text className="text-red-500 text-xl font-bold">
//           Error: {fetcherror}
//         </Text>
//       </View>
//     );
//   }

//   if (!data.length) {
//     return (
//       <View className="flex items-center justify-center h-screen">
//         <Text className="text-gray-500 text-xl font-bold">Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex items-center justify-center h-screen bg-gray-100 pt-2">
//       <View className="bg-white p-4 rounded-lg shadow-md">
//         <Text className="text-lg font-bold mb-2">Data from API:</Text>

//         <FlatList
//           data={data}
//           keyExtractor={(item) => item._id} // Assuming your API returns objects with an 'id' property
//           renderItem={({ item }: { item: Newsitem }) => (
//             <View className="p-1 border-b border-gray-200">
//               <Pressable onPress={() => router.push(`/news/${item._id}`)}>
//                 <Text className="text-gray-700">{item.topic}</Text>
//                 <Text className="text-gray-700">{item.createdAt}</Text>
//               </Pressable>

//             </View>
//           )}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </View>
//   );
// }

// // import React, { useState, useEffect } from 'react';
// // import { Text, View, ScrollView, ToastAndroid, FlatList } from 'react-native';
// // import { useRouter } from 'expo-router';
// // import { useShareIntentContext } from 'expo-share-intent';

// // export default function HomeScreen() {
// //   const [data, setData] = useState([]);
// //   const [fetcherror, setError] = useState(null);

// //   const router = useRouter();
// //   const { hasShareIntent, shareIntent, error, resetShareIntent } =
// //     useShareIntentContext();

// //   const requestOptions = {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ topic: shareIntent.text }),
// //   };

// //   const postExample = async () => {
// //     try {
// //       await fetch(
// //         'https://nextjs-restapi-beta.vercel.app/api/update',
// //         requestOptions
// //       ).then((response) => {
// //         response.json().then((data) => {
// //           ToastAndroid.show('News is saved sucessfully', ToastAndroid.SHORT);
// //         });
// //       });
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (hasShareIntent) {
// //       postExample();
// //     }
// //   }, [hasShareIntent]); // Add dependency for useEffect to run when hasShareIntent changes

// //   const fetchData = async () => {
// //     try {
// //       const response = await fetch(
// //         'https://nextjs-restapi-beta.vercel.app/api/update'
// //       );
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const json = await response.json();
// //       json.reverse();
// //       setData(json);
// //     } catch (error: any) {
// //       setError(error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   if (fetcherror) {
// //     return (
// //       <View className="flex items-center justify-center h-screen">
// //         <Text className="text-red-500 text-xl font-bold">
// //           Error: {fetcherror}
// //         </Text>
// //       </View>
// //     );
// //   }

// //   if (!data.length) {
// //     return (
// //       <View className="flex items-center justify-center h-screen">
// //         <Text className="text-gray-500 text-xl font-bold">Loading...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View className="flex items-center justify-center h-screen bg-gray-100 pt-2">
// //       <View className="bg-white p-4 rounded-lg shadow-md">
// //         <Text className="text-lg font-bold mb-2">Data from API:</Text>
// //         <ScrollView
// //           contentContainerStyle={{ paddingBottom: 20 }}
// //           showsVerticalScrollIndicator={false}
// //         >
// //           <FlatList
// //             data={data}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => <Text>{item.topic}</Text>}
// //           />
// //           {/* {data.map((item: any, index: number) => (
// //             <View key={index} className="p-1 border-b border-gray-200">
// //               <Text className="text-gray-700">
// //                 {JSON.stringify(item.topic)}
// //               </Text>
// //               {/* <Text className="text-gray-700">
// //                 {JSON.stringify(item.description)}
// //               </Text> */}
// //               <Text className="text-gray-700">
// //                 {JSON.stringify(item.createdAt)}
// //               </Text>
// //             </View>
// //           ))} */}
// //         </ScrollView>
// //       </View>
// //     </View>
// //   );
// // }

// // // import { View, Text, FlatList, Pressable } from 'react-native';
// // // import React from 'react';

// // // import news from './news.json';
// // // import { router } from 'expo-router';

// // // const updates = () => {
// // //   return (
// // //     <View className="flex-1 p-4">
// // //       <Text className="text-2xl font-bold mb-4">News Feed</Text>

// // //       <FlatList
// // //         data={news}
// // //         keyExtractor={(item) => item.title}
// // //         renderItem={({ item }) => (
// // //           <Pressable onPress={() => router.push(`/news/${item.id}`)}>
// // //             <Text className="text-lg font-semibold mb-2">{item.title}</Text>
// // //           </Pressable>
// // //         )}
// // //       />
// // //     </View>
// // //   );
// // // };

// // // export default updates;
