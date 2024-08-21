import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons'; // Import the icon library
import { useRouter } from 'expo-router'; // Import useRouter hook

export default function Header() {
  const router = useRouter(); // Get the router object

  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Home</Text>
        {/* Settings Button */}
        <TouchableOpacity 
          onPress={() => router.push('/auth/settings')} 
          style={styles.settingsButton}
        >
          <Entypo name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#069906', 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 10, 
    height: 80, 
    width: '100%', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 1, 
  },
  headerContainer: {
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', // Space between text and settings button
  },
  headerText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
  },
  settingsButton: {
    position: 'absolute', 
    right: 20, 
    top: 20, 
  },
});
