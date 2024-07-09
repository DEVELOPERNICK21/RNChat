import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { removeUserData } from '../../../utils/asynstorage';
import { setLogOut } from '../../../redux/actions/users';
import ScreenConstants from '../../../Navigators/ScreenConstants';
import { colors } from '../../../res/color';
import UserSelectionModal from './UserSelectionModal';
import images from '../../../res/images';
import { height, width } from '../../../res/string';

const HomeMemberScreen = () => {
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  
  const { user } = useSelector(state => state.userDetails);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchChatRooms = async () => {
    try {
      const chatRoomsSnapshot = await firestore()
        .collection('chatRooms')
        .where('users', 'array-contains', auth().currentUser.uid)
        .get();

      const chatRoomsList = await Promise.all(chatRoomsSnapshot.docs.map(async (doc) => {
        const chatRoom = doc.data();
        const lastMessageSnapshot = await firestore()
          .collection('chatRooms')
          .doc(doc.id)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        const lastMessage = lastMessageSnapshot.docs[0]?.data() || {};
        return { ...chatRoom, id: doc.id, lastMessage };
      }));

      setChatRooms(chatRoomsList);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const fetchUsers = async () => {
    if (!user || !user.uid) return;

    const unsubscribeUsers = firestore()
      .collection('Users')
      .onSnapshot((querySnapshot) => {
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).filter(u => u.id !== user.uid); // Filter out the current user

        setUsers(usersList);
      });

    return () => unsubscribeUsers();
  };

  const fetchMessages = async () => {
    if (!user || !user.uid) return;

    const unsubscribeMessages = firestore()
      .collection('Messages')
      .where('chatUsers', 'array-contains', user.uid)
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => doc.data());
        const lastMessages = {};

        messages.forEach(msg => {
          if (!lastMessages[msg.senderId] || msg.createdAt > lastMessages[msg.senderId].createdAt) {
            lastMessages[msg.senderId] = msg;
          }
        });

        setLastMessages(lastMessages);
      });

    return () => unsubscribeMessages();
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      dispatch(setLogOut());
      await removeUserData();
      navigation.navigate(ScreenConstants?.SIGN_IN_MEMBER_SCREEN);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
      fetchUsers();
      fetchMessages();
    }, [user])
  );
  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
      fetchUsers();
      fetchMessages();
    }, [modalVisible])
  );

  const handleChatPress = (user) => {
    navigation.navigate(ScreenConstants?.CHAT_SCREEN, { userId: user.id, userName: user.displayName || user.email });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(ScreenConstants?.NEW_CHAT_ROOM_SCREEN, { roomId: item.id })}>
      <View style={styles.chatRoomItem}>
        <Text>{item.name}</Text>
        <Text style={styles.lastMessageText}>
          {item.lastMessage.text ? `${item.lastMessage.userName || 'Unknown'}: ${item.lastMessage.text}` : 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.homeMemeberWrapper}>
      <View style={styles.ProfileArea}>
        <View style={styles.profileArea}>
          <Image source={images?.userDummy} style={styles.imageStyling} />
        </View>
        <Text style={styles.uperText}>{user?.email}</Text>
        <Pressable onPress={signOut}>
          <Text style={styles.uperText}>Sign Out</Text>
        </Pressable>
      </View>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Pressable style={styles.FloatButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.FloatText}> Create Group Chat +</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <UserSelectionModal onClose={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
}

export default HomeMemberScreen;

const styles = StyleSheet.create({
  homeMemeberWrapper: {
    borderRadius: width,
    flex: 1,
  },
  profileArea: {
    height: height / 15,
    width: height / 15,
    backgroundColor: 'green',
    borderRadius: width,
    marginHorizontal: width / 30,
  },
  imageStyling: {
    height: '100%',
    width: '100%',
  },
  ProfileArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors?.primaryColor,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  FloatButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: width / 20,
    backgroundColor: colors?.pastelOne,
    borderRadius: width / 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uperText: {
    fontSize: 16,
    color: colors?.white,
  },
  FloatText: {
    fontSize: 20,
    color: colors?.white,
  },
  chatRoomItem: {
    padding: 10,
    paddingVertical: 15,
    marginVertical: 5,
    backgroundColor: colors?.pastelOne,
    marginVertical: 5,
    // marginHorizontal: 15,
    borderRadius: 5,
  },
});
