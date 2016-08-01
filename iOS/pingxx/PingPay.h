//
//  pingPay.h
//  somira
//
//  Created by sml_design on 16/7/29.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController<UIAlertViewDelegate, UITextFieldDelegate>
{
  UIAlertView* mAlert;
  UITextField *mTextField;
}

@property(nonatomic, retain)NSString *channel;
@property(nonatomic ,retain)UITextField *mTextField;

- (void)showAlertWait;
- (void)showAlertMessage:(NSString*)msg;
- (void)hideAlert;

@end
