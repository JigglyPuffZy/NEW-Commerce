import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, Alert, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

const AllOrdersPage = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const sellerId = userData ? userData.id : null;
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (sellerId) {
      fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_toship_orders.php?sellerId=${sellerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            setOrders(data);
          }
        })
        .catch((error) => console.error('Error fetching orders:', error));
    }
  }, [sellerId]);

  const openImagePickerWeb = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        const file = files[0];
        setImageUri(URL.createObjectURL(file));
      }
    };
    input.click();
  };
  const handleOrderClick = (order) => {
    if (order.order_status === '2') {
      setSelectedOrder(order); // Set the selected order
      setIsModalVisible(true);  // Show the modal when an order is clicked
    }
  };
  
  const openImagePickerMobile = async () => {
    if (Platform.OS === 'ios') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } else if (Platform.OS === 'android') {
      Alert.alert(
        'Select Image',
        'Choose how you want to select an image',
        [
          { text: 'Choose from Library', onPress: () => launchImageLibrary({ mediaType: 'photo' }, (response) => response.assets && setImageUri(response.assets[0].uri)) },
          { text: 'Take Photo', onPress: () => launchCamera({ mediaType: 'photo' }, (response) => response.assets && setImageUri(response.assets[0].uri)) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const openImagePicker = async () => {
    if (Platform.OS === 'web') {
      openImagePickerWeb();
    } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
      openImagePickerMobile();
    }
  };

  const handleSend = async () => {
    if (!imageUri || !selectedOrder) {
      Alert.alert('Error', 'Please select an image before submitting.');
      return;
    }

    // Create a file object from the imageUri
  const image = {
    uri: imageUri,
    name: `order_${selectedOrder.order_id}.jpg`,
    type: 'image/jpeg', // Ensure this is the correct mime type based on the image format
  };

  const formData = new FormData();
formData.append('orderId', selectedOrder.order_id);

// Convert blob URL to File object
const fileResponse = await fetch(image.uri);
const fileBlob = await fileResponse.blob();
const file = new File([fileBlob], image.name, { type: image.type });

// Append the file to FormData
formData.append('image', file);

// Log the file to check
console.log("File object:", file);
  
console.log(formData); 

    try {
      const response = await fetch('https://rancho-agripino.com/database/potteryFiles/update_order_status_completed.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success! Proof Saved!');
        setOrders(orders.filter((order) => order.order_id !== selectedOrder.order_id));
        setImageUri(null);

        setIsModalVisible(false);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred.');
    }
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderClick(item)}>
      
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
        <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
        <Text style={styles.productName}>Product: {item.product_name}</Text>
        <Text style={styles.orderDate}>Date: {item.order_date}</Text>
        <Text style={styles.totalPrice}>Total: ₱{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={orders} renderItem={renderOrder} keyExtractor={(item) => item.order_id.toString()} contentContainerStyle={styles.listContainer} />
      {isModalVisible && (
        <Modal visible={true} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Choose a picture to confirm shipment</Text>
              <TouchableOpacity style={styles.detailsButton} onPress={openImagePicker}>
                <Text style={styles.detailsButtonText}>Pick an Image</Text>
              </TouchableOpacity>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              ) : (
                <Text>No image selected</Text>
              )}
              <TouchableOpacity style={styles.detailsButton} onPress={handleSend}>
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