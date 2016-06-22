import React from 'react-native';
import Util from '../../Common/Util';

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  LinkingIOS,
} = React;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
    }
  },
  /*
   * 渲染(JSX,通过state控制DOM结构变化)
   */
  render: function() {
    return (
      <View style={css.container}>
        <View style={css.card}>
          <Image style={css.logo} source={require('image!64X64')} />
          <Text style={css.instructions}>
            足彩收米拉致力为用户提供最专业的足球分析服务，打造最精准的赛事分析。
          </Text>
          <Text style={css.welcome}>
            强大的分析团队：
            <Text style={css.instructions}>
              团队成员至少拥有十年以上的看球和赛事分析经验，熟悉各大足球联赛体系，广视角、多层级、更深度组合出击，完美诠释直击赛果。
            </Text>
          </Text>
          <Text style={css.welcome}>
            先进的管理团队：
            <Text style={css.instructions}>
              公司管理层长期浸淫互联网，准确把脉互联网+的发展方向，简洁高效的扁平化管理，缜密多元的发展计划。
            </Text>
          </Text>
          <Text style={css.welcome}>
            工作环境：
            <Text style={css.instructions}>
              窗明几净宽敞大气的办公室，配长期无节制的点心饮料，无障碍的员工间沟通，合理化建议的快速实施，融洽多彩的的工作氛围。
            </Text>
          </Text>
          <Text style={css.welcome}>
            公司目标：
            <Text style={css.instructions}>
              打造最专业、最精准的互联网足球赛事分析，建立国内最优秀的足球大数据资料库。
            </Text>
          </Text>
          <Text style={css.welcome}>
            公司愿景：
            <Text style={css.instructions}>
              携手足球爱好者完成足球资讯大社区的组建。
            </Text>
          </Text>
        </View>

          <TouchableHighlight underlayColor="#dad9d7"
            style={{marginTop: 10}}
            onPress={()=>{LinkingIOS.openURL('tel://4008710088')}}>
            <View style={css.recordRow}>
              <View style={[css.recordCellFixed,{alignItems: 'flex-start',marginLeft:10,}]}>
                <View style={css.newRow}>
                  <Text style={{marginLeft:6}}>
                    客服电话
                  </Text>
                </View>
              </View>

              <View style={[css.recordCellFixed,{alignItems:'flex-end',marginRight:10,}]}>
                <View style={css.newRow}>
                  <Text style={[{marginLeft:6},this.props.fontClass]}>
                    400-8710-088
                  </Text>
                  <Image style={[css.iconSize]}
                    source={require('image!arrow_right_grey')} />
                </View>
              </View>
            </View>
          </TouchableHighlight>
      </View>
    );
  }
});

var css = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:70,
    marginLeft: 2,
    marginRight: 2,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  welcome: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'left',
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 18,
    marginRight: 18,
  },
  instructions: {
    fontSize: 11,
    fontWeight: '100',
    textAlign: 'left',
    color: '#333333',
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 18,
    marginRight: 18,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b2b2b2',
    backgroundColor: '#F5FCFF',
  },
  logo :{
    marginTop : 6,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']-10,
  },
  recordRow : {
    flexDirection: 'row',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    backgroundColor: '#F5FCFF',
    width: Util.size['width'],
  },
  newRow : {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
  },
  recordCell: {
    flex:1,
    height: 36,
    justifyContent : 'center'
  },
  recordCellFixed: {
    flex: 1,
    height: 36,
    justifyContent : 'center'
  },
  iconSize: {
    marginRight: -6,
    height:20,
    width:20,
    resizeMode: Image.resizeMode.contain,
  },
});
