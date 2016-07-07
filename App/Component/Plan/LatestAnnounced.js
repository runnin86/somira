import React from 'react-native';
import Store from 'react-native-simple-store';

import Util from '../../Common/Util';
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} = React;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      userRank: '',
      num: 0,
    }
  },
  componentDidMount(){
    //拉取参与记录
    this.fetchData();
  },
  fetchData() {
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.planApi.rankweek, token,
        ({code, msg, result})=>{
          if (code === 1) {
            let uid = result.userRank[0].bs_userId;
            let uNum = 0;
            // 计算用户是否上榜
            result.rankList.map((v, k)=>{
              if (uid === v.userId) {
                uNum = v.pNum;
                return;
              }
            });
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(result.rankList),
              userRank: result.userRank[0],
              userNum: uNum,
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  _renderRecordRow: function(row) {
    this.state.num++;
    let color = '#95CACA';
    switch (this.state.num)
    {
      case 1:
        color = 'red'
        break
      case 2:
        color = 'blue'
        break
      case 3:
        color = 'purple'
        break
      default:
        break
    };
    return(
      <View style={css.recordRow}>
        <View style={{marginBottom:10,alignSelf: 'center',marginLeft:10,marginTop:6,}}>
          <Image style={css.userImg} source={require('image!默认头像')} />
        </View>
        <View style={[css.rowCenter,{marginLeft:10}]}>
          <Text style={{fontSize:13,fontWeight:'500',marginBottom:4,}}>{row.nickName}</Text>
          <Text style={{fontSize:12,fontWeight:'100'}}>方案数: {row.pNum}</Text>
        </View>
        <View style={[css.rowCenter,{marginLeft:-10}]}>
          <Text style={{fontSize:12,fontWeight:'100'}}>收益:{row.winBonus}</Text>
        </View>
        <View style={[css.rowCenter,{right:-60}]}>
          <View style={[css.rankColor,{backgroundColor:color,borderColor:color}]}>
            <Text style={css.rankNum}>
              {this.state.num}
            </Text>
          </View>
        </View>
      </View>
    );
  },
  /*
   * 渲染(JSX,通过state控制DOM结构变化)
   */
  render: function() {
    return (
      <View style={[css.flex,{backgroundColor:'#eeeeee',}]}>
        {
          this.state.dataSource.getRowCount() ===0
          ?
          <View style={{alignItems:'center',marginTop:100,}}>
            <Image style={{width: 120,resizeMode:Image.resizeMode.contain,}}
              source={require('image!温馨提示')}/>
            <Text style={{height:20,fontSize: 13, color: 'gray'}}>
              暂时没有排行信息
            </Text>
            <Text style={{height:20,fontSize: 10, color: 'gray'}}>
              本排行榜为周排行,每周一凌晨更新上周的排名信息
            </Text>
          </View>
          :
          null
        }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRecordRow}
          style={{marginBottom:-40}}/>
        <View style={[css.bottomArea]}>
          <View style={css.flex}>
            <Text style={[css.bottomText,{color: '#000000'}]}>
              您上周的盈利金额为{this.state.userRank.winBonus>0?this.state.userRank.winBonus:'0'}
              {this.state.userNum>0?' 排行 '+this.state.userNum:' 未上榜'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
  borderTop: {
    borderTopColor : '#C0C0C0',
    borderTopWidth : 1,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomColor : '#C0C0C0',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  recordRow : {
    flexDirection: 'row',
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  userImg: {
    width: 48,
    height: 48,
    borderRadius: 18,
    // marginLeft:10
  },
  rowCenter: {
    flex:1,
    alignSelf:'center',
    justifyContent:'center',
  },
  bottomText: {
    alignSelf:'center',
    height:36,
    lineHeight: 32,
  },
  bottomArea: {
    flexDirection: 'row',
    marginTop:-2,
    height:48,
    overflow:'hidden',
    backgroundColor: '#FFFFF0',
  },
  rankColor: {
    width:22,
    borderWidth:1,
    borderRadius:11,
  },
  rankNum: {
    fontSize:12,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center',
    marginRight:2,
    marginLeft:2,
  }
});
