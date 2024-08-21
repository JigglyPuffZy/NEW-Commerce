import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function OrderHistory() {
  const navigation = useNavigation();

  const orders = [
    {
      id: '1',
      image: 'https://media.karousell.com/media/photos/products/2020/9/9/small_ceramic_banga_vase_1599626824_c283af27_progressive.jpg',
      name: 'Product 1',
      status: 'Delivered',
      date: 'Aug 17, 2024',
      price: '₱20.00',
    },
    {
      id: '2',
      image: 'https://media.karousell.com/media/photos/products/2020/9/9/small_ceramic_banga_vase_1599626824_c283af27_progressive.jpg',
      name: 'Product 2',
      status: 'Cancelled',
      date: 'Aug 16, 2024',
      price: '₱35.00',
    },
    // Add more orders as needed
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order History</Text>
      </View>

      <ScrollView>
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <Image source={{ uri: order.image }} style={styles.productImage} />
            <View style={styles.orderDetails}>
              <Text style={styles.productName}>{order.name}</Text>
              <Text style={styles.orderStatus}>{order.status}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
              <Text style={styles.productPrice}>{order.price}</Text>
            </View>
            <TouchableOpacity style={styles.arrowIcon}>
              <FontAwesome5 name="chevron-right" size={16} color="#333" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#069906',
    padding: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#f39c12',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    padding: 10,
  },
});
