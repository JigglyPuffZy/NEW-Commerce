import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the arrow icon
import { useNavigation } from '@react-navigation/native';

export default function ProductScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={32} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
      
      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' }}
            style={styles.image}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>Banga</Text>
          <Text style={styles.brand}>Kainan ng Aso</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★★★★★</Text>
            <Text style={styles.ratingCount}>(10)</Text>
          </View>
          <Text style={styles.price}>₱125</Text>
          <Text style={styles.description}>
            This is a traditional, handmade earthenware jar or pot. It is likely used for storage or as a decorative piece. Its dark brown color and simple design give it a rustic and antique appearance.
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>ADD TO CART</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buyNowButton}>
              <Text style={styles.buttonText}>BUY NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageSellerButton}>
              <Text style={styles.buttonText}>MESSAGE SELLER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 16,
    backgroundColor: '#069906', // Header background color
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    bottom: -20,
    left: -10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#ffffff', 
    bottom: -18,
    left: -80,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%', // Ensure the container takes full width
  },
  image: {
    width: '100%', // Make the image fit the width of the container
    height: undefined, // Remove the fixed height
    aspectRatio: 1, // Maintain the aspect ratio of the image
    borderRadius: 12,
    resizeMode: 'contain', // Ensure the image fits within the width while maintaining aspect ratio
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: width - 32,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rating: {
    color: '#fbbf24',
    fontSize: 18,
  },
  ratingCount: {
    marginLeft: 6,
    color: '#6b7280',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#069906', // Button color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: -10,
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  buyNowButton: {
    backgroundColor: '#069906', // Button color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  messageSellerButton: {
    backgroundColor: '#069906', // Button color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
