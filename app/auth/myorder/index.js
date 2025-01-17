import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';  // Only this import is needed
import { useNavigation } from '@react-navigation/native';
// import AllOrdersScreenContent from '../../../components/Allorders/Allorders';
import PendingScreenContent from '../../../components/Pending/Pending';
import ShippedScreenContent from '../../../components/Shipped/Shipped';
import DeliveredScreenContent from '../../../components/Delivered/Delivered';
import CancelledScreenContent from '../../../components/Cancelled/Cancelled';
import AcceptedScreenContent from '../../../components/Accepted/Accepted';

function PendingOrdersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PendingScreenContent />  
    </View>
  );
}

function ShippedOrdersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ShippedScreenContent />  
    </View>
  );
}

function DeliveredOrdersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DeliveredScreenContent />  
    </View>
  );
}

function CancelledOrdersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CancelledScreenContent />  
    </View>
  );
}

function AcceptOrdersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AcceptedScreenContent />  
    </View>
  );
}

// Seller's Tab Navigator
const Tab = createBottomTabNavigator();

function SellerOrders() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // if (route.name === 'All Orders') {
          //   iconName = 'view-list';
          // }
           if (route.name === 'Pending') {
            iconName = 'hourglass-empty';
          } else if (route.name === 'Shipped') {
            iconName = 'local-shipping';
          } else if (route.name === 'Delivered') {
            iconName = 'check-circle';
          } else if (route.name === 'Accepted') {
            iconName = 'check';
          } else if (route.name === 'Cancelled') {
            iconName = 'close';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#069906', 
        tabBarInactiveTintColor: 'gray', 
        headerStyle: {
          backgroundColor: '#069906', 
        },
        headerTintColor: '#ffffff', 
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        ),
      })}
    >

      <Tab.Screen name="Pending" component={PendingOrdersScreen} />
      <Tab.Screen name="Accepted" component={AcceptOrdersScreen} />
      <Tab.Screen name="Shipped" component={ShippedOrdersScreen} />
      <Tab.Screen name="Delivered" component={DeliveredOrdersScreen} />
      <Tab.Screen name="Cancelled" component={CancelledOrdersScreen} />
      
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SellerOrders />
  );
}
