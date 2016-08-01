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

RCT_EXPORT_METHOD(addEvent:(NSString *)weixinPay jsUser:(NSDictionary *)jsUser money:(int)money)
{
  if (jsUser != NULL && money!= 0) {
    NSNumber *userType = [jsUser valueForKey:@"user_type"];
    NSString *userPhone = [jsUser objectForKey:@"user_phone"];
    
    if ([userType isEqual: @1]) {
      NSLog(@"充值用户: %@,充值金额: %i", userPhone, money);
    }
  }
}

@end
