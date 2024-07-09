import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, Button, View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useSelector(state => state.userDetails);
  const route = useRoute();
  const { userId, userName } = route.params;


  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(userId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc?.createdAt ? doc?.createdAt.toDate() : new Date(), // Handle null values
          user: doc.data().user,
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, [userId]);

  const handleSend = async () => {
    if (message.length > 0) {
      await firestore().collection('chats').doc(userId).collection('messages').add({
        text: message,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          _id: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      });
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chattingWith}>Chatting with {userName}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.user}>{item.user.displayName || item.user.email}</Text>
            <Text style={styles.message}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.createdAt.toString()}</Text>
          </View>
        )}
        keyExtractor={item => item._id}
        inverted
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  chattingWith: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageContainer: {
    marginVertical: 8,
  },
  user: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default ChatScreen;
