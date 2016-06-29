'use strict';

import React from 'react';
import Store from 'react-native-simple-store';
import Util from './../../Common/Util';
import * as net from './../../Network/Interface';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image
} from 'react-native';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2}),
      pageNum: 1,
      listData: [],
      loaded: false,
    };
  },
  componentDidMount: function() {
    this._getMessageList();
  },
  _getMessageList:function(){
    Store.get('token').then((token)=>{
      if (token && this.state.pageNum > -1) {
        let param = '?pagenum=' + this.state.pageNum + '&pagesize=' + 10;
        Util.get(net.userApi.userMessage + param, token,
        ({code, msg, result})=>{
          if (code === 1) {
            // 数据填充
            if (result.msglist.length>0) {
              result.msglist.map((v,k) => {
                this.state.listData.push(v);
              });
            }
            this.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(this.state.listData),
              pageNum: result.msglist.length === 0 ? -1 : this.state.pageNum,
            });
          }
          else {
            Util.toast(msg);
          }
        },
        (e)=>{
          console.error(e);
        });
      }
    });
  },
  _renderListItem:function(item){
    // {''+item.msg_title+'|'+item.msg_isread+'|'+item.msg_type+'|'+item.msgCreateTime}
    let co = item.msg_type==='通知公告' ? 'red' : '#9ACD32';
    return (
      <View>
        <View style={[styles.cell,styles.msgRow]}>
          <Image style={{width:6,height:6,alignSelf:'center',justifyContent:'center',marginRight:2}}
            source={{uri: item.msg_isread===1?'banner分页符红':'banner分页符白'}}/>
          <View style={[styles.typeColor,{backgroundColor:co,borderColor:co}]}>
            <Text style={styles.typeText}>
              {item.msg_type}
            </Text>
          </View>
          <Text style={{fontSize: 12,fontWeight: '100',flex:1,margin:4}} numberOfLines={2}>
            {item.msg_title}
          </Text>
          <Text style={{fontSize: 10,fontWeight: '100',margin:4}} numberOfLines={1}>
            {item.msgCreateTime}
          </Text>
        </View>
      </View>
    );
  },
  render() {
    return (
     <View style={styles.container}>
       {
         !this.state.loaded
         ?
         Util.loading
         :
         (
           this.state.dataSource.getRowCount() === 0
           ?
           <View style={{marginTop:80,alignItems:'center',justifyContent: 'center'}}>
             <Image style={styles.warnning} source={require('image!温馨提示')}/>
             <Text style={{height:20,fontSize: 10,fontWeight:'100', color: '#A9A9A9'}}>
               暂时没有消息
             </Text>
           </View>
           :
           <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderListItem}/>
         )
       }
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    marginTop:66,
    marginBottom: 20,
  },
  warnning: {
    width: 100,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  listView : {
    backgroundColor : '#eeeeee'
  },
  cell: {
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 4,
    borderBottomColor : '#C0C0C0',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  msgRow : {
  	flexDirection : 'row',
    justifyContent: 'space-between'
  },
  shadom: {
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    textShadowColor: '#FFD700',
  },
  typeColor: {
    width:68,
    borderWidth:1,
    borderRadius:20,
  },
  typeText: {
    fontSize:12,
    fontWeight:'400',
    color:'#ffffff',
    textAlign:'center',
    margin:4,
  },
});