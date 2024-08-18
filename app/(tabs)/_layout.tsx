import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/lib/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          tabBarLabel: 'Todo',
          tabBarIcon: ({ color }) => (
            <AntDesign name="star" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
