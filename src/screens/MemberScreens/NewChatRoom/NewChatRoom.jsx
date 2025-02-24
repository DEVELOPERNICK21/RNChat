import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../../res/color';
import { BlackArrowBack_Icon } from '../../../res/icons';
import { height, width } from '../../../res/string';
import { useNavigation } from '@react-navigation/native';
import fonts from '../../../res/fonts';

const ChatRoomScreen = ({ route }) => {
  const { roomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userMap, setUserMap] = useState({});
  const [roomDetails, setRoomDetails] = useState({});
  const currentUser = auth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = firestore()
      .collection('chatRooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(querySnapshot => {
        const messagesList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setMessages(messagesList);
      });
  
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('Users').get();
        const usersMap = {};
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          usersMap[doc.id] = userData.name; // Ensure the field name matches
        });
        setUserMap(usersMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    const fetchRoomDetails = firestore()
      .collection('chatRooms')
      .doc(roomId)
      .onSnapshot(docSnapshot => {
        setRoomDetails(docSnapshot.data());
      });
  
    fetchUsers();
  
    return () => {
      fetchMessages(); // Unsubscribe from messages
      fetchRoomDetails(); // Unsubscribe from room details
    };
  }, [roomId]);
  

  const sendMessage = async () => {
    if (message.trim()) {
      await firestore().collection('chatRooms').doc(roomId).collection('messages').add({
        text: message,
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: currentUser.uid, // Store user ID
        userName: userMap[currentUser.uid] || 'Unknown', // Use `userMap` for the userName
        
      });
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === currentUser.uid;
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.messageRight : styles.messageLeft]}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        {item.createdAt && <Text style={styles.messageTime}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Pressable onPress={()  => navigation?.goBack()} style={styles?.backIcon} >
      <BlackArrowBack_Icon height={width / 12} width={width/12} />
      </Pressable>

        <Text style={styles.groupName}>{roomDetails.name}</Text>
        {/* <Text style={styles.memberCount}>{roomDetails.members?.length || 0} members</Text> */}
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        {/* <Button title="Send"  /> */}
        <Pressable onPress={sendMessage} style={styles?.buttonContainer}>
<Text style={styles?.buttonText} >Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    flexDirection:  'row',
    justifyContent: 'center'
  },
  buttonContainer: {
		marginVertical: 10,
		// width: '100%',
		height: height / 16,
		backgroundColor: colors.primaryColor,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
	},
	buttonText: {
		fontFamily: fonts.PoppinsMedium,
		width: '100%',
		textAlign: 'center',
		fontSize: 16,
		color: colors.white,
	},
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberCount: {
    fontSize: 14,
    color: '#888',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcf8c6',
},
messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: colors?.pastelOne,
  },
  userName: {
    fontWeight: 'bold',
  },
  messageText: {
    marginVertical: 5,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  backIcon: {
  position: 'absolute',
  left: width /30,
  },
});

export default ChatRoomScreen;
