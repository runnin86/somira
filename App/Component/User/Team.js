'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Util from '../../Common/Util';

var {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableOpacity,
  ScrollView
} = React;

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import Button from 'react-native-button';
import * as net from './../../Network/Interface';

var Entity = React.createClass({
  render: function() {
    return (
      <View style={css.recordRow}>
        <View style={[css.recordCellFixed,{alignItems: 'flex-start',marginLeft:10,}]}>
          <View style={css.newRow}>
            <Image style={[{marginTop:-2},this.props.iconClass]}
              source={{uri: this.props.nameIcon}} />
            <Text style={[{marginLeft:6},this.props.fontClass]}>
              {this.props.name}
            </Text>
          </View>
        </View>
        <View style={[css.recordCellFixed,{alignItems: 'center',marginLeft:-10,}]}>
          <View style={css.newRow}>
            <Image style={{width:24,height:12,marginTop:-2,}}
              source={{uri: '人数icon'}} />
            <Text style={[{marginLeft:6},this.props.fontClass]}>
              {this.props.people}
            </Text>
          </View>
        </View>
        <View style={[css.recordCellFixed,{alignItems:'flex-end',marginRight:10,}]}>
          <View style={css.newRow}>
            <Image style={{width:18,height:19,marginTop:-2,}}
              source={{uri: '销量icon'}} />
            <Text style={[{marginLeft:6},this.props.fontClass]}>
              &yen; {this.props.money}
            </Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      attachInfo: '',
      certList: '',
      expertHistory: '',
      plan: '',
      summary: '',
      residualTime: '',
      disabledPayBtn: false,
      totalMultiple: 1,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  },
  componentDidMount(){
    // 获取方案
    // this.fetchPlan(this.props.planId);
  },
  fetchPlan(pid) {
    // 获取方案的明细,需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.planApi.detail, token, {
          pid: pid
        },
        ({code, msg, result})=>{
          // console.log(code);
          // console.log(msg);
          // console.log(result);
          if (code === 1) {
            // this.setState({
            //   dataSource: this.state.dataSource.cloneWithRows(result.expertHistory),
            //   attachInfo: result.attachInfo,
            //   certList: result.certList,
            //   plan: result.plan,
            //   summary: result.summaryList[0],
            //   residualTime: filterTime > 0 ? filterTime + '分钟' : '已截止',
            //   disabledPayBtn: filterTime < 0 ? true : false,
            //   price: result.plan.plan_amount,
            // });
          }
        });
      }
    });
  },
  render: function() {
    return (
      <View style={css.flex}>
        <Accordion
          sections={[{
            title: '一级用户',
            content: this.state.plan.plan_content
          }]}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          duration={400}
        />

        <Entity
          fontClass={{fontWeight:'100',fontSize:12}}
          iconClass={{width:27,height:21}}
          name="二级用户" nameIcon="二级用户"
          people='333' money='194829'/>

        <Entity
          fontClass={{fontWeight:'100',fontSize:12}}
          iconClass={{width:27,height:19}}
          name="三级用户" nameIcon="三级用户"
          people='999' money='4194829'/>
      </View>
    );
  },
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Entity
          fontClass={{fontWeight:'100',fontSize:12}}
          iconClass={{width:27,height:21}}
          name="一级用户" nameIcon="一级用户"
          people='3' money='322'/>
      </Animatable.View>
    );
  },
  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Entity
          fontClass={{fontWeight:'100',fontSize:10}}
          iconClass={{width:21,height:20,marginLeft:10,}}
          name="18493882918" nameIcon="用户icon"
          people='3' money='322'/>
        <Entity
          fontClass={{fontWeight:'100',fontSize:10}}
          iconClass={{width:21,height:20,marginLeft:10,}}
          name="18493882918" nameIcon="用户icon"
          people='3' money='322'/>
      </Animatable.View>
    );
  },
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
    marginTop: 64,
    backgroundColor: '#e7e7e7',
  },
  borderBottom: {
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  contentText: {
    fontSize: 12,
    fontWeight: '100',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 1,
    textShadowColor: '#FFE4B5',
  },
  active: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  recordRow : {
    flexDirection: 'row',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  newRow : {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
  },
  recordCell: {
    flex:1,
    height: 48,
    justifyContent : 'center'
  },
  recordCellFixed: {
    flex: 1,
    height: 48,
    justifyContent : 'center'
  },
  recordText: {
    fontSize: 12,
    fontWeight: '100',
    textAlign: 'center',
    margin: 10
  },
});
