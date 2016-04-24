/*!
 *
 * 封装Navigator
 * 所有的切换过场动画是从底部往上,回退是从上往下
 * 这里需要注意的是使用{...route.passProps}模仿NavigatorIOS的passProps
 *
 */
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator
} = React;

module.exports = React.createClass({
  render: function() {
    return(
      <Navigator
        initialRoute={{name:'',component:this.props.component,index:0}}
        configureScene={()=>{return Navigator.SceneConfigs.FloatFromBottom;}}
        renderScene={(route, navigator)=>{
          // console.log(route);
          //console.log(navigator);
          const Index = route.index;
          const Component = route.component;
          //console.log(Index);
          if (Index > 0) {
            console.log(Index);
          }else{
            return(
              <View style={{flex:1}}>
                <Component navigator={navigator} route={route} {...route.passProps}/>
              </View>
            );
          }
        }}/>
    );
  }
});
