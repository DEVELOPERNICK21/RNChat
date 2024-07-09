import React from 'react';
import {
    createStackNavigator,
    CardStyleInterpolators,
} from '@react-navigation/stack';
import { Easing, Platform } from 'react-native';
import ScreenConstants from './ScreenConstants';
import { ForgotPassword, OnBoarding, OtpScreen, ResetPassword, SignInAdvisor, SignInMember, SignUpScreen, UserType } from '../screens';
import { colors } from '../res/color';

const Stack = createStackNavigator();

const AuthNavigation = () => {
    const config = {
        animation: 'timing',
        config: {
            duration: 400,
            easing: Easing.linear,
        },
    };

    const closeConfig = {
        animation: 'timing',
        config: {
            duration: 200,
            easing: Easing.linear,
        },
    };

    return (
        <Stack.Navigator
           screenOptions={{
          headerTitleAlign: Platform.OS === 'android' ? 'left' : 'center',
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerStyle: {
            backgroundColor: colors?.screenBackColor
          },
        }}
        >
            <Stack.Screen name={ScreenConstants?.ON_BOARDING_SCREEN} component={OnBoarding} />
            <Stack.Screen name={ScreenConstants?.USER_TYPE_SCREEN} component={UserType} />
            <Stack.Screen name={ScreenConstants?.SIGN_IN_MEMBER_SCREEN} component={SignInMember} />
            <Stack.Screen name={ScreenConstants?.SIGN_UP_SCREEN} component={SignUpScreen} />
            <Stack.Screen name={ScreenConstants?.FORGOT_PASSWORD_SCREEN} component={ForgotPassword} />
            <Stack.Screen name={ScreenConstants?.OTP_SCREEN} component={OtpScreen} />
            <Stack.Screen name={ScreenConstants?.RESET_PASSWORD} component={ResetPassword} />
        </Stack.Navigator>
    );
};
export default AuthNavigation;
