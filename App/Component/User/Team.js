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

        <View style={css.recordRow}>
          <View style={[css.recordCellFixed,{alignItems: 'flex-start',marginLeft:10,}]}>
            <Text style={{fontWeight : '100',fontSize : 12}}>
              二级用户
            </Text>
          </View>
          <View style={[css.recordCellFixed,{alignItems: 'center',marginLeft:10,}]}>
            <Text style={{fontWeight : '100',fontSize : 12}}>
              43434
            </Text>
          </View>
          <View style={[css.recordCellFixed,{alignItems:'flex-end'}]}>
            <Text style={css.recordText}>
              32323233
            </Text>
          </View>
  			</View>

        <View style={css.recordRow}>
          <View style={[css.recordCellFixed,{alignItems: 'flex-start',marginLeft:10,}]}>
            <View style={css.newRow}>
              <Image style={{width:27,height:19,marginTop:-2,}}
                source={{uri: '三级用户'}} />
              <Text style={{fontWeight : '100',fontSize : 12,marginLeft:6,}}>
                三级用户
              </Text>
            </View>
          </View>
          <View style={[css.recordCellFixed,{alignItems: 'center',marginLeft:-10,}]}>
            <View style={css.newRow}>
              <Image style={{width:24,height:12,marginTop:-2,}}
                source={{uri: '人数icon'}} />
              <Text style={{fontWeight : '100',fontSize : 12,marginLeft:6,}}>
                999
              </Text>
            </View>
          </View>
          <View style={[css.recordCellFixed,{alignItems:'flex-end',marginRight:10,}]}>
            <View style={css.newRow}>
              <Image style={{width:18,height:19,marginTop:-2,}}
                source={{uri: '销量icon'}} />
              <Text style={{fontWeight : '100',fontSize : 12,marginLeft:6,}}>
                &yen; 4332323
              </Text>
            </View>
          </View>
  			</View>
      </View>
    );
  },
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[css.lv1,css.borderBottom, isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Text style={{fontWeight:'100',fontSize:12,marginTop:6,marginBottom:10,}}>
          {section.title}
        </Text>
      </Animatable.View>
    );
  },
  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[css.content,css.borderBottom,isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Animatable.Text key={i} style={css.contentText}
          animation={isActive ? 'bounceIn' : undefined}>
          {section.content}
        </Animatable.Text>
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
  lv1: {
    paddingTop: 10,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
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
  content: {
    flex: 1,
    padding: 12,
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
