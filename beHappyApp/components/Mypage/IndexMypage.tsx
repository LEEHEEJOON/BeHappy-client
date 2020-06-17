import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MypageContainer from '../../containers/MypageContainer';
import MyInfo from './MyInfo';
import MyReviewsContainer from '../../containers/MyReviewsContainer';
import MyBookings from './MyBookings';
import BookMarkContainer from '../../containers/BookmarkContainer';

const Stack = createStackNavigator();

function IndexMypage() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='MypageContainer'
        component={MypageContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='MyInfo'
        component={MyInfo}
        options={{
          headerStyle: {
            backgroundColor: '#62CCAD',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name='BookMarkContainer' component={BookMarkContainer} />
      <Stack.Screen
        name='MyReviewsContainer'
        component={MyReviewsContainer}
        options={{ title: '리뷰관리' }}
      />
      <Stack.Screen name='MyBookings' component={MyBookings} />
    </Stack.Navigator>
  );
}
export default IndexMypage;
