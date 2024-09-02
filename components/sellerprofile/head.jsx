import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Header() {
  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Seller Profile</Text>
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
    justifyContent: 'center', 
  },
  headerText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
  },
});
