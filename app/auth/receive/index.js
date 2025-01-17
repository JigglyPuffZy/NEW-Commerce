import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ToPayScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]); // State for orders
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const buyerId = userData ? userData.id : null;

  useEffect(() => {
    // Fetch orders data
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://rancho-agripino.com/database/potteryFiles/fetch_order_status.php?order_status=2&buyerId=${buyerId}`
        );
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderReceived = (itemId) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const confirmOrderReceived = () => {
    setOrders((prevOrders) =>
      prevOrders.filter((item) => item.id !== selectedItemId)
    );
    setModalVisible(false);
  };

  const cancelOrderReceived = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>To Receive</Text>
      </View>
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: `http://localhost/pottery/product_images/${
              item.imagesPath.split(",")[0].trim()
            }`,
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.product_name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemQuantity}>Quantity: x{item.quantity_carted}</Text>
          <Text style={styles.itemPrice}>Price: {item.price}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton}>
          <FontAwesome name="envelope" size={16} color="#fff" />
          <Text style={styles.buttonText}> Contact Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.receivedButton}
          onPress={() => handleOrderReceived(item.id)}
        >
          <Text style={styles.receivedButtonText}>Order Received</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalAmount = orders.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity_carted,
    0
  );
  const itemCount = orders.reduce((count, item) => count + item.quantity_carted, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>To Receive</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Items Count:</Text>
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
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Order Received</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to mark this order as received?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={cancelOrderReceived}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={confirmOrderReceived}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#069906',
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
  },
  headerTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
    padding: 15,
    top:20,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginVertical: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#888',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33A853',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contactButton: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#069906', // Keep the background color as is
    borderRadius: 8,
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff', // Set the button text color to white
    fontSize: 16,
    fontWeight: 'bold',
  },
  receivedButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#069906', // Green color
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receivedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#069906',
  },
  summaryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#069906',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5722', // Highlight total amount
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#069906',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelModalButton: {
    backgroundColor: '#B0B0B0', // Grey color
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
