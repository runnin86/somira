//商品列表
'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Util from './../../Common/Util';
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  ListView,
  Text,
  Image,
  View,
  Platform,
  TouchableOpacity,
  TextInput
} = React;

var API = 'http://ald.taobao.com/recommend.htm?appId=03507&areaId=330100&size=15&type=1';

module.exports = React.createClass({
    //object在组件被挂载之前调用。状态化的组件应该实现这个方法，返回初始的state数据。
    getInitialState() {
      return {
        dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        loaded: false,
        cateId: 0,
      };
    },
    //只调用一次，在render之后调用
    componentDidMount() {
      this.fetchData(this.props.cateId);
    },
    //render 之前调用
    //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
    componentWillReceiveProps(nextProps) {
      //猫头先转
      this.setState({
        loaded: false,
        cateId: nextProps.cateId,
      })
      //拉取数据
      this.fetchData(nextProps.cateId);
    },
    //拉取数据
    fetchData: function(cateId) {
      if (cateId === 0) {
        // 获取方案的购物车,需要token数据
        Store.get('token').then((token)=>{
          if (token) {
            Util.post(net.planApi.queryCart, token, {},
            ({code, msg, result})=>{
              // console.log(code);
              // console.log(msg);
              console.log(result);
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(code === 1?result:''),
                loaded: true
              });
            });
          }
        });
      }
      else if (cateId === 1){
        // 获取乐夺宝的购物车,需要token数据
        Store.get('token').then((token)=>{
          if (token) {
            Util.get(net.hpApi.redisCart, token,
            ({code, msg, info})=>{
              // console.log(code);
              // console.log(msg);
              // console.log(info);
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(code === 1?info:''),
                loaded: true
              });
            },
            (e)=>{
              console.error(e);
            });
          }
        });
      }
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
    //渲染每一行
    renderRow(item) {
      return (
        <TouchableOpacity onPress={this.props.onSelect.bind(this,item)}>
            {
              this.state.cateId === 0
              ?
              <View style={css.container}>
                <View style={{flexDirection : 'column'}}>
                  <Image style={[css.cartImg,{width: 42,height: 48,}]}
                    source={{uri: item.expertHead}} />
                  <Text style={{fontWeight : '100',fontSize : 10,alignSelf:'center',marginTop:-6,}}
                    numberOfLines={1}>
                    {item.expertName}
                  </Text>
                </View>
                <View style={css.flex1}>
                  <View style={css.cartRow}>
                    <Text style={{fontWeight: '100',fontSize: 10}}>
                      {item.planName}
                    </Text>
                    <Text style={{fontWeight: '100',fontSize: 10,flex:1,textAlign:'right',}}>
                      {item.addTime}
                    </Text>
                  </View>
                  <View style={css.cartRow}>
                    <TextInput
                      keyboardType ='numeric'
                      style={css.input}
                      value={item.amount+''}
                      onChangeText={(text) => this.setState({userId: text})}/>
                    <Text style={{fontWeight:'100',fontSize:10,marginLeft:10,marginTop:6,}}>
                      {item.planAmount}元
                    </Text>
      						</View>
                  <View style={[css.cartRow,{marginTop:4,}]}>
                    <View style={{flexDirection: 'row'}}>
                      <Image style={{width: 12,height: 12,marginRight:4,}}
                        source={require('image!方案详情-收益区')} />
                      <Text style={{fontWeight:'100',fontSize:10}}>
                        {item.rangeName}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row',right:-40,}}>
                      <Image style={{width: 9,height: 13,marginRight:4,}}
                        source={require('image!单价')} />
                      <Text style={css.whitePrice,{fontWeight:'100',fontSize:10,flex:1,textAlign:'right',}}>
                        {item.planAmount}元
                      </Text>
                    </View>
                  </View>
      					</View>
                <Image style={css.delBtn} source={require('image!删除')} />
      				</View>
              :
              <Image style={[css.cartImg,{width: 60,height: 60,}]}
                source={{uri: item.images.split(',')[0]}} />
            }
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
  flex1 : {
    flex : 1,
    // flexDirection : 'column'
  },
  listView : {
    // backgroundColor : '#ffffff'
  },
  container: {
    // flex : 1,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  cartRow : {
    flexDirection : 'row',
    // alignItems: 'center',
    marginLeft: 10,
    marginRight: 18,
    marginBottom : 4,
  },
  cartImg : {
    marginRight: 15,
    marginBottom: 10,
    left: 10
  },
  delBtn: {
    right: 10,
    marginTop: 14,
    height: 30,
    width: 30,
    borderWidth: 0.5,
    borderColor : '#778899',
    borderRadius : 15,
  },
  input:{
    height:25,
    width:100,
    // borderColor:'#3164ce',//#b0b0b0,#c40001
    borderColor:'b0b0b0',
    borderWidth:1,
    // color:'#fff',
    // flex:1,
    fontSize:14,
  },
});
