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
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>1. 注册问题?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            目前注册仅支持网页端进行注册，请访问收米拉网站进行注册。
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>2. 充值问题?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            因支付渠道正在加紧申请当中，充值目前只能通过联系客服进行
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>3. 领奖问题?</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            如您参与一元夺宝获得宝贝，客服会第一时间联系您，
            将宝贝快递至您手中，后续会更新系统自动发货。
          </Text>
        </View>

        <View style={{left:10,marginTop:16}}>
          <Text style={{flex: 1, fontSize: 14, color: 'red',top:-6}}>4. 声明</Text>
          <Text style={{flex: 1, fontSize: 12, width:Util.size['width']-40,left:14}}>
            所有商品抽奖活动与苹果公司(Apple Inc.)无关。
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
