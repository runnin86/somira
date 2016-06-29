import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
  TabBarIOS,
  NavigatorIOS,
  Alert,
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

var somira = React.createClass({
  getDefaultProps () {
  },
  getInitialState(){
    this.getNotice();
    this.isShowPlan();
    this.getCartCount();
    return {
      selectedTab: '',
      notifyHpCartCount: 0,
      notifyPlanCartCount: 0,
      showPlan: false,
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
    RCTDeviceEventEmitter.addListener('loadNotice', ()=>{
      this.getNotice();
    });
    RCTDeviceEventEmitter.addListener('showPlanSwitch', ()=>{
      this.isShowPlan();
    });
    RCTDeviceEventEmitter.addListener('loadCartCount', ()=>{
      this.getCartCount();
    });
  },
  changeTab(tabName){
    this.setState({
      selectedTab : tabName
    });
  },
  isShowPlan() {
    // 根据用户类型判断是否展示方案
    Store.get('user').then((user)=>{
      if (user && user.user_type === 1) {
        this.setState({
          showPlan: true,
          selectedTab: this.state.selectedTab ? this.state.selectedTab : 'plan'
        });
      }
      else {
        this.setState({
          showPlan: false,
          selectedTab: this.state.selectedTab ? this.state.selectedTab : 'hp'
        });
      }
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
      else {
        this.setState({
          notifyHpCartCount: 0,
          notifyPlanCartCount: 0
        });
      }
    });
  },
  getNotice() {
    // 获取存储的消息ID
    Store.get('globalNoticeId').then((globalNoticeId)=>{
      Store.get('token').then((token)=>{
        if (token) {
          /*
           * 获取系统公告
           */
          Util.get(net.userApi.notice, token,
          ({code, msg, result})=>{
            // console.log(result);
            if (code === 1 && result) {
              if (!globalNoticeId || (globalNoticeId && result.notice_id !== globalNoticeId)) {
                // 不存在和不相等需要新增本地缓存级别的系统通知对象,
                Store.save('globalNoticeId', result.notice_id);
                Alert.alert(
                  result.notice_title,
                  result.notice_content,
                  [
                    {text: '确认', onPress: () => console.log('OK Pressed!')},
                  ]
                );
              }
            }
          },
          (e)=>{
            console.error(e);
          });
        }
      });
    });
  },
  render: function() {
    // #26292E;#292C33;
    return (
      <TabBarIOS tintColor="#ed8e07" barTintColor="#000000">
        {
          this.state.showPlan
          ?
          <TabBarIOS.Item
            title="购买方案" icon={{uri:'购买方案',scale:2,isStatic:true}}
            selected={this.state.selectedTab === 'plan'}
            onPress={()=>{this.changeTab('plan')}}>
            <NavigatorIOS style={css.container}
              barTintColor={Util.headerColor}
              tintColor={Util.headerTitleColor}
              titleTextColor={Util.headerTitleColor}
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
          title="一元夺宝" icon={{uri:'乐夺宝',scale:2,isStatic:true}}
          selected={this.state.selectedTab === 'hp'}
          onPress={()=>{this.changeTab('hp')}}>
          <NavigatorIOS style={css.container}
            barTintColor={Util.headerColor}
            tintColor={Util.headerTitleColor}
            titleTextColor={Util.headerTitleColor}
            navigationBarHidden={false}
            initialRoute={{
              title: '一元夺宝',
              titleTextColor: Util.headerTitleColor,
              component: HappyPurchase,
              wrapperStyle: css.wrapperStyle
            }}/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title="购物车" icon={{uri:'购物车menu',scale:2,isStatic:true}}
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
            tintColor={Util.headerTitleColor}
            titleTextColor={Util.headerTitleColor}
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
            tintColor={Util.headerTitleColor}
            titleTextColor={Util.headerTitleColor}
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
