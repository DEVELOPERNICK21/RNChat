
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUp = async (name, email, password) => {
  try {
    // Create a new user with email and password
    await auth().createUserWithEmailAndPassword(email, password);
    
    // Get the current user
    const user = auth().currentUser;

    // Create a user document in Firestore with additional fields
    await firestore().collection('Users').doc(user.uid).set({
      name,
      email,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    // Sign in with email and password
    await auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
