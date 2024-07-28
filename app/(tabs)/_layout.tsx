import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/lib/Colors';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="updates" />
    </Tabs>
  );
};

export default _layout;
