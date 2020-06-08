import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default class Logo extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 40, height: 70 }}
          source={require('../../assets/splash.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
