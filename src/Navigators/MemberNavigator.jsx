import React from 'react';
import {
    createStackNavigator,
    CardStyleInterpolators,
} from '@react-navigation/stack';
import { Easing } from 'react-native';
import ScreenConstants from './ScreenConstants';
import { ChatScreen, HomeMemberScreen, NewChatRoom } from '../screens';

const Stack = createStackNavigator();

const MemberNavigator = () => {
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
                // headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                transitionSpec: {
                    open: config,
                    close: closeConfig,
                },
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
        >
            <Stack.Screen name={ScreenConstants?.HOME_MEMBER_SCREEN} component={HomeMemberScreen}   options={{ headerShown: false, title: '' }} />
            <Stack.Screen name={ScreenConstants?.CHAT_SCREEN} component={ChatScreen}   options={{ headerShown: false, title: '' }} />
            <Stack.Screen name={ScreenConstants?.NEW_CHAT_ROOM_SCREEN} component={NewChatRoom}   options={{ headerShown: false, title: '' }} />
        </Stack.Navigator>
    );
};
export default MemberNavigator;
