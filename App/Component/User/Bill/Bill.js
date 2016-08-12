'use strict';

import React, { Component } from 'react';
import MenuItem from '../../../Common/MenuItem';
import Plan from './Plan';
import Withdraw from './Withdraw';
import Reward from './Reward';
import Recharge from './Recharge';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

module.exports = React.createClass({
  _addNavigator: function(component, title){
    var data = null;
    this.props.navigator.push({
      title: title,
      component: component,
      navigationBarHidden:false,
      passProps:{
        data: data
      }
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <MenuItem
          title='方案记录'
          height='46'
          fontSize='16'
          onClick={()=>{this._addNavigator(Plan, "方案记录")}}/>
        <View style={[styles.line]} />
        <MenuItem
          title='提现'
          height='46'
          fontSize='16'
          onClick={()=>{this._addNavigator(Withdraw, "提现记录")}}/>
        <View style={[styles.line]} />
        <MenuItem
          title='充值'
          height='46'
          fontSize='16'
          onClick={()=>{this._addNavigator(Recharge, "充值记录")}}/>
        <View style={[styles.line]} />
        <MenuItem
          title='打赏'
          height='46'
          fontSize='16'
          onClick={()=>{this._addNavigator(Reward, "打赏记录")}}/>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 66,
    backgroundColor: '#f4f4f4',
  },
  line:{
    height:2,
  },
});
