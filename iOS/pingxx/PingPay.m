//
//  PayUtil.m
//  somira
//
//  Created by sml_design on 16/8/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "PingPay.h"

#include <sys/socket.h> // Per msqr
#include <sys/sysctl.h>
#include <net/if.h>
#include <net/if_dl.h>
#import "pingPay.h"
#import "AppDelegate.h"
#import "lib/Pingpp.h"

#define KBtn_width        200
#define KBtn_height       40
#define KXOffSet          (self.view.frame.size.width - KBtn_width) / 2
#define KYOffSet          20

#define kWaiting          @"正在获取支付凭据,请稍后..."
#define kNote             @"提示"
#define kConfirm          @"确定"
#define kErrorNet         @"网络错误"
#define kResult           @"支付结果：%@"

#define kPlaceHolder      @"支付金额"
#define kMaxAmount        9999999

#warning \
URL Schemes 需要在 Xcode 的 Info 标签页的 URL Types 中添加，\
需要你自定义（不能使用 "alipay", "wx", "wechat" 等等这些），首字母必须是英文字母，支持英文和数字，不建议使用特殊符号。\
如果这个不设置，可能会导致支付完成之后，无法跳转回 App 或者无法得到结果回调。\
对于微信支付来说，必须添加一项值为微信平台上注册的应用程序 id（"wx" 开头的字符串）作为 URL Scheme。
#define kUrlScheme      @"wxadccc645716a9348" // 这个是你定义的 URL Scheme，支付宝、微信支付、银联和测试模式需要。

// 你的服务端创建并返回 charge 的 URL 地址
#define kUrl            @"http://test.zcsml.com/pay/pingxxPay.do"
//#define kUrl            @"http://218.244.151.190/demo/charge"

@implementation PingPay

// 实现RCTBridgeModule协议，需要包含RCT_EXPORT_MODULE()宏
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)channel phone:(NSString *)phone money:(int)money payType:(NSString *)payType)
{
  NSLog(@"充值渠道：%@,充值用户: %@,充值金额: %i,充值方式: %@", channel, phone, money, payType);
  if (phone != NULL && money!= 0) {
    long long amount = money;
    if (amount == 0) {
      return;
    }
    NSString *amountStr = [NSString stringWithFormat:@"%lld", amount];
    NSURL* url = [NSURL URLWithString:kUrl];
    NSMutableURLRequest * postRequest=[NSMutableURLRequest requestWithURL:url];
    
    NSDictionary* dict = @{
                           @"channel" : channel,
                           @"amount"  : amountStr,
                           @"uPhone" : phone,
                           @"payType" : payType
                           };
    NSData* data = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:nil];
    NSString *bodyData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    
    [postRequest setHTTPBody:[NSData dataWithBytes:[bodyData UTF8String] length:strlen([bodyData UTF8String])]];
    [postRequest setHTTPMethod:@"POST"];
    [postRequest setValue:@"application/json; charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    
    PingPay * __weak weakSelf = self;
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [self showAlertWait];
    [NSURLConnection sendAsynchronousRequest:postRequest queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
      dispatch_async(dispatch_get_main_queue(), ^{
        NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*)response;
        [weakSelf hideAlert];
        if (httpResponse.statusCode != 200) {
          NSLog(@"statusCode=%ld error = %@", (long)httpResponse.statusCode, connectionError);
          [weakSelf showAlertMessage:kErrorNet];
          return;
        }
        if (connectionError != nil) {
          NSLog(@"error = %@", connectionError);
          [weakSelf showAlertMessage:kErrorNet];
          return;
        }
        NSString *charge = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        // 提取服务器返回的charge对象
        NSDictionary *chargeDic = [self dictionaryWithJsonString:charge];
        NSString *finalCharge = [chargeDic objectForKey:@"chargeObj"];
        
        NSLog(@"charge= %@", finalCharge);
        [Pingpp createPayment:finalCharge
               viewController:weakSelf
                 appURLScheme:kUrlScheme
               withCompletion:^(NSString *result, PingppError *error) {
                 NSLog(@"completion block: %@", result);
                 if (error == nil) {
                   NSLog(@"PingppError is nil");
                 } else {
                   NSLog(@"PingppError: code=%lu msg=%@", (unsigned  long)error.code, [error getMsg]);
                 }
                 [weakSelf showAlertMessage:result];
               }];
      });
    }];
  }
}

- (void)showAlertWait
{
  mAlert = [[UIAlertView alloc] initWithTitle:kWaiting message:nil delegate:self cancelButtonTitle:nil otherButtonTitles: nil];
  [mAlert show];
  UIActivityIndicatorView* aiv = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite];
  aiv.center = CGPointMake(mAlert.frame.size.width / 2.0f - 15, mAlert.frame.size.height / 2.0f + 10 );
  [aiv startAnimating];
  [mAlert addSubview:aiv];
}

- (void)showAlertMessage:(NSString*)msg
{
  mAlert = [[UIAlertView alloc] initWithTitle:kNote message:msg delegate:nil cancelButtonTitle:kConfirm otherButtonTitles:nil, nil];
  [mAlert show];
}

- (void)hideAlert
{
  if (mAlert != nil)
  {
    [mAlert dismissWithClickedButtonIndex:0 animated:YES];
    mAlert = nil;
  }
}

/*!
 * @brief 把格式化的JSON格式的字符串转换成字典
 * @param jsonString JSON格式的字符串
 * @return 返回字典
 */
- (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString {
  if (jsonString == nil) {
    return nil;
  }
  
  NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *err;
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                      options:NSJSONReadingMutableContainers
                                                        error:&err];
  if(err) {
    NSLog(@"json解析失败：%@",err);
    return nil;
  }
  return dic;
}

@end
