'use strict';

import React from 'react';
import ReactNative from 'react-native';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  ScrollView,
} = ReactNative;

import PlanList from './PlanList';
import Util from '../../Common/Util';
import UserCenter from './../../Views/User/UserCenter';
import * as net from './../../Network/Interface';

module.exports = React.createClass({
  getInitialState() {
    return {
      rangeList: [],
      serviceTime: '',
      loaded: false,
    };
  },
  /*
   * 首次渲染之前
   */
  componentWillReceiveProps () {
    // 方案数据
    this.fetchRangeData();
    // 获取服务器时间
    this.fetchServiceTime();
  },
  //只调用一次，在render之后调用
  componentDidMount() {
    //猫头先转
    this.setState({
      loaded : false
    })
  },
  // 拉取方案区间数据
  fetchRangeData() {
    // 需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.planApi.plan, token,
        ({code, msg, result})=>{
          if (code === 1) {
            // console.log(result.limitPlans);
            // console.log(result.rangeList)
            // console.log(r.range_name + '->' + (r.rangeSaleLimit-r.rangeSaled));
            let ranges = [];
            let sTime = this.state.serviceTime;
            let nav = this.props.navigator;
            result.rangeList.map(function (r, key) {
              ranges.push({
                rangeId: r.range_id,
                rangeName: r.range_name,
                surplus: r.rangeSaleLimit-r.rangeSaled,
                render: function() {
                  return (
                    <PlanList plans={r.plans} limit={result.limitPlans} serviceTime={sTime} navigator={nav}/>
                  );
                },
              });
            });
            this.setState({
              rangeList: ranges,
              loaded: true,
            });
          }
          else if (code === 0) {
            Util.toast(msg);
          }
          else if (code === 3) {
            Util.toast(msg);
            // 清空用户登录信息
            Store.delete('user');
            Store.delete('token');
            this.props.navigator.push({
              component: UserCenter,
              navigationBarHidden: true,
            });
            // 退出后隐藏方案
            RCTDeviceEventEmitter.emit('showPlanSwitch');
          }
        });
      }
    });
  },
  // 获取服务器时间
  fetchServiceTime() {
    // 需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.planApi.time, token,
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              serviceTime: result
            });
          }
        });
      }
    });
  },
  getBlock: function(example: Example, i) {
    var {rangeId, rangeName, surplus, platform} = example;
    if (platform) {
      if (Platform.OS !== platform) {
        return null;
      }
    }
    var originalRender = React.render;
    var originalIOSRender = ReactNative.render;
    var renderedComponent;
    (React: Object).render =
    (ReactNative: Object).render =
      function(element, container) {
        renderedComponent = element;
      };
    var result = example.render(null);
    if (result) {
      renderedComponent = React.cloneElement(result, {
        navigator: this.props.navigator,
      });
    }
    (React: Object).render = originalRender;
    (ReactNative: Object).render = originalIOSRender;
    return (
      <View style={styles.container} key={i}>
        <View style={[styles.rangeNameTitle,styles.row]}>
          <View style={[styles.flex1,styles.row]}>
            <Image style={styles.rangeNameImg}
              source={require('image!方案详情-收益区')} />
            <Text style={styles.rangeNameText}>
              {rangeName}
            </Text>
          </View>
          <View style={styles.row}>
            <Image style={styles.rangeNameImg}
              source={require('image!方案详情-限购')} />
            <Text style={styles.rangeNameText}>
              {surplus>=0
                ?
                '限购剩余 ' + surplus + '元'
                :
                (
                  rangeId === '005'
                  ?
                  '个人限购区'
                  :
                  null
                )
              }
            </Text>
          </View>
        </View>
        <View>
          {renderedComponent}
        </View>
      </View>
    );
  },

  render: function() {
    var ContentWrapper;
    var wrapperProps = {};
    if (this.props.noScroll) {
      ContentWrapper = (View: ReactClass<any>);
    } else {
      ContentWrapper = (ScrollView: ReactClass<any>);
      wrapperProps.keyboardShouldPersistTaps = true;
      wrapperProps.keyboardDismissMode = 'interactive';
    }
    //先展示加载中的菊花
    if(!this.state.loaded){
      return(
        <Image style={styles.loading} source={require('image!loading')} />
      );
    };
    return (
      <ContentWrapper
        style={styles.wrapper}
        {...wrapperProps}>
          {this.state.rangeList.map(this.getBlock)}
      </ContentWrapper>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    margin: 2,
    marginVertical: 1,
    overflow: 'hidden',
  },
  rangeNameTitle: {
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 2.5,
    borderBottomColor: '#d6d7da',
    backgroundColor: '#f6f7f8',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rangeNameText: {
    fontSize: 15,
    fontWeight: '100',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 1,
    textShadowColor: '#FFE4B5',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  page: {
    backgroundColor: '#e9eaed',
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingTop: -2,
  },
  rangeName: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 10,
    marginBottom: 0,
    height: 45,
    padding: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 19,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  rangeNameImg: {
    width: 13,
    height: 15,
    marginRight:4,
  },
  flex1: {
    flex: 1,
  },
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
  },
});
