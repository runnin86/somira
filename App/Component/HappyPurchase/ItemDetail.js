'use strict';

import React from 'react-native';
import Swiper from 'react-native-swiper';
import Progress from '../../Common/Progress';
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
import * as net from './../../Network/Interface';

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      showCartBtn: false,
      totalPrice: this.props.item.price,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  },
  componentDidMount(){
    //拉取参与记录
    this.fetchParticipation(this.props.item.id, this.props.item.number, 0);
  },
  //拉取参与记录数据
  fetchParticipation: function(id, number, pagenum) {
    let recordUrl = net.hpApi.all_partake +
      '?projectId=' + id + '&number=' + number + '&pagenum=' + pagenum;
    fetch(recordUrl)
    .then((response) => response.json())
    .then(({code, msg, results}) => {
      if (code === 1) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(results.list)
        });
      }
    }).catch((e) => {
      console.log('获取乐夺宝参与记录失败:' + e)
    });
  },
  render: function() {
    var item = this.props.item;
    // console.log(item);
    let progressNum = (item.totalCount - item.codeCount) / item.totalCount;
    return (
      <View style={css.flex}>
        <ScrollView style={{marginTop:-65,marginBottom:20}}>
          {/*轮播图*/}
          <Swiper height={200}
            onMomentumScrollEnd={function(e, state, context){}}
            dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            paginationStyle={{
              bottom: 5, left: null, right: 10,
            }} loop={true} autoplay={true}>
            {
              item.images.split(',').map(function (i, key) {
                return (
                  <View key={key} style={css.slide} title={<Text numberOfLines={1}></Text>}>
                    <Image style={[css.flex,css.img]} source={{uri: i}} />
                  </View>
                )
              })
            }
          </Swiper>
          <View style={[css.container,css.borderTop,css.borderBottom]}>
            <View>
              <Text style={{fontSize : 16}} numberOfLines={2}>{item.name}</Text>
              <Text style={{fontWeight : '100',fontSize : 12,marginTop : 4}} numberOfLines={2}>
                {item.content}
              </Text>
              <View style={css.progress}>
                <Progress progress={progressNum}/>
              </View>
              <View style={css.goodRow}>
                <View>
                  <Text style={css.redPrice}>
                    {item.totalCount}
                  </Text>
                  <Text style={{fontWeight:'100',fontSize:14}}>总需</Text>
                </View>
                <View>
                  <Text style={css.whitePrice}>
                    {item.codeCount}
                  </Text>
                  <Text style={{fontWeight:'100',fontSize:14}}>剩余</Text>
                </View>
              </View>
            </View>
          </View>
          <Accordion
            sections={[{
              title: '获奖号码算法',
              content: [
                '一、取该商品号码购买完时所有商品的最后100条购买时间；',
                '二、按时、分、秒、毫秒排列相加在除以该商品总人次后取余数；',
                '三、余数在加上10000001 即为中奖的幸运号码；',
                '四、余数是指在整数的除法中，只有能整除与不能整除两种情况。当不能整除时，就产生余数，如10/4=2 ... 2,2就是余数。'
              ]
            }]}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            duration={400}
          />
          <Accordion
            sections={[{
              title: '参与码',
              content: [
                '您已参与10人次',
                '参与号码:',
                '1000482  1000878  1000261  1000110  1000987 1000172',
                '1000582  1000578  1000561  1000510  1000587 1000572'
              ]
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
              参与记录
            </Text>
            <View style={[{paddingTop:6,paddingBottom:6,width:Util.size['width']},css.borderBottom]}></View>
            {
              this.state.dataSource.getRowCount() > 0
              ?
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRecordRow}/>
              :
              <View style={{bottom:-10,marginTop:16,alignItems:'center',justifyContent: 'center'}}>
                <Image style={css.resizeMode} source={require('image!温馨提示')}/>
                <Text style={{height:20,fontSize: 14, color: 'gray'}}>
                  还没有人参与,赶快试试吧,万一中了呢?
                </Text>
              </View>
            }
          </View>
        </ScrollView>
        <Button onPress={this.onOpen} style={css.cartBtn}>
          立即夺宝
        </Button>
        <ActionSheet
            visible={this.state.showCartBtn}
            onCancel={this.onCancel}
            cancelText={'确认'}
            buttonStyle={{marginTop:6, borderRadius:6,height:Util.size['height']*0.068,backgroundColor:'#f6383a'}}
            textStyle={{color:'#FFFFFF'}}>
            <ActionSheet.Button
              buttonStyle={{borderBottomWidth:1,borderColor: '#D3D3D3',}}>
              <Text style={{color: '#5f646e',fontSize:14}}>
                请选择参与人次
              </Text>
            </ActionSheet.Button>
            <View style={css.priceRow}>
              <Text onPress={()=>this.setState({totalPrice:10})}
                style={{color: this.state.totalPrice===10?'#f6383a':'#0894ec',fontSize:14,marginLeft:16,}}>
                10
              </Text>
              <Text onPress={()=>this.setState({totalPrice:20})}
                style={{color: this.state.totalPrice===20?'#f6383a':'#0894ec',fontSize:14}}>
                20
              </Text>
              <Text onPress={()=>this.setState({totalPrice:50})}
                style={{color: this.state.totalPrice===50?'#f6383a':'#0894ec',fontSize:14}}>
                50
              </Text>
              <Text onPress={()=>this.setState({totalPrice:100})}
                style={{color: this.state.totalPrice===100?'#f6383a':'#0894ec',fontSize:14}}>
                100
              </Text>
              <Text onPress={()=>this.setState({totalPrice:300})}
                style={{color: this.state.totalPrice===300?'#f6383a':'#0894ec',fontSize:14,marginRight:16,}}>
                300
              </Text>
            </View>
            <View style={css.priceRow}>
              <Image
                onTouchStart={()=>{
                  if (this.state.totalPrice > this.props.item.price) {
                    this.setState({totalPrice:this.state.totalPrice-this.props.item.price})
                  }
                  else if (this.state.totalPrice <= this.props.item.price) {
                    this.setState({totalPrice:this.props.item.price})
                  }
                  this.timer = setTimeout(()=>{
                    this.interval = setInterval(()=>{
                      if (this.state.totalPrice > this.props.item.price) {
                        this.setState({totalPrice:this.state.totalPrice-this.props.item.price})
                      }
                      else if (this.state.totalPrice <= this.props.item.price) {
                        this.setState({totalPrice:this.props.item.price})
                      }
                    },500);
                  },1000);
                }}
                onTouchEnd={()=>{
                  this.interval && clearInterval(this.interval);
                  this.timer && clearTimeout(this.timer);
                }}
                style={{height:36,width:36,marginLeft:24,tintColor: '#000000',}}
                source={require("image!ic_goods_reduce")}/>
              <TextInput
                 style={css.textInput}
                 autoCapitalize = 'none'
                 autoCorrect={false}
                 keyboardType='numeric'
                 selectionColor={'red'}
                 ref='textInput'
                 maxLength={4}
                 onChangeText={(totalPrice) => this.setState({totalPrice})}
                 onFocus={() => {this.refs.textInput.focus()}}
                 defaultValue={this.state.totalPrice+''}
                 value={this.state.totalPrice+''}
               />
              <Image
                onTouchStart={()=>{
                  this.setState({totalPrice:this.state.totalPrice+this.props.item.price})
                  this.timer = setTimeout(()=>{
                    this.interval = setInterval(()=>{
                      this.setState({totalPrice:this.state.totalPrice+this.props.item.price})
                    },500);
                  },1000);
                }}
                onTouchEnd={()=>{
                  this.interval && clearInterval(this.interval);
                  this.timer && clearTimeout(this.timer);
                }}
                style={{height:36,width:36,marginRight:24,tintColor: '#000000',}}
                source={require("image!ic_goods_add")}/>
            </View>
            <ActionSheet.Button>
              <Text style={{color: '#5f646e',fontSize:14}}>
                需
                <Text style={{color: '#f6383a'}}>
                  {' ' + this.state.totalPrice + ' '}
                </Text>
                元
              </Text>
            </ActionSheet.Button>
        </ActionSheet>
      </View>
    );
  },
  onCancel() {
    console.log('进行支付:' + this.state.totalPrice);
    this.setState({showCartBtn:false});
  },
  onOpen() {
    this.setState({showCartBtn:true});
  },
  _renderRecordRow: function(row) {
    return(
      <View style={css.recordRow}>
        <View style={[css.recordCellFixed,{marginBottom:10,alignItems: 'center',marginLeft:10,}]}>
          <Image style={css.userImg} source={require('image!默认头像')} />
          <Text style={{fontWeight : '100',fontSize : 12}}>{row.user_name}</Text>
        </View>
				<View style={css.recordCell}>
					<Text style={css.recordText}>{row.addTime}</Text>
				</View>
        <View style={css.recordCellFixed}>
          <Text style={css.recordText}>{row.payCount}人次</Text>
        </View>
			</View>
    );
  },
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[css.container,css.borderBottom, isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Text style={css.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  },
  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400}
        style={[css.content,css.borderBottom,isActive ? css.active : css.inactive]} transition="backgroundColor">
        {section.content.map(function(v,i){
          return (
            <Animatable.Text key={i} style={css.contentText}
              animation={isActive ? 'bounceIn' : undefined}>
              {v}
            </Animatable.Text>
          );
        })}
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
  progress: {
    marginTop: 5,
    marginBottom: 5
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
    backgroundColor: 'lightgreen',
  },
  priceRow: {
    height:Util.size['height']*0.068,
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
  }
});
