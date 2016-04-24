var React = require('react-native');
var Swiper = require('react-native-swiper');
var Util = require('../../Common/Util');
var ItemList = require('../../Component/HappyPurchase/ItemList');
var ItemDetail = require('../../Component/HappyPurchase/ItemDetail');
var Tabs = require('../../Common/Tabs');

var LatestAnnounced = require('../../Component/HappyPurchase/LatestAnnounced');
var Recharge = require('../../Component/HappyPurchase/Recharge');
var Help = require('../../Component/HappyPurchase/Help');

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
        <ScrollView stickyHeaderIndices={[3]}>
          {/*轮播图*/}
          <Swiper style={css.wrapper} height={Util.size['height']/4.5}
            onMomentumScrollEnd={function(e, state, context){}}
            dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            paginationStyle={{
              bottom: 5, left: null, right: 10,
            }} loop={true} autoplay={true}>
            <View style={css.slide} title={<Text numberOfLines={1}></Text>}>
              <Image style={css.flex} source={{uri: 'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg'}} />
            </View>
            <View style={css.slide} title={<Text numberOfLines={1}></Text>}>
              <Image style={css.flex} source={{uri: 'http://a.hiphotos.baidu.com/image/w%3D310/sign=4459912736a85edffa8cf822795509d8/bba1cd11728b4710417a05bbc1cec3fdfc032374.jpg'}} />
            </View>
            <View style={css.slide} title={<Text numberOfLines={1}></Text>}>
              <Image style={css.flex} source={{uri: 'http://e.hiphotos.baidu.com/image/w%3D310/sign=9a8b4d497ed98d1076d40a30113eb807/0823dd54564e9258655f5d5b9e82d158ccbf4e18.jpg'}} />
            </View>
            <View style={css.slide} title={<Text numberOfLines={1}></Text>}>
              <Image style={css.flex} source={{uri: 'http://e.hiphotos.baidu.com/image/w%3D310/sign=2da0245f79ec54e741ec1c1f89399bfd/9d82d158ccbf6c818c958589be3eb13533fa4034.jpg'}} />
            </View>
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
        {title:'充值', id: 'recharge', img: '充值'},
        {title:'帮助', id: 'help', img: '帮助-1'}
      ]]),
      tabData: [
        {
          code: 0,
          name: '全部商品'
        },{
          code: '1',
          name: '十元专场',
          link: 'http://list.tmall.com/search_product.htm?abbucket=&acm=lb-tms-1261802-40482.1003.8.316504&aldid=316504&q=%CA%D6%BB%FA&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton&abtest=&type=p&scm=1003.8.lb-tms-1261802-40482.ITEM_1436707130731_316504&pos=1',
          icon: ''
        }
      ],
      cateId : 0,
      scrollMsgList: []
    };
  },
  componentDidMount: function() {
    this.setState({
      scrollMsgList: [
        { title: '恭喜156****3355夺得 iPhone6s Plus 128G' },
        { title: '恭喜138****8888夺得 BMW X6' },
        { title: '恭喜170****1122夺得 Surface Pro I7 平板笔记本随心切换' }
      ]
    });
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
    //console.log(item);
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: item.txt,
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
    backgroundColor: '#F5FCFF',
    borderTopColor : '#eeeeee',
    borderTopWidth : 1,
  },
  scrollText: {
    height: 30,
    marginLeft: 4,
    marginTop: 10,
    fontSize: 12,
    color: 'red',
    backgroundColor: '#F5FCFF'
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
