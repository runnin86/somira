//
//  PayUtil.h
//  somira
//
//  Created by sml_design on 16/8/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"

@interface PingPay : UIViewController<UIAlertViewDelegate, RCTBridgeModule>
{
  UIAlertView* mAlert;
}

- (void)showAlertWait;
- (void)showAlertMessage:(NSString*)msg;
- (void)hideAlert;

@end