var React = require('react-native');
var Swiper = require('react-native-swiper');
var Progress = require('../../Common/Progress');
var Util = require('../../Common/Util');

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
} = React;

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import ActionSheet from 'react-native-actionsheet';

const buttons = ['取消', '确认退出', '😄😄😄', '哈哈哈'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      collapsed: true
    }
  },
  componentDidMount(){
    //console.log(this.props.item);
    this.setState({
      item: this.props.item
    });
  },
  render: function() {
    var item = this.props.item;
    // console.log(item);
    let progressNum = (item.totalCount - item.codeCount) / item.totalCount;
    return (
      <View style={css.flex}>
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
            <Text style={{fontSize : 12}} numberOfLines={2}>{item.name}</Text>
            <Text style={{fontWeight : '100',fontSize : 8,marginTop : 4}} numberOfLines={2}>
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
                <Text style={{fontWeight:'100',fontSize:10}}>总需</Text>
              </View>
              <View>
                <Text style={css.whitePrice}>
                  {item.codeCount}
                </Text>
                <Text style={{fontWeight:'100',fontSize:10}}>剩余</Text>
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
        <View style={[css.container,css.borderBottom]}>
          <Text style={{fontWeight:'100',fontSize:10}}>
            您已参与10人次
          </Text>
          <Text style={{fontWeight:'100',fontSize:10,marginTop: 6}}>
            参与号码:
            <Text style={{fontSize:9}}>
              1000482  1000878  1000261  1000110  1000987 1000172 1000333
            </Text>
          </Text>
        </View>
        <View style={{height:4,backgroundColor:'#eee'}}>
          <Text>
          </Text>
        </View>
        <View style={[css.container,css.borderTop,css.borderBottom]}>
          <Text style={{fontWeight:'100',fontSize:10}}>
            参与记录
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={css.button} onPress={this.show}>SHOW</Text>
            <ActionSheet
                ref={(o) => this.ActionSheet = o}
                title="确认要退出登录吗？"
                options={buttons}
                cancelButtonIndex={CANCEL_INDEX}
                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                onPress={this._handlePress}
            />
        </View>
      </View>
    );
  },
  _handlePress(index) {
  },
  show() {
      this.ActionSheet.show();
  },
  _renderHeader(section, i, isActive) {
    return (
      <Animatable.View duration={400} style={[css.container,css.borderBottom, isActive ? css.active : css.inactive]} transition="backgroundColor">
        <Text style={css.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  },
  _renderContent(section, i, isActive) {
    return (
      <Animatable.View duration={400} style={[css.content,css.borderBottom,isActive ? css.active : css.inactive]} transition="backgroundColor">
        {section.content.map(function(v,i){
          return (
            <Animatable.Text key={i} style={css.headerText}
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
  	fontSize : 12,
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
    // textAlign: 'center',
    fontSize: 10,
    fontWeight: '100',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  active: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  button: {
    width: 200,
    margin: 10,
    paddingTop: 15,
    paddingBottom: 15,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'blue'
  }
});
