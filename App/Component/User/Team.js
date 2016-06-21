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
            {
              this.props.rightArrow
              ?
              <Image style={[css.iconSize]}
                source={require('image!arrow_right_grey')} />
              :
              null
            }
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
      oneLevelNum: 0,
      twoLevelNum: 0,
      threeLevelNum: 0,
      oneLevelUsers: [],
      oneLevelFlow: 0,
      twoLevelFlow: 0,
      threeLevelFlow: 0
    }
  },
  componentDidMount(){
    this.fetchData();
  },
  fetchData() {
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.userApi.team, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              oneLevelNum: result.oneLevelNum,
              twoLevelNum: result.twoLevelNum,
              threeLevelNum: result.threeLevelNum,
              oneLevelUsers: result.oneLevelUsers,
              oneLevelFlow: result.oneLevelFlow,
              twoLevelFlow: result.twoLevelFlow,
              threeLevelFlow: result.threeLevelFlow
            });
          }
          else {
            Util.toast(msg);
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
            title: '',
            content: ''
          }]}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          duration={400}
        />

        <Entity
          fontClass={{fontWeight:'100',fontSize:12}}
          iconClass={{width:27,height:21}}
          name="二级用户" nameIcon="二级用户"
          people={this.state.twoLevelNum > 0 ? this.state.twoLevelNum : 0}
          money={this.state.twoLevelFlow > 0 ? this.state.twoLevelFlow : 0}/>

        <Entity
          fontClass={{fontWeight:'100',fontSize:12}}
          iconClass={{width:27,height:19}}
          name="三级用户" nameIcon="三级用户"
          people={this.state.threeLevelNum > 0 ? this.state.threeLevelNum : 0}
          money={this.state.threeLevelFlow > 0 ? this.state.threeLevelFlow : 0}/>

        <View style={{alignItems:'center',justifyContent: 'center'}}>
          <Image style={css.warnning} source={require('image!团队温馨提示')}/>
        </View>
      </View>
    );
  },
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Entity
          rightArrow={true}
          fontClass={{fontWeight:'100',fontSize:12}}
          iconClass={{width:27,height:21}}
          name="一级用户" nameIcon="一级用户"
          people={this.state.oneLevelNum > 0 ? this.state.oneLevelNum : 0}
          money={this.state.oneLevelFlow > 0 ? this.state.oneLevelFlow : 0}/>
      </Animatable.View>
    );
  },
  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[isActive ? css.active : css.inactive]} transition="backgroundColor">
        {
          this.state.oneLevelUsers.map((u,k)=>{
            return(
              <Entity key={k}
                fontClass={{fontWeight:'100',fontSize:10}}
                iconClass={{width:21,height:20,marginLeft:10,}}
                name={u.user_phone} nameIcon="用户icon"
                people={u.oneLevelNum > 0 ? u.oneLevelNum : 0}
                money={u.oneLevelFlow > 0 ? u.oneLevelFlow : 0}/>
            )
          })
        }
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
  warnning: {
    width: Util.size['width']-20,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  iconSize: {
    marginRight: -10,
    height:20,
    width:20,
    resizeMode: Image.resizeMode.contain,
  },
});
