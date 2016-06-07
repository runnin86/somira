'use strict';

import React from 'react-native';
import Util from './../../Common/Util';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  LinkingIOS,
} = React;

module.exports = React.createClass({
  _call:function(){
    LinkingIOS.openURL('tel://4008710088');
  },
  render: function() {
    return (
      <ScrollView contentContainerStyle={css.stage}>
        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>1. 充值问题?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            继续充值
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>2. 如何领奖?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            单注100万元以下奖金直接打到您的账户，
            可以随时消费提现；
            单注100万元以上奖金，请您放心，如果你中了大奖，
            我们会有专人及时联系你，并全程协助您安全领奖。
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>3. 提现问题?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            找客服
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>4. 如何领奖?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            单注100万元以下奖金直接打到您的账户，
            可以随时消费提现；
            单注100万元以上奖金，请您放心，如果你中了大奖，
            我们会有专人及时联系你，并全程协助您安全领奖。
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>5. 如何领奖?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            单注100万元以下奖金直接打到您的账户，
            可以随时消费提现；
            单注100万元以上奖金，请您放心，如果你中了大奖，
            我们会有专人及时联系你，并全程协助您安全领奖。
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>1. 充值问题?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            继续充值
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>2. 如何领奖?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            单注100万元以下奖金直接打到您的账户，
            可以随时消费提现；
            单注100万元以上奖金，请您放心，如果你中了大奖，
            我们会有专人及时联系你，并全程协助您安全领奖。
          </Text>
        </View>

        <View style={{bottom:-10,marginTop:16,alignItems:'center',justifyContent: 'center'}}>
          <Image style={css.resizeMode} source={require('image!温馨提示')}/>
          <Text style={{height:20,fontSize: 12, color: 'gray'}}>
            如果您的问题未能解决，请联系客服人员。
          </Text>
          <TouchableHighlight
            style={{justifyContent:'center',alignItems:'center'}}
            underlayColor="#dad9d7" onPress={()=>this._call()}>
            <Text style={{flex: 1, fontSize: 12, color: '#000000'}}>
              客服电话400-8710-088
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
});

var css = StyleSheet.create({
  stage: {
    backgroundColor:'#FFFFFF',
    paddingTop: 0,
    paddingBottom: 0,
  },
  resizeMode: {
    width: 120,
    paddingBottom:20,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  }
});
