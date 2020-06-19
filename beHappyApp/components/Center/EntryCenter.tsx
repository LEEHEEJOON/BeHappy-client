import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import CenterMainContainer from '../../containers/center/CenterMainContainer';
import IndexCenterPage from './IndexCenterPage';

const Tab = createBottomTabNavigator();

export default function EntryCenter() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName='CenterMainContainer'
        tabBarOptions={{
          // inactiveTintColor: 'white',
          // activeTintColor: 'black',
          // activeBackgroundColor: '#62CCAD',
          // inactiveBackgroundColor: '#62CCAD',
          inactiveTintColor: 'grey',
          activeTintColor: '#62CCAD',
          activeBackgroundColor: 'white',
          inactiveBackgroundColor: 'white',
        }}
      >
        <Tab.Screen
          name='CenterMainContainer'
          component={CenterMainContainer}
          options={{
            tabBarLabel: '메인',
            tabBarIcon: ({ color }) => (
              <Fontisto name='nursing-home' color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name='CenterPage'
          component={IndexCenterPage}
          options={{
            tabBarLabel: '예약관리',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='calendar-check'
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
