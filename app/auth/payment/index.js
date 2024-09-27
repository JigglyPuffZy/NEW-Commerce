import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        <Text style={styles.mutedText}>Total Order ({items.length}): ₱{subtotal.toFixed(2)}</Text>

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
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Checkout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to checkout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  router.push('auth/pay');
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    // Removed background color to have a transparent header
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745', // Optional: Change text color if needed
    flex: 1,
    right:10,
  },
  section: {
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  mutedText: {
    color: '#6c757d',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  linkText: {
    color: '#007bff',
    marginTop: 8,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 10,
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
    elevation: 2,
  },
  paymentMethodButtonSelected: {
    backgroundColor: '#28a745',
    elevation: 3,
  },
  paymentMethodText: {
    color: '#333',
    fontWeight: '500',
  },
  paymentMethodTextSelected: {
    color: '#fff',
  },
  summarySection: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#f7f7f7',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
