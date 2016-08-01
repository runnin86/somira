//
//  PayUtil.h
//  somira
//
//  Created by sml_design on 16/8/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"

@interface PayUtil : UIViewController<UIAlertViewDelegate, UITextFieldDelegate, RCTBridgeModule>
{
  UIAlertView* mAlert;
  UITextField *mTextField;
}

- (void)showAlertWait;
- (void)showAlertMessage:(NSString*)msg;
- (void)hideAlert;

@end
