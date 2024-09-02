import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Content from './../../../components/sellerhome/content';
import Body from './../../../components/sellerprofile/body';
import Head from './../../../components/sellerprofile/head';

// Placeholder Message Screen Component
function MessageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContent}>
        <Text style={styles.screenText}>Message Screen</Text>
      </View>
    </SafeAreaView>
  );
}

// Home Screen Component
function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContent}>
        <Content />
      </View>
    </SafeAreaView>
  );
}

// Profile Screen Component
function ProfileScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContent}>
        <Head />
        <Body />
      </View>
    </SafeAreaView>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            case 'Message':
              iconName = 'message';
              break;
            default:
              iconName = 'home';
              break;
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', // Fresh green for active tab
        tabBarInactiveTintColor: '#B0B0B0', // Subtle grey for inactive tabs
        tabBarStyle: {
          backgroundColor: '#ffffff', // Clean white background for the tab bar
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          elevation: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#ffffff', // Clean white background for header
          borderBottomWidth: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          color: '#333333', // Dark grey for header text
          fontWeight: 'bold',
          fontSize: 22,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background for the whole screen
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  screenText: {
    fontSize: 20,
    color: '#333333', // Consistent color for text
    fontWeight: '500',
  },
});
