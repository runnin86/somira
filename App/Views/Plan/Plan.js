import React from 'react-native';
import Swiper from 'react-native-swiper';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Util from '../../Common/Util';
import LatestAnnounced from '../../Component/Plan/LatestAnnounced';
import RangeList from '../../Component/Plan/RangeList';
import Recharge from '../../Component/Common/Recharge';
import Help from '../../Component/Common/Help';
import * as net from './../../Network/Interface';


var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
} = React;

module.exports = React.createClass({
  render: function() {
    return (
      <View style={css.flex}>
        <ScrollView stickyHeaderIndices={[2]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#c40001"
              title={"上次刷新:"+this.state.refreshedTime}
            />
          }>
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
          <Swiper showsButtons={false} height={40} showsPagination={false}
            autoplay={true} autoplayTimeout={3} horizontal={false}>
            {this.state.scrollMsgList.map(function(item,i){
              return (
                <View style={css.scrollMsg} key={i}>
                  <Image style={css.resizeMode} source={require('image!喇叭')}/>
                  <Text style={css.scrollText}>
                    {item.title}
                  </Text>
                </View>
              );
            })}
          </Swiper>

          {/*方案区间列表*/}
          <RangeList navigator={this.props.navigator}/>
        </ScrollView>
      </View>
    );
  },
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([[
        {title:'周盈利排行', id: 'latest', img: '盈利排行'},
        {title:'充值', id: 'recharge', img: '充值'},
        {title:'帮助', id: 'help', img: '帮助-1'}
      ]]),
      scrollMsgList: [{ title: '温馨提示: 理性投注,长跟长红!' }],
      bannerList: [],
      isRefreshing: false,
      refreshedTime: Util.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss'),
    };
  },
  //只调用一次，在render之后调用
  componentDidMount() {
    // banner数据
    this.fetchBannerData();
    // 获取滚动消息
    this.scrollMsgForPlan();
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
      // this.props.navigator.push({
      //   component:Recharge,
      //   navigationBarHidden:false,
      //   title:title
      // });
      Util.toast('充值功能暂未开放,敬请期待!');
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
  // 拉取banner数据
  fetchBannerData() {
    Util.get(net.planApi.banner, '',
    ({code, msg, info})=>{
      if (code === 1) {
        this.setState({
          bannerList: info
        });
      }
    });
  },
  // 获取滚动消息
  scrollMsgForPlan() {
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.planApi.rank, token,
        ({code, msg, result})=>{
          if (code === 1 && result.length > 0) {
            this.state.scrollMsgList = []
            for (var i = 0; i < result.length; i++) {
              let obj = result[i]
              // 隐藏手机号码中间四位
              // let phone = obj.bs_userId.substr(3, 4)
              // let lphone = obj.bs_userId.replace(phone, '****')
              if (obj.winbonus > 0) {
                let scrollText = {title: '用户 ' +
                  obj.nickName + '，上期盈利 ' + obj.winbonus + ' 元'}
                this.state.scrollMsgList.push(scrollText);
              }
            }
            if (this.state.scrollMsgList.length === 0) {
              this.state.scrollMsgList.push({
                title: '温馨提示：理性投注，长跟长红'
              });
            }
          }
        });
      }
    });
  },
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      RCTDeviceEventEmitter.emit('refreshPlan');
      this.setState({
        isRefreshing: false,
      });
      setTimeout(() => {
        this.setState({
          refreshedTime: Util.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss'),
        });
      }, 1000);
    }, 1500);
  },
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
    marginTop: 6,
    fontSize: 13,
    fontWeight: '100',
  },
  tipsImg: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  scrollMsg: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#cb4a4a',
    borderTopColor: '#cb4a4a',
    borderTopWidth: 1,
  },
  scrollText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: '#cb4a4a',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  resizeMode: {
    width: 26,
    height: 20,
    marginLeft: 8,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
    alignSelf: 'center',
    justifyContent: 'center',
  }
});
