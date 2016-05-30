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
  ListView,
  TouchableOpacity,
  ScrollView
} = React;

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import ActionSheet from 'react-native-actionsheet';
import * as net from './../../Network/Interface';

const buttons = ['确认', '10 20 50 100 300', '😄😄😄', '需10元'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      collapsed: true,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  },
  componentDidMount(){
    //console.log(this.props.item);
    this.setState({
      item: this.props.item
    });
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
          <View style={[css.container,css.borderTop]}>
            <Text style={{fontWeight:'100',fontSize:10}}>
              参与记录
            </Text>
            {
              this.state.dataSource.getRowCount() > 0
              ?
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRecordRow}/>
              :
              <View style={{bottom:-10,marginTop:16,alignItems:'center',justifyContent: 'center'}}>
                <Image style={css.resizeMode} source={require('image!温馨提示')}/>
                <Text style={{height:20,fontSize: 10, color: 'gray'}}>
                  还没有人参与,赶快试试吧,万一中了呢?
                </Text>
              </View>
            }
          </View>
        </ScrollView>
        <View style={css.cartBtnWarp}>
          <Text style={css.cartBtn} onPress={this.show}>参与</Text>
          <ActionSheet
            ref={(o) => this.ActionSheet = o}
            title="请选择参与人次"
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
    console.log(index);
  },
  show() {
    this.ActionSheet.show();
  },
  _renderRecordRow: function(row) {
    return(
      <View style={css.recordRow}>
        <View style={css.recordCellFixed,{width:54}}>
          <Image style={css.userImg} source={require('image!默认头像')} />
          <Text style={{textAlign: 'center',fontWeight : '100',fontSize : 10}}>{row.user_name}</Text>
        </View>
				<View style={css.recordCell}>
					<Text style={css.recordText}>{row.addTime}</Text>
				</View>
        <View style={{width:80},css.recordCellFixed}>
          <Text style={css.recordText}>{row.payCount}人次</Text>
        </View>
			</View>
    );
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
  cartBtnWarp : {
    // flex: 1, alignItems: 'center', justifyContent: 'center'
    position : 'absolute',
    left: 11,
    bottom : 12,
    borderWidth : 1,
    // borderColor : '#3164ce',
    borderRadius : 10,
    backgroundColor: 'rgba(245,252,255,1)',
  },
  cartBtn : {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height : 30,
    width: Util.size.width-24,
    color : '#3164ce',
  },
  recordRow : {
    flexDirection : 'row',
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
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
    textAlign: 'center',
    margin: 10
  },
  userImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft:10
  },
  resizeMode: {
    width: 120,
    paddingBottom:20,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
});
