import React from 'react-native';
import Swiper from 'react-native-swiper';

import Util from '../../Common/Util';
import ItemList from '../../Component/Plan/ItemList';
import ItemDetail from '../../Component/Plan/ItemDetail';
import LatestAnnounced from '../../Component/Plan/LatestAnnounced';
import RangeList from '../../Component/Plan/RangeList';
import Recharge from '../../Component/Plan/Recharge';
import Help from '../../Component/Plan/Help';
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableOpacity,
  ScrollView,
  Platform,
  AppRegistry
} = React;

const UIExplorerList = require('./UIExplorerList.ios');
const UIExplorerExampleList = require('./UIExplorerExampleList');

import type { UIExplorerExample } from './UIExplorerList.ios';

module.exports = React.createClass({
  render: function() {
    // console.log(RangeList);
    const Example = UIExplorerList.Modules['TextExample'];
    const Component = UIExplorerExampleList.makeRenderable(Example);
    console.log(Component);
    return (
      <ScrollView>
        <Component/>
      </ScrollView>
    );
  },
  getInitialState: function() {
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
  //拉取数据
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

// Register suitable examples for snapshot tests
UIExplorerList.ComponentExamples.concat(UIExplorerList.APIExamples).forEach((Example: UIExplorerExample) => {
  const ExampleModule = Example.module;
  if (ExampleModule.displayName) {
    const Snapshotter = React.createClass({
      render: function() {
        const Renderable = UIExplorerExampleList.makeRenderable(ExampleModule);
        return (
          <SnapshotViewIOS>
            <Renderable />
          </SnapshotViewIOS>
        );
      },
    });
    AppRegistry.registerComponent(ExampleModule.displayName, () => Snapshotter);
  }
});
