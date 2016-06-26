'use strict';

import React from 'react';
import Store from 'react-native-simple-store';
import Button from 'react-native-button';
import Util from '../../Common/Util';
import * as net from '../../Network/Interface';

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
      loaded: false,
      withDrawLength: 0,
      withDrawMoney: 0,
    };
  },
  componentDidMount: function() {
    this._getRecordList();
  },
  _getRecordList:function(){
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.userApi.commission, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            let tempLength = 0;
            let tempMoney = 0;
            result.map((v, k)=>{
              if (v.status === 0) {
                // 0可提,1已提
                tempLength += 1;
                tempMoney += v.total_fee;
              }
            });
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(result.length > 0?result:''),
              loaded: true,
              withDrawLength: tempLength,
              withDrawMoney: tempMoney
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  _renderListItem:function(rowData){
    // console.log(rowData);
    return (
      <View style={styles.recordRow}>
        <View style={[styles.recordCellFixed,{alignItems: 'flex-start',marginLeft:10,}]}>
          <Text style={[{fontWeight : '100',fontSize : 12},rowData.status===0?styles.red:styles.gray]}>
            {rowData.from_user_phone}
            <Text style={{fontWeight : '100',fontSize : 10}}>
              ({rowData.status===0?'可提现':(rowData.status===1?'已提现':'')})
            </Text>
          </Text>
          <Text style={[{fontWeight : '100',fontSize : 10},rowData.status===0?styles.red:styles.gray]}>
            用户所属:{rowData.oneLevelPhone === ''?'':'上级' + rowData.oneLevelPhone}
            {rowData.oneLevelPhone === ''?'直属上级':''}
          </Text>
        </View>
        <View style={[styles.recordCellFixed,{alignItems:'flex-end'}]}>
          <Text style={[styles.recordText,rowData.status===0?styles.red:styles.gray]}>
            {rowData.total_fee}
          </Text>
        </View>
			</View>
    );
  },
  doWithDraw() {
    console.log('进行提现。。。');
  },
  render() {
    return (
     <View style={styles.container}>
       {
         !this.state.loaded
         ?
         Util.loading
         :
         null
       }
       {
         this.state.dataSource.getRowCount() === 0
         ?
         <View style={{marginTop:80,alignItems:'center',justifyContent: 'center'}}>
           <Image style={styles.warnning} source={require('image!温馨提示')}/>
           <Text style={{height:20,fontSize: 10,fontWeight:'100', color: '#A9A9A9'}}>
             您还没有返佣
           </Text>
         </View>
         :
         null
       }
       <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderListItem}/>
      {
        this.state.withDrawLength>0
        ?
        <View style={[styles.bottomArea]}>
          <View style={styles.flex1}>
            <Text style={[styles.bottomText,
              this.state.cateId === 0
              ?
              {color: 'red'}
              :
              {color: '#000000'}
            ]}>
              共 {this.state.withDrawLength} 条可提现,
              总额 {this.state.withDrawMoney}
            </Text>
          </View>
          <View style={[styles.flex1],{width:68}}>
            <Button onPress={this.doWithDraw}
              style={[styles.bottomBtn,{backgroundColor: '#4cd964'}]}>
              提现
            </Button>
          </View>
        </View>
        :
        null
      }
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    marginBottom: -20,
  },
  warnning: {
    width: 100,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  recordRow : {
    flexDirection: 'row',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  recordCell: {
    flex:1,
    height: 46,
    justifyContent : 'center'
  },
  recordCellFixed: {
    flex: 1,
    height: 46,
    justifyContent : 'center'
  },
  recordText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    margin: 10
  },
  red: {
    color: '#FF4500',
  },
  gray: {
    color: '#DCDCDC',
  },
  priceBtn: {
    height:38,
    width:38,
  },
  bottomArea: {
    flexDirection: 'row',
    marginTop:-16,
    marginBottom:20,
    height:48,
    overflow:'hidden',
    backgroundColor: '#FFFFF0',
  },
  bottomText: {
    alignSelf:'flex-start',
    height:36,
    lineHeight: 32,
    marginLeft: 10,
  },
  bottomBtn: {
    color: '#FFFFFF',
    alignSelf:'flex-end',
    margin:4,
    marginRight:10,
    width: 68,
    height:42,
    lineHeight: 32,
    overflow:'hidden',
    borderWidth : 1,
    borderRadius:10,
    borderColor: '#FFFFFF',
  },
  flex1 : {
    flex : 1,
  },
});
