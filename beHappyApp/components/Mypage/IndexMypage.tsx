import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Mypage from './Mypage';
import MyInfo from './MyInfo';
import MyBookmarks from './MyBookmarks';
import MyReviews from './MyReviews';
import MyBookings from './MyBookings';

const stackNav = createStackNavigator(
  {
    Mypage: {
      screen: Mypage,
      navigationOptions: { headerShown: false },
    },
    MyInfo: {
      screen: MyInfo,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#62CCAD',
        },
        headerTintColor: 'white',
      },
    },
    MyBookmarks: {
      screen: MyBookmarks,
    },
    MyReviews: {
      screen: MyReviews,
    },
    MyBookings: {
      screen: MyBookings,
    },
  },
  {
    initialRouteName: 'Mypage',
  }
);

const NavContainer = createAppContainer(stackNav);

class IndexMypage extends React.Component {
  static navigationOptions = { header: null };
  render() {
    return <NavContainer />;
  }
}

export default IndexMypage;
