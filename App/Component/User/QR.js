import React from 'react-native';
import Store from 'react-native-simple-store';

import QRCode from '../../Common/QRCode';
import Util from '../../Common/Util';
import * as net from '../../Network/Interface';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      text: ''
    }
  },
  componentDidMount: function() {
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.userApi.qrcode, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              text: result
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  /*
   * 渲染(JSX,通过state控制DOM结构变化)
   */
  render: function() {
    return (
      <View style={css.container}>
        <QRCode
          value={this.state.text}
          size={Util.size['width']-100}
          bgColor='#FFFFFF'
          fgColor='#000000'/>
      </View>
    );
  }
});

var css = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});
