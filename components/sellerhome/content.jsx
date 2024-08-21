import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Ensure correct import

export default function SellerDashboard() {
  const router = useRouter(); // Initialize useRouter

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Seller Dashboard</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <TouchableOpacity 
    
              style={styles.card}
          >
            <Text style={styles.cardTitle}>Overview</Text>
            <Text style={styles.cardValue}>Sales: $2,500</Text>
            <Text style={styles.cardValue}>Orders: 150</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <Text style={styles.cardValue}>Order #12345</Text>
            <Text style={styles.cardValue}>Order #12346</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Manage Listings</Text>
            <Text style={styles.cardValue}>Add New Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardValue}>Profile</Text>
            <Text style={styles.cardValue}>Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 80, // Adjust for header height
  },
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
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 20, // Ensure there's space at the bottom
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '48%',
    elevation: 3, // Adds a shadow effect for Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.1, // For iOS
    shadowRadius: 2, // For iOS
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
  },
  contentContainer: {
    paddingHorizontal: 10, // Added for consistency with cardContainer
  },
});
``
