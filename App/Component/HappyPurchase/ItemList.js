//商品列表
'use strict';

import React from 'react-native';
import Button from 'react-native-button';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as Animatable from 'react-native-animatable';

import Util from './../../Common/Util';
import Progress from '../../Common/Progress';
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  ListView,
  Text,
  Image,
  View,
  TouchableOpacity,
} = React;

module.exports = React.createClass({
  //object在组件被挂载之前调用。状态化的组件应该实现这个方法，返回初始的state数据。
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      loaded: false
    };
  },
  //只调用一次，在render之后调用
  componentDidMount() {
    this.fetchData(0);
  },
  //render 之前调用
  //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
  componentWillReceiveProps(nextProps) {
    //猫头先转
    this.setState({
      loaded : this.props.cateId!==nextProps.cateId?false:true
    })
    //拉取数据
    this.fetchData(nextProps.cateId);
  },
  //拉取数据
  fetchData: function(cateId) {
    let API = net.hpApi.home + (cateId> 0 ? '?price=' + cateId : '');
    Util.get(API, '',
    ({code, msg, results})=>{
      if (code === 1) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(results.list),
          loaded: true
        });
      }
    });
  },
  //渲染列表
  renderListView : function(){
    //先展示加载中的菊花
    if(!this.state.loaded){
      return(
        <Image style={css.loading} source={require('image!loading')} />
      );
    };
    return(
      <ListView contentInset={{top: 0}}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        style={css.listView}/>
    );
  },
  _animatables: {},
  _pushCart: function(event, item){
    // 乐夺宝添加至购物车,需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.hpApi.redisCart, token, {
          'projectId': item.id,
          'number': item.number,
          'amount': item.price < 10 ? 10 : item.price
        },
        ({code, msg})=>{
          if (code === 1) {
            Util.toast('已加入购物车');
            this._animatables[item.id]['slideInLeft'](1000);
            // 设置购物车图标
            RCTDeviceEventEmitter.emit('loadCartCount');
          }
          else {
            Util.toast(msg);
            console.error('加入购物车失败:' + msg);
          }
        });
      }
      else {
        Util.toast('您尚未登录!');
      }
    });
  },
  //渲染每一行
  renderRow(item) {
    let progressNum = (parseFloat(item.totalCount) - parseFloat(item.codeCount)) / parseFloat(item.totalCount);
    let img = item.images.split(',')[0];
    return (
      <TouchableOpacity onPress={this.props.onSelect.bind(this,item)}>
        <View style={css.container}>
          <Animatable.Image ref={component => this._animatables[item.id] = component} style={css.goodImg} source={{uri : img}} />
          <View style={css.goodInfo}>
            <Text style={css.goodTit,{fontSize : 15}} numberOfLines={2}>{item.name}</Text>
            <Text style={css.goodTit,{fontWeight : '100',fontSize : 13,marginTop : 4}} numberOfLines={1}>{item.content}</Text>
            {/*
            <View style={css.goodRow}>
              <Text style={css.redPrice}><Text style={css.yen}>&yen;</Text> {item.orderprice || item.codeCount}</Text>
              <Text style={css.whitePrice}>&yen;{item.totalCount}</Text>
            </View>
            */}
            <View style={css.progress}>
              <Progress progress={progressNum}/>
            </View>
            <View style={css.goodRow}>
              <View>
                <Text style={css.redPrice}>
                  {item.totalCount}
                </Text>
                <Text style={css.goodTit,{fontWeight:'100',fontSize:10}}>总需</Text>
              </View>
              <View>
                <Text style={css.whitePrice}>
                  {item.codeCount}
                </Text>
                <Text style={css.goodTit,{fontWeight:'100',fontSize:10}}>剩余</Text>
              </View>
              <View style={css.goodBtnWarp}>
                <Button onPress={()=>this._pushCart(this,item)}>
                  <Image style={css.goodBtnImg} source={{uri: 'icon_addcar_big_black'}}/>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
	render() {
		return (
      this.renderListView()
    );
	}
});

// 组件样式
var css = StyleSheet.create({
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
  },
  listView : {
    // backgroundColor : '#ffffff'
  },
  container: {
    flex : 1,
    paddingTop: 10,
    paddingBottom: 2,
    flexDirection: 'row',
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  //左侧商品图
  goodImg : {
    width : 60,
    height : 60,
    marginRight: 15,
    left: 10
  },
  //右侧商品信息
  goodInfo : {
    flex : 1,
    flexDirection : 'column'
  },
  goodTit : {
    // height : 16,
    color : '#000000',
    textAlign: 'left',
    // marginRight: 2,
  },
  // 价格
  goodRow : {
    flexDirection : 'row',
    alignItems: 'center',
    marginBottom : 10
  },
  redPrice : {
    color : '#c40001',
    width: (Util.size['width']-70)/2
  },
  whitePrice : {
    fontSize : 12,
    color : '#b0b0b0'
  },
  // 购买及按钮
  goodExtra : {
    flexDirection :'row',
    alignItems: 'center',
    justifyContent : 'space-between'
  },
  goodSold : {
    color : '#b0b0b0'
  },
  goodBtnWarp : {
    position : 'absolute',
    right : 20,
    top : -4
  },
  goodBtnImg: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  progress: {
    width: (Util.size['width']-158),
    marginTop: 5,
    marginBottom: 5
  }
});
