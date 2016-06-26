'use strict';

import React from 'react';
import Store from 'react-native-simple-store';
import Util from '../../../Common/Util';
import * as net from '../../../Network/Interface';

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
    };
  },
  componentDidMount: function() {
    this._getRecordList();
  },
  _getRecordList:function(){
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.userApi.myrecharge, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(result.length > 0?result:''),
              loaded: true,
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
          <Text style={{fontWeight : '100',fontSize : 12}}>
            {rowData.recharge_date}
            <Text style={[{fontWeight : '100',fontSize : 10},rowData.recharge_flag==='0'?styles.red:'']}>
              ({rowData.recharge_flag==='0'?'失败':'成功'})
            </Text>
          </Text>
        </View>
        <View style={[styles.recordCellFixed,{alignItems:'flex-end'}]}>
          <Text style={styles.recordText}>
            {rowData.recharge_money}
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
               您还没有充值记录
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
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
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
    fontSize: 12,
    fontWeight: '100',
    textAlign: 'center',
    margin: 10
  },
  red: {
    color: 'red',
  }
});
