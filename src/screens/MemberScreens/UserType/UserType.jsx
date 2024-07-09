import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AdvisorType_Icon, ArrowWhite_Icon, MemberType_Icon } from '../../../res/icons';
import { height, width } from '../../../res/string';
import { colors } from '../../../res/color';
import fonts from '../../../res/fonts';
import { useNavigation } from '@react-navigation/native';
import ScreenConstants from '../../../Navigators/ScreenConstants';

const UserType = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.UserTypeWrapper}>
      <View style={styles.iconStyle}>
        <ArrowWhite_Icon height={width / 14} width={width / 14} />
      </View>
      <View style={styles.bottomWrapper}>
        <Text style={styles.HeadingStyle}>Welcome to VL Bank</Text>
        <Text style={styles.SubHeadingStyle}>
          Lorem ipsum dolor sit amet, consectetu adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn
        </Text>
        <View style={styles.userIcons}>
          <Pressable style={styles.userIconWithName} onPress={() => navigation.navigate(ScreenConstants.SIGN_IN_MEMBER_SCREEN)}>
            <MemberType_Icon height={width / 3} width={width / 3} />
            <Text style={styles.IconText}>Member</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default UserType;

const styles = StyleSheet.create({
  UserTypeWrapper: {
    backgroundColor: colors.white,
    flex: 1,
  },
  iconStyle: {
    height: height / 2.5,
  },
  bottomWrapper: {
    flex: 1,
    paddingHorizontal: width / 20,
  },
  HeadingStyle: {
    color: colors.primaryColor,
    fontFamily: fonts.PoppinsBold,
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  IconText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsMedium,
    color: colors.black,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: width / 20,
  },
  SubHeadingStyle: {
    color: colors.black,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  userIcons: {
    height: '50%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  userIconWithName: {
    marginTop: width / 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
