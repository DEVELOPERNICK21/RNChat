import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomButton from '../../../component/CustomButton';
import { colors } from '../../../res/color';
import { height, width } from '../../../res/string';

const UserSelectionModal = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const currentUser = auth().currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const userSnapshot = await firestore().collection('Users').get();
      const userList = userSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(user => user.id !== currentUser.uid); // Exclude the current user
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter(id => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const createChatRoom = async () => {
    if (selectedUsers.length > 0 && groupName.trim() !== '') {
      const roomRef = await firestore().collection('chatRooms').add({
        name: groupName,
        createdAt: firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
        admin: currentUser.uid,
        users: [currentUser.uid, ...selectedUsers],
      });

      const batch = firestore().batch();
      selectedUsers.forEach(userId => {
        batch.set(firestore().collection('chatRooms').doc(roomRef.id).collection('users').doc(userId), {
          userId,
        });
      });
      batch.set(firestore().collection('chatRooms').doc(roomRef.id).collection('users').doc(currentUser.uid), {
        userId: currentUser.uid,
      });
      await batch.commit();

      onClose();
    }
  };

  return (
    <View style={styles.modalView}>
      <Text>Enter Group Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <Text>Select Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleSelectUser(item.id)}
            style={[
              styles.userItem,
              selectedUsers.includes(item.id) && styles.selectedUserItem,
            ]}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* <Button title="Create Chat Room" onPress={createChatRoom} /> */}
      <CustomButton buttonTitle={'Create'} onPress={() => (createChatRoom())} />
      <CustomButton buttonTitle={'Close'} onPress={() => (onClose())} />

      {/* <Button title="Close" onPress={onClose} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    height: height / 1.2,
    margin: 20,
    padding: 35,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  userItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: colors?.pastelOne,
    borderRadius: 5,
    width: width /1.5,
    color: colors?.white
  },
  selectedUserItem: {
    width: width /1.5,
    backgroundColor: '#d3d3d3',
    color: colors?.white

  },
});

export default UserSelectionModal;
