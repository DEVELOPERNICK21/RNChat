import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnBoardingData } from './OnBoardingData';
import { colors } from '../../../res/color';
import fonts from '../../../res/fonts';
import ScreenConstants from '../../../Navigators/ScreenConstants';
import { ArrowWhite_Icon } from '../../../res/icons';
import { height, width } from '../../../res/string';

const OnBoarding = () => {
  const flatListRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();

  const ButtonData = {
    Title: OnBoardingData.length - 1 === currentSlide ? 'GET STARTED' : 'NEXT',
    onClick: () => {
      currentSlide === 2
        ? navigation.navigate(ScreenConstants.SIGN_IN_MEMBER_SCREEN)
        : handleNextPress();
    },
  };

  const handleNextPress = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentSlide + 1 });
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleBackPress = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentSlide - 1 });
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkipPress = () => {
    navigation.navigate(ScreenConstants.SIGN_IN_MEMBER_SCREEN);
  };

  return (
    <View style={styles.OnBoardingWrapper}>
      <View style={styles.FlatListWrapper}>
        <FlatList
          horizontal
          ref={flatListRef}
          showsHorizontalScrollIndicator={false}
          data={OnBoardingData}
          pagingEnabled
          renderItem={({ item }) => (
            <View style={styles.ContentWrapper}>
              <item.Icon height={height / 2.5} width={width} />
              <View style={styles.TextWrap}>
                <Text style={styles.HeadingStyle}>{item.Heading}</Text>
                <Text style={styles.SubHeadingStyle}>{item.SubHeading}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          onScroll={(event) => {
            const slideWidth = event.nativeEvent.layoutMeasurement.width;
            const currentIndex = event.nativeEvent.contentOffset.x / slideWidth;
            setCurrentSlide(Math.floor(currentIndex));
          }}
        />
      </View>
      <View style={styles.PaginatorArea}>
        {currentSlide === 2 ? null : (
          <Pressable
            style={styles.crossStyle}
            onPress={handleSkipPress}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
        {OnBoardingData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.InactiveDot,
              index === currentSlide && styles.ActiveDot,
            ]}
          />
        ))}
        <Pressable
          style={styles.FloatArrow}
          onPress={ButtonData.onClick}
        >
          <ArrowWhite_Icon height={width / 14} width={width / 14} />
        </Pressable>
      </View>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  OnBoardingWrapper: {
    backgroundColor: colors.white,
    height: height,
  },
  FlatListWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 1.5,
  },
  ContentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    textAlign: 'center',
    marginTop: width / 5,
  },
  TextWrap: {
    width: '80%',
    textAlign: 'center',
  },
  HeadingStyle: {
    color: colors.primaryColor,
    fontFamily: fonts.PoppinsBold,
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  SubHeadingStyle: {
    color: colors.black,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    textAlign: 'center',
  },
  skipText: {
    color: colors.black,
    fontFamily: fonts.PoppinsMedium,
    fontSize: 14,
    textAlign: 'center',
  },
  PaginatorArea: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: height - height / 1.5,
    width: width,
  },
  InactiveDot: {
    backgroundColor: colors.lightPrimaryColor,
    height: width / 40,
    width: width / 40,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ActiveDot: {
    backgroundColor: colors.primaryColor,
    height: width / 40,
    width: width / 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossStyle: {
    position: 'absolute',
    left: width / 20,
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FloatArrow: {
    backgroundColor: colors.primaryColor,
    position: 'absolute',
    height: width / 8,
    width: width / 8,
    right: width / 20,
    borderRadius: width,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
