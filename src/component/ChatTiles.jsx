import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { height, width } from '../res/string'
import images from '../res/images'
import { useNavigation } from '@react-navigation/native'
import ScreenConstants from '../Navigators/ScreenConstants'

const ChatTiles = ({name, onPress,lastMessage,time}) => {
  const navigation = useNavigation();

  return (
    <Pressable style={styles?.chatTileWrapper} onPress={() => onPress() } >
    <View style={styles?.profileArea} >
       <Image source={images?.userDummy}  style={styles?.imageStyling} />
    </View>
       <View>
        <Text>{name}</Text>
        <Text>{lastMessage}</Text>
        <Text>Time</Text>
       </View>
    </Pressable>
  )
}

export default ChatTiles

const styles = StyleSheet.create({
    chatTileWrapper : {
        height: height / 10,
        width:  '100%',
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        justifyContent: 'sapce-between',
        alignItems: 'center',
        marginVertical: width /100,
        borderRadius: width  /30,
    },
    profileArea : {
       height: height /15,
       width: height /15,
       backgroundColor: 'green',
       borderRadius: width,
       marginHorizontal: width / 30,
    },
    imageStyling : {
       height: '100%',
       width: '100%',
    }
})