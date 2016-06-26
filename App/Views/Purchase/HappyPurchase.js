import React from 'react-native';
import Swiper from 'react-native-swiper';

import Util from '../../Common/Util';
import ItemList from '../../Component/HappyPurchase/ItemList';
import ItemDetail from '../../Component/HappyPurchase/ItemDetail';
import Tabs from '../../Common/Tabs';
import LatestAnnounced from '../../Component/HappyPurchase/LatestAnnounced';
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
  Platform
} = React;

module.exports = React.createClass({
  render: function() {
    var cateId = this.state.cateId;
    var tabDataSource = this.state.tabData;
    return (
      <View style={css.flex}>
        <ScrollView stickyHeaderIndices={[3]}
          showsVerticalScrollIndicator={false}>
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
            autoplay={true} autoplayTimeout={5} horizontal={false}>
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

          {/*产品分类tab*/}
          <Tabs updateCateItem={(cateId)=>this.setState({cateId : cateId})}
              initData={{tabDataSource}}/>

          {/*产品列表*/}
          <ItemList cateId={cateId} onSelect={(item)=>this.selectItem(item)}/>
        </ScrollView>
      </View>
    );
  },
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([[
        {title:'最新揭晓', id: 'latest', img: '最新揭晓'},
        // {title:'充值', id: 'recharge', img: '充值'},
        {title:'帮助', id: 'help', img: '帮助-1'}
      ]]),
      tabData: [
        {
          code: 0,
          name: '全部商品'
        },{
          code: '10',
          name: '十元专场',
          link: 'http://list.tmall.com/search_product.htm?abbucket=&acm=lb-tms-1261802-40482.1003.8.316504&aldid=316504&q=%CA%D6%BB%FA&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton&abtest=&type=p&scm=1003.8.lb-tms-1261802-40482.ITEM_1436707130731_316504&pos=1',
          icon: ''
        }
      ],
      cateId : 0,
      scrollMsgList: [{ title: '一元夺宝, 精彩无限!' }],
      bannerList: []
    };
  },
  //只调用一次，在render之后调用
  componentDidMount: function() {
    // 获取banner图
    this.fetchBannerData();
    // 获取滚动消息
    this.scrollMsgForHP();
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
  //选中一行
  selectItem:function(item){
    // console.log(item);
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: '商品详情',
        component: ItemDetail,
        navigationBarHidden:false,
        passProps: {
          item: item
        }
      });
    }else{
      //android对应的处理
    }
  },
  //拉取数据
  fetchBannerData: function() {
    let bannerUrl = net.hpApi.banner;
    fetch(bannerUrl)
        .then((response) => response.json())
        .then(({code, msg, info}) => {
          if (code === 1) {
            this.setState({
              bannerList: info
            });
          }
      }).catch((e) => {
        console.log('获取乐夺宝banner失败:' + e)
      });
  },
  // 获取滚动消息
  scrollMsgForHP() {
    Util.get(net.hpApi.oneBuyNewPublic + '?pagenum=' + 0, '',
    ({code, msg, results})=>{
      if (code === 1) {
        if (results.list.length > 0) {
          this.state.scrollMsgList = []
          for (var i = 0; i < results.list.length; i++) {
            let info = results.list[i]
            if (info.user_name) {
              let name = info.user_name
              let unFirst = name.substr(name.length > 2 ? 2 : 1, name.length)
              let rv = ''
              for (let i = 0; i < name.length - 1; i++) {
                rv += '*'
              }
              let finalName = name.replace(unFirst, rv)
              let msg = '恭喜 ' + finalName + ' ' + info.price + '元夺得' + info.name
              this.state.scrollMsgList.push({
                title: msg
              })
            }
          }
          if (this.state.scrollMsgList.length === 0) {
            this.state.scrollMsgList.push({
              title: '一元夺宝, 精彩无限!'
            });
          }
        }
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
    marginTop: 6,
    fontSize: 12,
    fontWeight: '100',
  },
  tipsImg: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  scrollMsg: {
    flexDirection: 'row',
    height: 36,
    backgroundColor: '#66CC66',
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
  },
  scrollText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#66CC66',
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
