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

import HappyPurchase from './App/Views/Purchase/HappyPurchase';
import Plan from './App/Views/Plan/Plan';
import UserCenter from './App/Views/User/UserCenter';
import ShoppingCart from './App/Views/Cart/ShoppingCart';
import Test from './App/Test/test';
import Util from './App/Common/Util';

StatusBarIOS.setHidden(false);

var somira = React.createClass({
  getInitialState(){
    return {
      selectedTab: 'plan',
      notifyCartCount: 18,
      notifyUserCount: 1
    };
  },
  changeTab(tabName){
    this.setState({
      selectedTab : tabName
    });
  },
  render: function() {
    // #26292E;#292C33;
    return (
      <TabBarIOS tintColor="#B22222" barTintColor="#FFF5EE">
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
          badge={this.state.notifyCartCount > 0 ? this.state.notifyCartCount : undefined}
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
              wrapperStyle: css.wrapperStyle
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
