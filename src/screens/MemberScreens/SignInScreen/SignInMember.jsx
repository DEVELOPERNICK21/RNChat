import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../res/color';
import { height, width } from '../../../res/string';
import { BlackArrowBack_Icon, Lock_Icon, PassEye_Icon, SignIn_Icon, User_Icon } from '../../../res/icons';
import CustomTextInput from '../../../component/CustomTextInput';
import fonts from '../../../res/fonts';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import ScreenConstants from '../../../Navigators/ScreenConstants';
import CustomButton from '../../../component/CustomButton';
import { signIn } from '../../../helper/AuthService';
import { storeUserData } from '../../../utils/asynstorage';
import { storeUserDetails } from '../../../redux/actions/users';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';


const SignInMember = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  const handleSignIn = async () => {
    // console.log('Inside Login')
    // const result = await signIn(email, password);
    // if (result.success) {
    //   console.log(result, 'Error')
    //   navigation.navigate(ScreenConstants?.SIGN_UP_SCREEN); // Navigate to home or main screen on success
    // } else {
    //   setErrorMessage(result.error);
    //   console.log(result, 'Error')
    // }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log(user,  'CHECK User')
       // Store user details in Redux and AsyncStorage
    dispatch(storeUserDetails(user));
    await storeUserData(user);
   
      const userDetails = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
      
     
      // navigation.navigate(ScreenConstants?.SIGN_UP_S CREEN);
    } catch (error) {
      console.error(error);
    }
  };

  const navigation = useNavigation();

  // Define the data for userId input
  const userIdData = {
    title: 'Email Id',
    palceHolderText: 'Enter your Email Id',
    FirstIcon: User_Icon,
    inputValue: email,
    changedText: (text) => setEmail(text),
  };

  // Define the data for password input
  const passwordData = {
    title: 'Password',
    palceHolderText: 'Enter your Password',
    FirstIcon: Lock_Icon,
    SecondIcon: PassEye_Icon,
    inputValue: password,
    actionSecond: () => setShowPassword(!showPassword),
    changedText: (text) => setPassword(text),
    isPassword: showPassword,
  };

  // Define the data for button
  const buttonData = {
    buttonTitle: 'Sign In',
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.iconWrapperBack} onPress={() => navigation.goBack()}>
        <BlackArrowBack_Icon height={width / 16} width={width / 16} />
      </Pressable>
      <View style={styles.iconWrapper}>
        <SignIn_Icon height={height / 6} width={width/1.2} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.subHeading}>
          Sign in to your account to chat with ease.
        </Text>
        <CustomTextInput inputData={userIdData} />
        <CustomTextInput inputData={passwordData} />
        <Pressable style={styles.forgotPassView} onPress={() => navigation.navigate(ScreenConstants.FORGOT_PASSWORD_SCREEN)}>
          <Text style={styles.forgotPassText}>Forgot Password?</Text>
        </Pressable>
        <View style={styles?.SignUp} >
          <Text style={styles?.signUpMain}  >Don't have an account?  </Text>
            <Pressable style={styles?.PressableSignUp} onPress={() => {navigation?.navigate(ScreenConstants?.SIGN_UP_SCREEN)}} >
              <Text style={styles?.signUpMain} >
                Sign Up
              </Text>
            </Pressable>
        
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <CustomButton buttonTitle={buttonData.buttonTitle} onPress={() => (handleSignIn())} />
      </View>
    </View>
  );
};

export default SignInMember;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.screenBackColor,
    height: height,
    paddingHorizontal: width / 16,
    paddingVertical: width / 25,
  },
  iconWrapper: {
    marginBottom: 20,
    marginVertical: width / 10,
  },
  iconWrapperBack: {
    width: width / 12,
  },
  textWrapper: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  SignUp: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center'
  },
  PressableSignUp: {
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center'
  },
  signUpMain: {
    fontSize: 12,
    fontFamily: fonts.PoppinsSemiBold,
    color: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  heading: {
    fontSize: 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: colors.black,
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 20,
    fontFamily: fonts.PoppinsRegular,
    width: '85%',
    textAlign: 'center',
    lineHeight: 18,
  },
  forgotPassView: {
    width: '100%',
  },
  forgotPassText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: 12,
    width: '100%',
    textAlign: 'right',
    marginBottom: width / 50,
  },
});
