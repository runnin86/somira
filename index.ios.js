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
  Modal,
  ScrollView,
  TouchableHighlight,
  AlertIOS,
  PushNotificationIOS,
  AppStateIOS,
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
      showModal: false,
      noticeTitle: '',
      noticeContent: '',
      appState: AppStateIOS.currentState,
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
    // 设置要在手机主屏幕应用图标上显示的角标数
    PushNotificationIOS.setApplicationIconBadgeNumber(0);

    // 运行状态变更监听
    AppStateIOS.addEventListener('change', (appState)=>{
      this.setState({appState});
    });

    // 运行时,后台运行时
    PushNotificationIOS.addEventListener('notification', (notification)=>this.processingPush(notification, false));
    // 不在运行时，返回初始的通知对象，或者返回null。后续的调用全部会返回null.
    let initNotification = PushNotificationIOS.popInitialNotification();
    if (initNotification) {
      this.processingPush(initNotification, true);
    }
  },
  componentWillUnmount: function() {
    PushNotificationIOS.removeEventListener('notification');
    AppStateIOS.removeEventListener('change');
    RCTDeviceEventEmitter.removeEventListener('loadCartCount');
    RCTDeviceEventEmitter.removeEventListener('showPlanSwitch');
    RCTDeviceEventEmitter.removeEventListener('loadNotice');
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
                // 展示modal
                this.setState({
                  showModal: true,
                  noticeTitle: result.notice_title,
                  noticeContent: result.notice_content,
                });
                // Alert.alert(
                //   result.notice_title,
                //   result.notice_content,
                //   [
                //     {text: '确认', onPress: () => console.log('OK Pressed!')},
                //   ]
                // );
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
  processingPush(notification, first) {
    // { _data: { xg: { bid: 0, ts: 1467686578 }, msgId: '001', msgType: 0 },
    //   _alert: '方案开奖结果通知',
    //   _sound: undefined,
    //   _badgeCount: 1 }
    // msgType:0 跳转消息记录 msgTpye:1 跳转方案列表
    if (notification) {
      // app状态为background或首次启动时要处理推送消息
      if (this.state.appState === 'background' || first) {
        if (notification._data.msgType === '0') {
          // 跳转消息记录(根据msgId查询消息并展示)
          this.setState({
            selectedTab : 'uc',
          });
          // 防止用户中心未渲染,因此0.8秒后广播,让用户中心渲染后创建监听器
          setTimeout(()=>{
            // 广播至用户中心展示消息
            RCTDeviceEventEmitter.emit('showPushMessage', notification._data.msgId);
          }, 800);
        }
        else if (notification._data.msgType === '1') {
          // 跳转方案列表
          this.setState({
            selectedTab : 'plan',
          });
        }
      }
      else if (this.state.appState === 'active') {
        AlertIOS.alert(
          '提示',
          notification._alert,
          [
            {text: '取消', onPress: null},
            {text: '去看看', onPress: null},
          ]
        );//c70807ac0d9947249ca5fb573452c5b0
      }
    }
  },
  render: function() {
    // #26292E;#292C33;
    return (
      <View style={css.container}>
        <TabBarIOS tintColor="#ed8e07" barTintColor="#000000">
          {
            this.state.showPlan
            ?
            <TabBarIOS.Item
              title="购买方案" icon={{uri:'购买方案',scale:2,isStatic:true}}
              selected={this.state.selectedTab === 'plan'}
              onPress={()=>{
                this.setState({
                  selectedTab : 'plan'
                })
              }}>
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
            onPress={()=>{
              this.setState({
                selectedTab : 'hp'
              })
            }}>
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
            onPress={()=>{
              this.setState({
                selectedTab : 'sc'
              })
            }}>
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
            onPress={()=>{
              this.setState({
                selectedTab : 'uc'
              })
            }}>
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
                passProps:{
                }
              }}/>
          </TabBarIOS.Item>
        </TabBarIOS>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.showModal}
          >
          <View style={css.modalView}>
            <View style={css.innerContainer}>
              <Text style={{padding:10,fontSize:16,fontWeight:'500'}}>
                {this.state.noticeTitle}
              </Text>
              <ScrollView style={css.modalContent}>
                <Text style={{fontSize:14,fontWeight:'100'}}>{this.state.noticeContent}</Text>
              </ScrollView>
              <View style={css.line} />
              <TouchableHighlight
                onPress={()=>{this.setState({showModal: false})}}
                style={css.modalButton}
                underlayColor="#a9d9d4">
                  <Text style={css.buttonText}>确认</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
});

var css = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: '#E7EAEC',
  },
  container:{
    flex:1
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButton: {
    // flex: 1,
    height: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
    // overflow: 'hidden',
    // marginTop: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  modalContent: {
    height:Util.size['height']*0.3,
    marginLeft:16,
    marginRight:16,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'blue',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  line:{
    height:1,
    alignSelf: 'stretch',
    backgroundColor: '#000000',
    marginTop: 10,
  },
});

AppRegistry.registerComponent('somira', () => somira);
