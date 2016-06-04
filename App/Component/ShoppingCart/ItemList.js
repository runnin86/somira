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
              // console.log(result);
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
              <View style={[css.row,css.container]}>
                <View style={css.column}>
                  <Image style={[css.left10,css.bottom10,css.right4,{width: 42,height: 48,}]}
                    source={{uri: item.expertHead}} />
                  <Text style={[css.fontWeight,css.fontSize10,{alignSelf:'center',marginTop:-6,}]}
                    numberOfLines={1}>
                    {item.expertName}
                  </Text>
                </View>
                <View style={css.flex1}>
                  <View style={[css.row,css.left10,css.right15,css.bottom4]}>
                    <Text style={[css.fontWeight,css.fontSize10]}>
                      {item.planName}
                    </Text>
                    <Text style={[css.fontWeight,css.fontSize10,css.flex1,css.textRight]}>
                      {item.addTime}
                    </Text>
                  </View>
                  <View style={[css.row,css.left10,css.right15,css.bottom4]}>
                    <TextInput
                      keyboardType ='numeric'
                      style={css.input}
                      value={item.amount+''}
                      onChangeText={(text) => this.setState({userId: text})}/>
                    <Text style={[css.fontWeight,css.fontSize10,css.left10,css.top4]}>
                      {item.planAmount}元
                    </Text>
      						</View>
                  <View style={[css.row,css.left10,css.right15,css.bottom4,css.top4]}>
                    <View style={css.row}>
                      <Image style={[css.right4,{width: 12,height: 12}]}
                        source={require('image!方案详情-收益区')} />
                      <Text style={[css.fontWeight,css.fontSize10]}>
                        {item.rangeName}
                      </Text>
                    </View>
                    <View style={[css.row,{right:-40,}]}>
                      <Image style={[css.right4,{width: 9,height: 13,}]}
                        source={require('image!单价')} />
                      <Text style={[css.fontWeight,css.fontSize10,css.flex1]}>
                        {item.planAmount}元
                      </Text>
                    </View>
                  </View>
      					</View>
                <Image style={css.delBtn} source={require('image!删除')} />
      				</View>
              :
              <View style={[css.row,css.container]}>
                <Image style={[css.bottom10,css.right4,{width: 60,height: 60,}]}
                  source={{uri: item.images?item.images.split(',')[0]:''}} />
                <View style={css.flex1}>
                  <Text style={[css.fontWeight,{fontSize: 11}]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[css.fontWeight,{fontSize: 8}]} numberOfLines={1}>
                    {item.content}
                  </Text>
                  <TextInput
                    keyboardType ='numeric'
                    style={[css.input,css.row,css.top4]}
                    value={item.amount+''}
                    onChangeText={(text) => this.setState({userId: text})}/>
                  <View style={[css.row,css.top4]}>
                    <Text style={[css.fontWeight,css.fontSize10]}>
                      需:
                      <Text style={css.red}>
                        {item.amount}
                      </Text>
                      元
                    </Text>
                    <Text style={[css.fontWeight,css.fontSize10,css.flex1,css.textCenter]}>
                      总价:{item.totalCount}元
                    </Text>
                  </View>
                </View>
                <Image style={css.delBtn} source={require('image!删除')} />
              </View>
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
  },
  listView : {
    backgroundColor : '#eeeeee'
  },
  container: {
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
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
    fontSize:14,
  },
  fontWeight: {
    fontWeight: '100'
  },
  fontSize10: {
    fontSize: 10
  },
  textRight: {
    textAlign:'right'
  },
  textCenter: {
    textAlign:'center'
  },
  red: {
    color: 'red'
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  left10: {
    marginLeft: 10
  },
  right15: {
    marginRight: 15
  },
  right4: {
    marginRight: 4
  },
  bottom4: {
    marginBottom: 4
  },
  bottom10: {
    marginBottom: 10
  },
  top4: {
    marginTop:4
  }
});
