var React = require('react-native');
var Swiper = require('react-native-swiper');
var Util = require('../../Common/Util');

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View
} = React;

module.exports = React.createClass({
  componentDidMount(){
    //console.log(this.props.item);
    this.setState({
      item: this.props.item
    });
  },
  render: function() {
    var item = this.props.item;
    return (
      <View style={css.flex}>
        {/*轮播图*/}
        <Swiper height={200} style={{marginTop:32}}
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
                  <Image style={css.flex} source={{uri: i}} />
                </View>
              )
            })
          }
        </Swiper>
      </View>
    );
  }
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});
