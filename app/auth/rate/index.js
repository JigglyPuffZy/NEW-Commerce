import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const initialPaymentData = [
  { id: '1', name: 'Item 1', price: '₱239.00', image: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg', description: 'Banga ng Aso', quantity: 4 },
  { id: '2', name: 'Item 2', price: '₱200.00', discountedPrice: '₱180.00', image: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg', description: 'Banga ng Pusa', quantity: 1 },
];

export default function ToPayScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);
  const [paymentData, setPaymentData] = useState(initialPaymentData);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>To Rate</Text>
      </View>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        </View>
      </View>
      <Text style={styles.originalPrice}>{item.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton}>
          <FontAwesome name="envelope" size={16} color="#fff" />
          <Text style={styles.buttonText}> Contact Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.rateButton} 
          onPress={() => {
            setItemToRate(item.id);
            setModalVisible(true);
          }}
        >
          <FontAwesome name="star" size={16} color="#fff" />
          <Text style={styles.buttonText}> Rate Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleRateItem = () => {
    if (itemToRate) {
      router.push('auth/rateproducts');
      setItemToRate(null);
      setModalVisible(false);
    }
  };

  const totalAmount = paymentData.reduce((total, item) => total + (parseFloat(item.price.replace('₱', '')) * item.quantity), 0);
  const itemCount = paymentData.reduce((count, item) => count + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.push('auth/home')}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>To Rate</Text>
      </View>
      <FlatList
        data={paymentData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Item Count:</Text>
          <Text style={styles.summaryValueText}>{itemCount}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Subtotal:</Text>
          <Text style={styles.summaryValueText}>₱{totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Total:</Text>
          <Text style={styles.totalText}>₱{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Enhanced Modal for Rating Confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate this product?</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to proceed?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButtonYes} onPress={handleRateItem}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </Pressable>
              <Pressable style={styles.modalButtonNo} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#069906',
    elevation: 4,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
  },
  headerTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#069906',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#888',
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33A853',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#069906',
    borderRadius: 8,
    justifyContent: 'center',
  },
  rateButton: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 20,
  },
  summaryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonYes: {
    backgroundColor: '#069906',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  modalButtonNo: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
