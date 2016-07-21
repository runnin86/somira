'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Util from '../../Common/Util';

var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ListView,
  TouchableOpacity,
  ScrollView
} = React;

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import ActionSheet from 'react-native-action-sheet';
import Button from 'react-native-button';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as net from './../../Network/Interface';

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      showCartBtn: false,
      showReward: false,
      rewardMoney: 8.8,
      attachInfo: '',
      certList: '',
      expertHistory: '',
      plan: '',
      summary: '',
      serviceTime: '',
      residualTime: '',
      disabledPayBtn: false,
      totalMultiple: 1,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  },
  componentDidMount(){
    // 获取方案
    this.fetchPlan(this.props.planId);
    // 获取服务器时间
    this.fetchServiceTime();
    //拉取参与记录
    // this.fetchParticipation(this.props.plan.id, this.props.plan.number, 0);
    this.listener = RCTDeviceEventEmitter.addListener('rewardPlan', (pid)=>{
      if (!this.state.showReward) {
        this.setState({
          showCartBtn: false,
          showReward: true,
        });
      }
    });
  },
  componentWillUnmount: function() {
    this.listener.remove();
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
            let filterTime = Util.getDateDiff(this.state.serviceTime, result.plan.deallineTime, 'minute');
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(result.expertHistory),
              attachInfo: result.attachInfo,
              certList: result.certList,
              plan: result.plan,
              summary: result.summaryList[0],
              residualTime: filterTime > 0 ? filterTime + '分钟' : '已截止',
              disabledPayBtn: filterTime < 0 ? true : false,
              price: result.plan.plan_amount,
            });
          }
        });
      }
    });
  },
  // 获取服务器时间
  fetchServiceTime() {
    // 需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.planApi.time, token,
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              serviceTime: result
            });
          }
        });
      }
    });
  },
  render: function() {
    return (
      <View style={css.flex}>
        <ScrollView style={{marginBottom:0}}>
          <Image style={css.container} source={{uri: '头像背景'}}>
            <View style={css.goodRow}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:'100',fontSize:14,backgroundColor:'rgba(0,152,50,0)'}}>
                  信心指数
                </Text>
                <View style={{flexDirection:'row',marginLeft:2,marginTop:1,}}>
                  <Image style={{width:16,height:12,}}
                    source={{uri: '720信心'}} />
                  <Image style={{width:15,height:12}}
                    source={{uri: '720信心'}} />
                  <Image style={{width:15,height:12}}
                    source={{uri: '720信心'}} />
                  <Image style={{width:15,height:12}}
                    source={{uri: this.state.plan.planConfident>=4?'720信心':''}} />
                  <Image style={{width:15,height:12}}
                    source={{uri: this.state.plan.planConfident>=5?'720信心':''}} />
                </View>
              </View>
              <View>
                <Text style={{fontWeight:'100',fontSize:14,backgroundColor:'rgba(0,152,50,0)'}}>
                  剩余购买时间:{this.state.residualTime}
                </Text>
              </View>
            </View>
            <View style={[css.goodRow,{alignSelf:'center',}]}>
              <Image style={{width:64,height:72}} source={{uri: this.state.plan.expert_photo}} />
            </View>
            <View style={[css.goodRow,{alignSelf:'center',marginTop:8,marginBottom:8,backgroundColor:'rgba(0,152,50,0)'}]}>
              <Text style={{fontWeight:'100',fontSize:16}}>
                {this.state.plan.expert_name}
              </Text>
              <Text style={{fontWeight:'100',fontSize:12}}>
                [{this.state.plan.plan_name}]
              </Text>
            </View>
            <View style={css.goodRow}>
              <View>
                <Text style={{fontWeight:'100',fontSize:14,backgroundColor:'rgba(0,152,50,0)'}}>
                  方案数:{this.state.summary.planTotalNum}
                </Text>
              </View>
              <View>
                <Text style={{fontWeight:'100',fontSize:14,backgroundColor:'rgba(0,152,50,0)'}}>
                  胜率:{parseInt(this.state.summary.winrate*100, 0)}%
                </Text>
              </View>
            </View>
          </Image>
          <Accordion
            sections={[{
              title: '方案内容',
              content: this.state.plan.plan_content
            }]}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            duration={400}
          />
          <Accordion
            sections={[{
              title: '专家简介',
              content: this.state.attachInfo.expertIntro
            }]}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            duration={400}
          />
          <View style={{height:4,backgroundColor:'#eee'}}>
            <Text>
            </Text>
          </View>
          <View style={[{paddingTop:10,},css.borderTop]}>
            <Text style={{fontWeight:'100',fontSize:16,paddingLeft:10}}>
              专家战绩
            </Text>
            <View style={[{paddingTop:6,paddingBottom:6,width:Util.size['width']},css.borderBottom]}></View>
            {/*
              专家战绩
            */}
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRecordRow}/>
          </View>
        </ScrollView>
        <Button onPress={this.onOpen}
          style={[css.cartBtn,
            this.state.disabledPayBtn
            ?
            {backgroundColor: '#c8c9cb',}
            :
            {backgroundColor: 'lightgreen',}
          ]}>
          购买方案
        </Button>
        <ActionSheet
            visible={this.state.showCartBtn}
            onSubmit={this.onPay}
            onCancel={this.onCancel}
            cancelText={'确认'}
            buttonStyle={{marginTop:6, borderRadius:6,height:Util.size['height']*0.078,backgroundColor:'#f6383a'}}
            textStyle={{color:'#FFFFFF'}}>
            <ActionSheet.Button
              buttonStyle={{borderBottomWidth:1,borderColor: '#D3D3D3',}}>
              <Text style={{color: '#5f646e',fontSize:14}}>
                请选择倍数
              </Text>
            </ActionSheet.Button>
            <View style={css.priceRow}>
              <Text onPress={()=>this.setState({totalMultiple:5})}
                style={{color: this.state.totalMultiple===5?'#f6383a':'#0894ec',fontSize:14,marginLeft:16,}}>
                5
              </Text>
              <Text onPress={()=>this.setState({totalMultiple:10})}
                style={{color: this.state.totalMultiple===10?'#f6383a':'#0894ec',fontSize:14}}>
                10
              </Text>
              <Text onPress={()=>this.setState({totalMultiple:20})}
                style={{color: this.state.totalMultiple===20?'#f6383a':'#0894ec',fontSize:14}}>
                20
              </Text>
              <Text onPress={()=>this.setState({totalMultiple:50})}
                style={{color: this.state.totalMultiple===50?'#f6383a':'#0894ec',fontSize:14}}>
                50
              </Text>
              <Text onPress={()=>this.setState({totalMultiple:100})}
                style={{color: this.state.totalMultiple===100?'#f6383a':'#0894ec',fontSize:14,marginRight:16,}}>
                100
              </Text>
            </View>
            <View style={css.priceRow}>
              <Image
                onTouchStart={()=>{
                  if (this.state.totalMultiple > 1) {
                    this.setState({totalMultiple:this.state.totalMultiple-1})
                  }
                  else {
                    this.setState({totalMultiple:1})
                  }
                  this.timer = setTimeout(()=>{
                    this.interval = setInterval(()=>{
                      if (this.state.totalMultiple > 1) {
                        this.setState({totalMultiple:this.state.totalMultiple-1})
                      }
                      else {
                        this.setState({totalMultiple:1})
                      }
                    },500);
                  },1000);
                }}
                onTouchEnd={()=>{
                  this.interval && clearInterval(this.interval);
                  this.timer && clearTimeout(this.timer);
                }}
                style={[css.mathBtn,{marginLeft:Util.size['width']*0.05}]}
                source={require("image!ic_goods_reduce")}/>
              <TextInput
                 style={css.textInput}
                 autoCapitalize = 'none'
                 editable={false}
                 keyboardType='numeric'
                 selectionColor={'red'}
                 ref='textInput'
                 maxLength={4}
                 onChangeText={(totalMultiple) => this.setState({totalMultiple})}
                 onFocus={() => {this.refs.textInput.focus()}}
                 defaultValue={this.state.totalMultiple+''}
                 value={this.state.totalMultiple+''}
               />
              <Image
                onTouchStart={()=>{
                  this.setState({totalMultiple:this.state.totalMultiple+1})
                  this.timer = setTimeout(()=>{
                    this.interval = setInterval(()=>{
                      this.setState({totalMultiple:this.state.totalMultiple+1})
                    },500);
                  },1000);
                }}
                onTouchEnd={()=>{
                  this.interval && clearInterval(this.interval);
                  this.timer && clearTimeout(this.timer);
                }}
                style={[css.mathBtn,{marginRight:Util.size['width']*0.05}]}
                source={require("image!ic_goods_add")}/>
            </View>
            <ActionSheet.Button>
              <Text style={{color: '#5f646e',fontSize:14}}>
                需
                <Text style={{color: '#f6383a'}}>
                  {' ' + this.state.totalMultiple*this.state.plan.plan_amount + ' '}
                </Text>
                元
              </Text>
            </ActionSheet.Button>
        </ActionSheet>
        <ActionSheet
            visible={this.state.showReward}
            onSubmit={this.onReward}
            onCancel={this.onCancel}
            cancelText={'打赏'}
            buttonStyle={{
              marginTop:6,
              borderRadius:6,
              height:Util.size['height']*0.068,
              backgroundColor:'#f5d996'
            }}
            textStyle={{color:'#f6383a'}}>
            <Image style={[css.rewardBackImg]} source={{uri: '打赏背景'}}>
              <View style={{top:36}}>
                <View style={css.rewardRow}>
                  <Image style={[css.rewardSelectImg,{marginLeft:6}]}
                    source={{uri: this.state.rewardMoney===8.8?'打赏固定数额选中':''}}>
                    <Text onPress={()=>this.setState({rewardMoney:8.8})}
                      style={{
                        color: this.state.rewardMoney===8.8?'#f6383a':'rgb(245, 217, 150)',
                        fontSize:14,
                        textAlign:'center'
                      }}>
                      8.8
                    </Text>
                  </Image>
                  <Image style={css.rewardSelectImg}
                    source={{uri: this.state.rewardMoney===18.8?'打赏固定数额选中':''}}>
                    <Text onPress={()=>this.setState({rewardMoney:18.8})}
                      style={{
                        color: this.state.rewardMoney===18.8?'#f6383a':'rgb(245, 217, 150)',
                        fontSize:14,
                        textAlign:'center'
                      }}>
                      18.8
                    </Text>
                  </Image>
                  <Image style={[css.rewardSelectImg,{marginRight:6}]}
                    source={{uri: this.state.rewardMoney===88.8?'打赏固定数额选中':''}}>
                    <Text onPress={()=>this.setState({rewardMoney:88.8})}
                      style={{
                        color: this.state.rewardMoney===88.8?'#f6383a':'rgb(245, 217, 150)',
                        fontSize:14,
                        textAlign:'center'
                      }}>
                      88.8
                    </Text>
                  </Image>
                </View>
                <View style={css.rewardRow}>
                  <Image
                    onTouchStart={()=>{
                      if (this.state.rewardMoney > 8.8) {
                        this.setState({rewardMoney:this.state.rewardMoney-1})
                      }
                      else {
                        this.setState({rewardMoney:8.8})
                      }
                      this.timer = setTimeout(()=>{
                        this.interval = setInterval(()=>{
                          if (this.state.rewardMoney > 8.8) {
                            this.setState({rewardMoney:this.state.rewardMoney-1})
                          }
                          else {
                            this.setState({rewardMoney:8.8})
                          }
                        },500);
                      },1000);
                    }}
                    onTouchEnd={()=>{
                      this.interval && clearInterval(this.interval);
                      this.timer && clearTimeout(this.timer);
                    }}
                    style={[css.rewardBtn,{marginLeft:Util.size['width']*0.05}]}
                    source={require("image!ic_goods_reduce")}/>
                  <TextInput
                     style={css.textInput}
                     autoCapitalize = 'none'
                     editable={false}
                     keyboardType='numeric'
                     selectionColor={'red'}
                     ref='textInput'
                     maxLength={4}
                     onChangeText={(rewardMoney) => this.setState({rewardMoney})}
                     onFocus={() => {this.refs.textInput.focus()}}
                     defaultValue={this.state.rewardMoney+''}
                     value={this.state.rewardMoney+''}
                   />
                  <Image
                    onTouchStart={()=>{
                      this.setState({rewardMoney:this.state.rewardMoney+1})
                      this.timer = setTimeout(()=>{
                        this.interval = setInterval(()=>{
                          this.setState({rewardMoney:this.state.rewardMoney+1})
                        },500);
                      },1000);
                    }}
                    onTouchEnd={()=>{
                      this.interval && clearInterval(this.interval);
                      this.timer && clearTimeout(this.timer);
                    }}
                    style={[css.rewardBtn,{marginRight:Util.size['width']*0.05}]}
                    source={require("image!ic_goods_add")}/>
                </View>
                <View style={{alignItems:'center',marginTop:20}}>
                  <Text style={{color: '#f5d996',fontSize:14,fontWeight:'500'}}>
                    赏{' ' + this.state.rewardMoney + ' '}元
                  </Text>
                </View>
              </View>
            </Image>
        </ActionSheet>
      </View>
    );
  },
  onReward() {
    console.log(this.props.planId);
  },
  onPay() {
    let plan = this.state.plan;
    if (this.state.totalMultiple <= 0) {
      Util.toast('请输入有效倍数');
      return
    }
    // 支付请求
    Store.get('token').then((token)=>{
      if (token) {
        // 组装请求消息体
        let postBody = {
          'pmp': this.state.totalMultiple,
          'pid': plan.plan_id
        };
        Util.post(net.planApi.buyPlan, token, postBody,
        ({code, msg, result})=>{
          if (code === 1) {
            Util.toast('购买成功!');
            this.setState({showCartBtn:false});
          }
          else if (code === 2) {
            // 结算异常
            Util.toast(msg);
          }
          else if (code === 0) {
            let errorTips = '';
            if (result) {
              let errObj = result[0];
              errorTips = (errObj.expert_name ? '专家[' + errObj.expert_name + '],' : '') + errObj.msg;
            }
            else {
              errorTips = msg;
            }
            Util.toast(errorTips);
          }
        });
      }
    });
  },
  onCancel() {
    this.setState({
      showCartBtn:false,
      showReward: false
    });
  },
  onOpen() {
    if (this.state.disabledPayBtn) {
      Util.toast('方案已截止,不可购买!');
    }
    else {
      this.setState({showCartBtn:true});
    }
  },
  _renderRecordRow: function(row) {
    return(
      <View style={css.recordRow}>
        <View style={[css.recordCellFixed,{alignItems: 'center',marginLeft:10,}]}>
          <Text style={{fontWeight : '100',fontSize : 12}}>
            {row.effective_time.substr(5, 5)}
          </Text>
        </View>
				<View style={[css.recordCell]}>
					<Text style={[css.recordText,{textAlign:'right'}]}>
            {row.rangeName}
          </Text>
				</View>
        <View style={css.recordCell}>
					<Text style={css.recordText}>
            {row.plan_amount}.00元
          </Text>
				</View>
        <View style={css.recordCellFixed}>
          <Image style={{width:16,height:16,marginRight:10}} source={{uri: row.planResult}} />
        </View>
			</View>
    );
  },
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[css.container,css.borderBottom, isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Text style={css.headerText}>
          {section.title}
          {
            section.title === '方案内容'
            ?
            <Text style={{fontSize:12,fontWeight:'100',}}>
              (夜里12点以后看到专家的方案)
            </Text>
            :
            null
          }
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
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop:65,
    marginBottom:1,
  },
  container: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  borderTop: {
    borderTopColor : '#eeeeee',
    borderTopWidth : 1,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  goodRow : {
  	flexDirection : 'row',
  	alignItems: 'center',
    justifyContent: 'space-between'
  },
  redPrice : {
  	color : '#c40001'
  },
  whitePrice : {
  	fontSize : 14,
  	color : '#b0b0b0'
  },
  img: {
    resizeMode: 'contain'
  },
  headerText: {
    fontSize: 16,
    fontWeight: '100',
    marginTop:6,
    marginBottom:6,
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
  recordCell: {
    flex:1,
    height: 50,
    justifyContent : 'center'
  },
  recordCellFixed: {
    height: 50,
    justifyContent : 'center'
  },
  recordText: {
    fontSize: 12,
    fontWeight: '100',
    textAlign: 'center',
    margin: 10
  },
  userImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // marginLeft:10
  },
  resizeMode: {
    width: 120,
    paddingBottom:20,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  cartBtn : {
    color: '#FFFFFF',
    lineHeight: Util.size['height']*0.05,
    marginTop:-16,
    marginBottom:4,
    marginLeft:10,
    marginRight:10,
    height:Util.size['height']*0.068,
    overflow:'hidden',
    borderWidth : 1,
    borderRadius:10,
    borderColor: '#FFFFFF',
  },
  priceRow: {
    height:Util.size['height']*0.078,
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:'white',
    borderBottomWidth: 1,
    borderColor: '#D3D3D3',
  },
  textInput: {
    height:Util.size['height']*0.052,
    width:180,
    alignSelf:'center',
    justifyContent:'center',
    color: '#f6383a',
    borderColor: '#FF6347',
    borderRadius:10,
    borderWidth: 0.4,
    paddingHorizontal:10,
    paddingVertical:6,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  mathBtn: {
    height:Util.size['width']*0.088,
    width:Util.size['width']*0.088,
    tintColor: '#000000',
  },
  rewardBackImg: {
    height: 180,
    resizeMode: Image.resizeMode.stretch,
  },
  rewardRow: {
    height:40,
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardBtn: {
    height:Util.size['width']*0.088,
    width:Util.size['width']*0.088,
    tintColor: '#f5d996',
  },
  rewardSelectImg: {
    width: 70,
    resizeMode: Image.resizeMode.stretch,
  },
});
