import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const router = useRouter(); // Use useRouter hook

  const items = [
    { id: 1, name: "Banga", price: 67.00, originalPrice: 77.00 },
    { id: 2, name: "Banga", price: 46.00, originalPrice: 65.00 },
  ];

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.price, 0);
  const subtotal = calculateSubtotal();
  const shippingFee = 50.00;
  const total = subtotal + shippingFee;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Back button pressed');
              router.back(); // Use router.back() to go back
            }} 
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={24} color="#069906" />
          </TouchableOpacity>
          <Text style={styles.header}>Checkout</Text>
        </View>

        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Delivery Address</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.mutedText}>Address</Text>
            <Text style={styles.boldText}>Sally Gatan</Text>
            <Text>Purok 6, Mozzozzin sur, Santa Maria Isabela</Text>
            <Text>Mobile: +96-012 3445 44</Text>
            <TouchableOpacity onPress={() => router.push('auth/addressselection')}>
              <Text style={styles.linkText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping List Section */}
        <Text style={styles.subHeader}>Shopping List</Text>
        {items.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <Image
              source={{ uri: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.boldText}>{item.name}</Text>
              <Text style={styles.mutedText}>Variation: {item.name.includes('Banga') ? 'Kainan ng Aso' : 'Kainan ng Pusa'}</Text>
              <Text style={styles.boldText}>
                ₱{item.price.toFixed(2)} <Text style={styles.lineThrough}>₱{item.originalPrice.toFixed(2)}</Text>
              </Text>
            </View>
          </View>
        ))}
        <Text style={styles.mutedText}>Total Order ({items.length}):  ₱{subtotal.toFixed(2)}</Text>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'COD' && styles.paymentMethodButtonSelected
              ]}
              onPress={() => setSelectedPaymentMethod('COD')}
            >
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'COD' && styles.paymentMethodTextSelected
              ]}>Cash on Delivery (COD)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'GCash' && styles.paymentMethodButtonSelected
              ]}
              onPress={() => setSelectedPaymentMethod('GCash')}
            >
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'GCash' && styles.paymentMethodTextSelected
              ]}>GCash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <Text style={styles.mutedText}>Subtotal:</Text>
            <Text style={styles.mutedText}>₱{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.mutedText}>Shipping Fee:</Text>
            <Text style={styles.mutedText}>₱{shippingFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.boldText}>Total:</Text>
            <Text style={styles.boldText}>₱{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => router.push('auth/pay')} // Navigate to the payment page
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 16,
    marginRight: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    right: 40,
  },
  section: {
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
  },
  mutedText: {
    color: '#6c757d',
  },
  boldText: {
    fontWeight: '600',
  },
  linkText: {
    color: '#007bff',
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  lineThrough: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paymentMethodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  paymentMethodButtonSelected: {
    backgroundColor: '#28a745',
  },
  paymentMethodText: {
    color: '#6c757d',
    fontWeight: '600',
  },
  paymentMethodTextSelected: {
    color: '#fff',
  },
  summarySection: {
    marginTop: 'auto',
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
