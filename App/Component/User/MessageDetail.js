'use strict';

import React from 'react';
import Store from 'react-native-simple-store';
import Util from './../../Common/Util';
import * as net from './../../Network/Interface';

import {
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      msg: '',
      loaded: false,
    };
  },
  componentDidMount: function() {
    this._getMessage();
  },
  _getMessage:function(){
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.userApi.queryMessage + '?msgid=' + this.props.id, token,
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              loaded: true,
              msg: result,
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.msgRow,styles.bordorBottom]}>
          <Text style={styles.fontCss}>
            {this.state.msg.msg_type}
          </Text>
          <Text style={styles.fontCss}>
            {this.state.msg.msgCreateTime}
          </Text>
        </View>
        <WebView
          contentInset={{top:0,bottom:0}}
          html={this.state.msg.msg_content}
          startInLoadingState={this.state.loaded}
          scalesPageToFit={false}
          scrollEnabled={true}
          automaticallyAdjustContentInsets={false}
          />
        <View style={styles.bordorBottom}/>
        <View style={[{alignSelf:'flex-end'},styles.msgRow]}>
          <Text style={styles.fontCss}>
            收米拉客服
          </Text>
        </View>
       </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop:66,
  },
  bordorBottom: {
    borderBottomColor : '#C0C0C0',
    borderBottomWidth : 1,
  },
  msgRow : {
  	flexDirection : 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  shadom: {
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    textShadowColor: '#FFD700',
  },
  fontCss: {
    fontSize: 14,
    fontWeight: '100',
  },
});
