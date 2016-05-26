var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PropTypes
} = React;

module.exports = React.createClass({
  /*
   * porps属性，数据源
   */
  propTypes: {
    // 如果某个属性是必须的，在类型后面加上 .isRequired 即可
    // propName: React.PropTypes.array,
    // optionalBool: React.PropTypes.bool,
    // optionalFunc: React.propTypes.func,
    // optionalNumber: React.PropTypes.number,
    // optionalObject: React.propTypes.object,
    // optionalString: React.propTypes.string,
    // // instanceof
    // optionalMessage: React.propTypes.instanceof(Message),
    // // 枚举
    // optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
    name: React.PropTypes.string
  },
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      on: this.props.on,
      name: this.props.name
    }
  },
  /*
   * 获取属性默认值(once)
   */
  getDefaultProps () {
  },
  /*
   * 首次渲染之前
   */
  componentWillMount () {
    // 不可以在这个方法中修改props或state，
    // 如果要修改，应当在 componentWillReceiveProps() 中修改
  },
  /*
   * 初次渲染会后
   */
  componentDidMount () {
    // TODO:需要研究React developer tools的植入
  },
  /*
   * 属性被修改前
   */
  componentWillReceiveProps () {

  },
  /*
   * 判断是否需要更新
   */
  shouldComponentUpdate () {

  },
  /*
   * 更新前
   */
  componentWillUpdate () {

  },
  /*
   * 更新后
   */
  componentDidUpdate () {

  },
  /*
   * 销毁事件
   */
  commontWillUnmount () {

  },
  /*
   * 事件
   */
  clickHandle: function () {
    this.setState({on: !this.state.on});
  },
  /*
   * 渲染(JSX,通过state控制DOM结构变化)
   */
  render: function() {
    return (
      <View style={css.container}>
        <Text style={css.welcome}>
          Welcome to 最新揭晓!
        </Text>
        <Text style={css.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={css.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu2
        </Text>
      </View>
    );
  }
});

var css = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
