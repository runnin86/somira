//
//  PayUtil.m
//  somira
//
//  Created by sml_design on 16/8/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "PayUtil.h"

@implementation PayUtil

// 实现RCTBridgeModule协议，需要包含RCT_EXPORT_MODULE()宏
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(weixinPay)
{
  NSLog(@"再次注册的手机号码为: %@", @"进入方法");
}

@end
