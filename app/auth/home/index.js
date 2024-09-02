import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../../components/Head/header'; 
import HomeScreenContent from '../../../components/Contents/HomeScreen'; 
import Head from '../../../components/Head/head'; 
import CartScreenContent from '../../../components/Contents/CartScreen'; 
import Top from '../../../components/Head/top';
import ProfileScreenContent from '../../../components/Contents/ProfileScreen';
import Up from '../../../components/Head/up';
import MessageScreenContent from '../../../components/Contents/MessageScreen'; 

// Home Screen Component
function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <HomeScreenContent />
    </View>
  );
}


function CartScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Head />
      <CartScreenContent />  
    </View>
  );
}


function ProfileScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Top />
      <ProfileScreenContent />
    </View>
  );
}


function MessageScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
 <Up />
 <MessageScreenContent />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Messages') {
            iconName = 'message'; 
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#069906', 
        tabBarInactiveTintColor: 'gray',
       
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
