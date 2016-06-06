'use strict';

import React from 'react';
import ReactNative from 'react-native';
import Store from 'react-native-simple-store';

var {
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
} = ReactNative;

import Util from '../../Common/Util';
import * as net from './../../Network/Interface';

module.exports = React.createClass({
  getInitialState() {
    return {
      rangeList: [],
    };
  },
  //只调用一次，在render之后调用
  componentDidMount() {
    // 方案数据
    this.fetchRangeData();
  },
  // 拉取方案区间数据
  fetchRangeData() {
    // 需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        Util.get(net.planApi.plan, token,
        ({code, msg, result})=>{
          if (code === 1) {
            // console.log(result.rangeList)
            // console.log(r.range_name + '->' + (r.rangeSaleLimit-r.rangeSaled));
            let ranges = [];
            result.rangeList.map(function (r, key) {
              ranges.push({
                title: r.range_name,
                render: function() {
                  return (
                    <Text>
                      The text should wrap if it goes on multiple lines. See, this is going to
                      the next line.
                    </Text>
                  );
                },
              });
            })
            this.setState({
              rangeList: ranges
            });
          }
          else if (code === 0) {
            AlertIOS.alert('提示消息', null,[
              {text: msg, onPress: () => console.log('Foo Pressed!')},
            ])
          }
          else if (code === 3) {
            AlertIOS.alert('提示消息', null,[
              {text: msg, onPress: () => console.log('Foo Pressed!')},
            ])
          }
        },
        (e)=>{
          console.error(e);
        });
      }
    });
  },
  getBlock: function(example: Example, i) {
    var {title, platform} = example;
    if (platform) {
      if (Platform.OS !== platform) {
        return null;
      }
    }
    var originalRender = React.render;
    var originalIOSRender = ReactNative.render;
    var renderedComponent;
    (React: Object).render =
    (ReactNative: Object).render =
      function(element, container) {
        renderedComponent = element;
      };
    var result = example.render(null);
    if (result) {
      renderedComponent = React.cloneElement(result, {
        navigator: this.props.navigator,
      });
    }
    (React: Object).render = originalRender;
    (ReactNative: Object).render = originalIOSRender;
    return (
      <View style={styles.container} key={i}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {title}
          </Text>
        </View>
        <View style={styles.children}>
          {renderedComponent}
        </View>
      </View>
    );
  },

  render: function() {
    var ContentWrapper;
    var wrapperProps = {};
    if (this.props.noScroll) {
      ContentWrapper = (View: ReactClass<any>);
    } else {
      ContentWrapper = (ScrollView: ReactClass<any>);
      wrapperProps.keyboardShouldPersistTaps = true;
      wrapperProps.keyboardDismissMode = 'interactive';
    }
    var spacer = this.props.noSpacer ? null : <View style={styles.spacer} />;
    return (
      <ContentWrapper
        style={styles.wrapper}
        {...wrapperProps}>
          {this.state.rangeList.map(this.getBlock)}
          {spacer}
      </ContentWrapper>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    margin: 2,
    marginVertical: 1,
    overflow: 'hidden',
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 2.5,
    borderBottomColor: '#d6d7da',
    backgroundColor: '#f6f7f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  children: {
    margin: 10,
  },
  page: {
    backgroundColor: '#e9eaed',
    flex: 1,
  },
  spacer: {
    height: 270,
  },
  wrapper: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 10,
    marginBottom: 0,
    height: 45,
    padding: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 19,
    fontWeight: '500',
  },
});
