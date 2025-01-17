import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';


export default function SellerInfo() {
  // Initial seller data
  // const initialSellerInfo = {
  //   shopName: 'Sample Store Name',
  //   email: 'viahsaquing@gmail.com',
  //   address: 'Santa Maria, Isabela'
  // };

  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for managing modal visibility
  const router = useRouter(); // Use the router from Expo Router

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    // Get the seller ID from user data
    const sellerId = userData ? userData.id : null;

    if (!sellerId) {
      console.error("Seller ID not found in session");
      return;
    }

    // Fetch the seller data
    fetch(`https://rancho-agripino.com/database/potteryFiles/get_seller_info.php?user_id=${sellerId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
        } else {
          // Populate the input fields with the fetched data
          setShopName(data.shopName || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
        }
      })
      .catch(error => {
        console.error('Error fetching seller data:', error);
      });
  }, []);

  const handleBackButtonPress = () => {
    router.back(); // Go back to the previous screen
  };

  const handleSaveButtonPress = () => {
    // Retrieve user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
  
    // Get the seller ID from user data
    const sellerId = userData ? userData.id : null;
  
    if (!sellerId) {
      console.error("Seller ID not found in session");
      return; // Exit if there's no seller ID
    }
  
    // Include seller ID in the data to be sent to the PHP script
    const sellerData = {
      seller_id: sellerId, // Add seller ID here
      shopName,
      email,
      address
    };
  
    fetch('https://rancho-agripino.com/database/potteryFiles/save_shop_info.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(sellerData),
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      setModalVisible(true); // Show modal on success
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  

  const handleCloseModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Seller Info</Text>
        </View>

        <View style={styles.content}>
          {/* Editable Info Fields */}
          <View style={styles.infoCard}>
            <View style={styles.infoGroup}>
              <FontAwesome name="shopping-cart" size={20} color="#069906" />
              <Text style={styles.label}>Shop Name: </Text>
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder="Enter Shop Name"
                placeholderTextColor="#999"
              />
            </View>

           

          

           

            <View style={styles.infoGroup}>
              <FontAwesome name="envelope" size={20} color="#069906" />
              <Text style={styles.label}>Email: </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email Address"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

           

            <View style={styles.infoGroup}>
              <FontAwesome name="map-marker" size={20} color="#069906" />
              <Text style={styles.label}>Address: </Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter Address"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveButtonPress}>
            <Text style={styles.saveButtonText}>Save Info</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for "Save successfully" */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Save successfully!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#069906',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#069906',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  infoGroup: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginLeft: 5,
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#069906',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#069906',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#069906',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
