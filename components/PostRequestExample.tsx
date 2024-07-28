import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Pressable } from 'react-native';
import CustomButton from '@/components/CustomButton';

const PostRequestExample = ({ value }: { value: string }) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: value }),
  };

  const postExample = async () => {
    try {
      await fetch(
        'https://nextjs-restapi-beta.vercel.app/api/update',
        requestOptions
      ).then((response) => {
        response.json().then((data) => {
          Alert.alert('Post created at : ', data.createdAt);
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <CustomButton
        onPress={postExample}
        title="Click to make a Post request"
      />
    </View>
  );
};

export default PostRequestExample;
