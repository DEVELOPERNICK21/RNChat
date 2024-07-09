import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import AuthNavigation from './AuthNavigation'
import MemberNavigator from './MemberNavigator'
import auth from '@react-native-firebase/auth';

const index = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
 async function onAuthStateChanged(user) {
    setUser(user);
    console.log(user, 'USER')
    
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null; // Optionally add a splash screen

  return (
    <NavigationContainer>
      {user ?
        <MemberNavigator />
        :
        <AuthNavigation />
      }
    </NavigationContainer>
  )
}

export default index
