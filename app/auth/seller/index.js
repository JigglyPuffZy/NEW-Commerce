import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Content from '../../../components/sellerhome/content';
import MessageScreenContent from '../../../components/sellermessage/MessageScreenContent';
import MessageHead from '../../../components/sellermessage/MessageHead';
import SellerHeader from '../../../components/sellerhome/SellerHeader';


// Home Screen Component
function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
  <SellerHeader />
      <Content />
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
      <MessageHead />
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
  
      <Tab.Screen name="Messages" component={MessageScreen} />
    
    </Tab.Navigator>
  );
}
