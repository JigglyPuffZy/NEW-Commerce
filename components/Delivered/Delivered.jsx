import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window'); // Get the screen width

const AllOrdersPage = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const sellerId = userData ? userData.id : null;

   const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null); // To store image URI

 // Fetch orders from the PHP backend
 useEffect(() => {
  if (sellerId) {
    fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_completed_orders.php?sellerId=${sellerId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Error: Invalid data format or empty data");
        }
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }
}, [sellerId]);

  const handleOrderClick = (order) => {
    if (order.status === 'Delivered') {
      setSelectedOrder(order);
      setIsImagePickerVisible(false); // No image picker needed since the order is delivered
    }
  };

 

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderClick(item)}
    >
      {item.product_name && item.imagesPath && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image
              source={{
                uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${item.imagesPath.split(',')[0]}`,
              }}
              style={{ width: 40, height: 40, marginRight: 10 }}
            />
            {/* <Text style={{ fontWeight: 'bold' }}>{item.product_name}</Text> */}
          </View>
        )}
      <View style={styles.orderDetails}>
        <View style={styles.row}>
        <Ionicons
            name="checkmark-circle"
            size={22}
            color="#4CAF50"
            style={styles.icon}
          />
          <Text
            style={[styles.status, {
              color: '#4CAF50',
            }]}
          >
            {item.order_status === '3' ? 'Delivered' : 'Accepted'}
          </Text>
        </View>
        <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
            <Text style={styles.productName}>Product: {item.product_name}</Text>
            <Text style={styles.orderDate}>Date: {item.order_date}</Text>
            <Text style={styles.totalPrice}>Total: ₱{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Modal for Delivered Orders */}
      {isImagePickerVisible && (
        <Modal visible={true} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Choose a picture to confirm delivery</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={openImagePicker}
              >
                <Text style={styles.detailsButtonText}>Pick an Image</Text>
              </TouchableOpacity>

              {/* Show selected image preview */}
              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <Text style={styles.previewText}>Selected Image:</Text>
                  <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                </View>
              ) : (
                <Text>No image selected</Text> 
              )}

              {/* Send button */}
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={handleSend}
                disabled={!imageUri} // Disable button if no image is selected
              >
                <Text style={styles.detailsButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  listContainer: {
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: width - 32,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  orderId: {
    fontSize: 14,
    color: '#777',
  },
  orderDate: {
    fontSize: 12,
    color: '#777',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#069906',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  detailsButton: {
    backgroundColor: '#069906',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  previewText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default AllOrdersPage;