import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
  TabBarIOS,
  NavigatorIOS
} from 'react-native';

import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import HappyPurchase from './App/Views/Purchase/HappyPurchase';
import Plan from './App/Views/Plan/Plan';
import UserCenter from './App/Views/User/UserCenter';
import ShoppingCart from './App/Views/Cart/ShoppingCart';
import Test from './App/Test/test';
import Util from './App/Common/Util';
import * as net from './App/Network/Interface';

StatusBarIOS.setHidden(false);

let show = false;

var somira = React.createClass({
  getDefaultProps () {
    // 根据用户类型判断是否展示方案
    Store.get('user').then((user)=>{
      if (user && user.user_type === 1) {
        show = true;
      }
      else {
        show = false;
      }
    });
  },
  getInitialState(){
    this.getCartCount();
    return {
      selectedTab: show?'plan':'hp',
      notifyHpCartCount: 0,
      notifyPlanCartCount: 0,
      showPlan: show,
      notifyUserCount: 0,
    };
  },
  componentDidMount() {
    /*
     *非父子组件间的通信
     *使用全局事件 Pub/Sub 模式，
     *在componentDidMount里面订阅事件，在componentWillUnmount里面取消订阅，
     *当收到事件触发的时候调用 setState 更新 UI。

     *这种模式在复杂的系统里面可能会变得难以维护，
     *所以看个人权衡是否将组件封装到大的组件，
     *甚至整个页面或者应用就封装到一个组件。
     */
    RCTDeviceEventEmitter.addListener('showPlanSwitch', (v)=>{
      this.setState({
        showPlan: v
      });
    });
    RCTDeviceEventEmitter.addListener('loadCartCount', ()=>{
      this.getCartCount();
    });
  },
  changeTab(tabName){
    // 根据用户类型判断是否展示方案
    Store.get('user').then((user)=>{
      this.setState({
        showPlan: (user && user.user_type === 1) ? true : false
      });
    });
    this.setState({
      selectedTab : tabName
    });
  },
  // 获取购物车数量
  getCartCount() {
    Store.get('token').then((token)=>{
      if (token) {
        /*
         * 获取服务器中的乐夺宝购物车数量
         */
        Util.get(net.hpApi.redisCart, token,
        ({code, msg, info})=>{
          if (info) {
            this.setState({
              notifyHpCartCount: info.length
            });
          }
        },
        (e)=>{
          console.error(e);
        });
        /*
         * 获取服务器中的方案购物车数量
         */
        Util.post(net.planApi.queryCart, token, {},
        ({code, msg, result})=>{
          if (code === 1 && result) {
            this.setState({
              notifyPlanCartCount: result.length
            });
          }
        });
      }
    });
  },
  render: function() {
    // #26292E;#292C33;
    return (
      <TabBarIOS tintColor="#B22222" barTintColor="#FFF5EE">
        {
          this.state.showPlan
          ?
          <TabBarIOS.Item
            title="购买方案" icon={{uri:'购买方案',scale:2,isStatic:true}}
            selected={this.state.selectedTab === 'plan'}
            onPress={()=>{this.changeTab('plan')}}>
            <NavigatorIOS style={css.container}
              barTintColor={Util.headerColor}
              tintColor={'#333344'}
              navigationBarHidden={false}
              initialRoute={{
                title: '购买方案',
                titleTextColor: Util.headerTitleColor,
                component: Plan,
                wrapperStyle: css.wrapperStyle
              }}/>
          </TabBarIOS.Item>
          :
          null
        }
        <TabBarIOS.Item
          title="乐夺宝" icon={{uri:'乐夺宝',scale:3,isStatic:true}}
          selected={this.state.selectedTab === 'hp'}
          onPress={()=>{this.changeTab('hp')}}>
          <NavigatorIOS style={css.container}
            barTintColor={Util.headerColor}
            tintColor={'#333344'}
            navigationBarHidden={false}
            initialRoute={{
              title: '乐夺宝',
              titleTextColor: Util.headerTitleColor,
              component: HappyPurchase,
              wrapperStyle: css.wrapperStyle
            }}/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="购物车" icon={{uri:'购物车',scale:3,isStatic:true}}
          badge={
            this.state.notifyHpCartCount+this.state.notifyPlanCartCount > 0
            ?
            this.state.notifyHpCartCount+this.state.notifyPlanCartCount
            :
            undefined
          }
          selected={this.state.selectedTab === 'sc'}
          onPress={()=>{this.changeTab('sc')}}>
          <NavigatorIOS style={css.container}
            barTintColor={Util.headerColor}
            tintColor={'#333344'}
            navigationBarHidden={false}
            initialRoute={{
              title: '购物车',
              titleTextColor: Util.headerTitleColor,
              component: ShoppingCart,
              wrapperStyle: css.wrapperStyle
            }}/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="个人中心" icon={{uri:'个人中心',scale:2,isStatic:true}}
          badge={this.state.notifyUserCount > 0 ? this.state.notifyUserCount : undefined}
          selected={this.state.selectedTab === 'uc'}
          onPress={()=>{this.changeTab('uc')}}>
          <NavigatorIOS style={css.container}
            barTintColor={Util.headerColor}
            tintColor={'#333344'}
            navigationBarHidden={true}
            initialRoute={{
              title: '个人中心',
              titleTextColor: Util.headerTitleColor,
              component: UserCenter,
              wrapperStyle: css.wrapperStyle,
            }}/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});

var css = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: '#E7EAEC',
  },
  container:{
    flex:1
  }
});

AppRegistry.registerComponent('somira', () => somira);
