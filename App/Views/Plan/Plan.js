import React from 'react-native';
import Swiper from 'react-native-swiper';

import Util from '../../Common/Util';
import LatestAnnounced from '../../Component/Plan/LatestAnnounced';
import RangeList from '../../Component/Plan/RangeList';
import Recharge from '../../Component/Common/Recharge';
import Help from '../../Component/Common/Help';
import * as net from './../../Network/Interface';
import createExamplePage from './createExamplePage';


var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableOpacity,
  ScrollView,
  Platform
} = React;

module.exports = React.createClass({
  makeRenderable(example: any): ReactClass<any> {
    return example.examples ?
      createExamplePage(null, example) :
      example;
  },
  render: function() {
    const tjson = {
      examples: [{
        title: 'Wrap',
        render: function() {
          return (
            <Text>
              The text should wrap if it goes on multiple lines. See, this is going to
              the next line.
            </Text>
          );
        },
      },]
    };
    const Component = this.makeRenderable(tjson);
    return (
      <View style={css.flex}>
        <ScrollView stickyHeaderIndices={[3]}>
          {/*轮播图*/}
          <Swiper style={css.wrapper} height={Util.size['height']/4.5}
            onMomentumScrollEnd={function(e, state, context){}}
            dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            paginationStyle={{
              bottom: 5, left: null, right: 10,
            }} loop={true} autoplay={true}>
            {this.state.bannerList.map(function(item,i){
              return (
                <View style={css.slide} title={<Text numberOfLines={1}></Text>} key={item.id}>
                  <Image style={css.flex} source={{uri: item.img}} />
                </View>
              );
            })}
          </Swiper>

          {/*快捷入口=最新揭晓,充值,帮助等*/}
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderTipsRow}/>

          {/*滚动消息*/}
          <Swiper showsButtons={false} height={30} showsPagination={false}
            autoplay={true} autoplayTimeout={5} horizontal={false}>
            {this.state.scrollMsgList.map(function(item,i){
              return (
                <View style={css.scrollMsg} key={i}>
                  <Image style={{marginTop:4},css.resizeMode} source={require('image!喇叭')}/>
                  <Text style={css.scrollText}>
                    {item.title}
                  </Text>
                </View>
              );
            })}
          </Swiper>

          {/*方案区间列表*/}
          <Component/>
        </ScrollView>
      </View>
    );
  },
  getInitialState: function() {
    console.log(RangeList);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([[
        {title:'最新揭晓', id: 'latest', img: '最新揭晓'},
        {title:'充值', id: 'recharge', img: '充值'},
        {title:'帮助', id: 'help', img: '帮助-1'}
      ]]),
      scrollMsgList: [],
      bannerList: []
    };
  },
  //只调用一次，在render之后调用
  componentDidMount: function() {
    this.setState({
      scrollMsgList: [
        { title: '温馨提示: 理性投注,长跟长红' },
        { title: '恭喜138****8888夺得 BMW X6' },
        { title: '恭喜170****1122夺得 Surface Pro I7 平板笔记本随心切换' }
      ]
    });
    this.fetchBannerData();
  },
  _renderTipsRow: function(row) {
    var tipsList = [];
    for(var i in row){
      //渲染几个tips按钮
      var appendRow = (
        <TouchableOpacity key={row[i].id} style={{width: Util.size['width']/row.length}}
          onPress={this._goForward.bind(this, row[i].title, row[i].id)}>
          <View style={css.tipsCenter}>
            <Image style={css.tipsImg} source={{uri: row[i].img}}/>
          </View>
          <View style={[css.tipsCenter]}>
            <Text style={css.tipsText}>{row[i].title}</Text>
          </View>
        </TouchableOpacity>
      );
      tipsList.push(appendRow);
    }

    return(
      <View style={[css.tipItem,css.row]}>
        {tipsList}
      </View>
    );
  },
  _goForward: function(title, id){
    if (id == 'latest') {
      this.props.navigator.push({
        component:LatestAnnounced,
        leftButtonIcon: Image.propTypes.source,
        navigationBarHidden:false,
        onLeftButtonPress: () => this.props.navigator.pop(),
        title:title
      });
    }else if (id == 'recharge') {
      this.props.navigator.push({
        component:Recharge,
        navigationBarHidden:false,
        title:title
      });
    }else if (id == 'help') {
      if (Platform.OS === 'ios') {
        this.props.navigator.push({
          component:Help,
          navigationBarHidden:false,
          title:title
        });
  		}else{
  			//android对应的处理
  		}
    }
  },
  //选中一行
  selectItem:function(item){
    // console.log(item);
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: '商品详情',
        component: ItemDetail,
        leftButtonTitle: '返回',
        navigationBarHidden:false,
        onLeftButtonPress: () => this.props.navigator.pop(),
        passProps: {
          item: item
        }
      });
    }else{
      //android对应的处理
    }
  },
  //拉取banner数据
  fetchBannerData: function() {
    Util.get(net.planApi.banner, '',
    ({code, msg, info})=>{
      if (code === 1) {
        this.setState({
          bannerList: info
        });
      }
    },
    (e)=>{
      console.error(e);
    });
  }
});

var css = StyleSheet.create({
  wrapper: {

  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F5FCFF',
  },
  flex: {
    flex: 1,
  },
  tipsCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tipItem: {
    marginTop: 0,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#ddd',
    paddingTop: 6,
    paddingBottom: 6
  },
  tipsText: {
    marginTop: 4,
    fontSize: 10
  },
  tipsImg: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  scrollMsg: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: '#cb4a4a',
    borderTopColor : '#cb4a4a',
    borderTopWidth : 1,
  },
  scrollText: {
    height: 30,
    marginLeft: 4,
    marginTop: 8,
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: '#cb4a4a'
  },
  resizeMode: {
    width: 26,
    height: 20,
    marginLeft: 8,
    marginTop: 6,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  }
});
