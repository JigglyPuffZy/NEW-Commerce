import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioButtonGroup from 'react-native-radio-buttons-group';
import { useRouter } from 'expo-router';


const EditAddress = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const buyerId = userData ? userData.id : null;
  const navigation = useNavigation();
  // const [defaultAddress, setDefaultAddress] = useState('0');  // Default address state initialized to '0'

  // const radioButtonsData = [
  //   {
  //     label: 'Set as Default Address',
  //     value: '1',
  //     selected: defaultAddress === '1', // Set the selected state based on defaultAddress
  //     key: 'default-address-1' // Assign a unique key to each item
  //   },
  //   {
  //     label: 'Do not Set as Default Address',
  //     value: '0',
  //     selected: defaultAddress === '0', // Set the selected state based on defaultAddress
  //     key: 'default-address-0' // Assign a unique key to each item
  //   }
  // ];

  const handleAddAddress = async () => {
    const data = {
      buyerId: buyerId,
      house_number: houseNumber,
      floor: floor,
      street: street,
      barangay: barangay,
      city: city,
      province: province,
      postal_code: postalCode,
      // default_address: defaultAddress
    };

    try {
      const response = await fetch('http://localhost/pottery/save_buyer_address.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setModalVisible(true);
      } else {
        alert('Failed to save address');
      }
    } catch (error) {
      console.error(error);
      alert('Error while saving address');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    router.push({
      pathname: 'auth/home'}) 
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#069906" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Edit Address</Text>
        <Text style={styles.subtitle}>Type street name or post code for location</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>House Number *</Text>
          <TextInput
            placeholder="House Number"
            style={styles.input}
            value={houseNumber}
            onChangeText={setHouseNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Floor</Text>
          <TextInput
            placeholder="Floor Number"
            style={styles.input}
            value={floor}
            onChangeText={setFloor}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street/Purok *</Text>
          <TextInput
            placeholder="Street/Purok"
            style={styles.input}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Barangay *</Text>
          <TextInput
            placeholder="Barangay Name"
            style={styles.input}
            value={barangay}
            onChangeText={setBarangay}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            placeholder="City Name"
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Province *</Text>
          <TextInput
            placeholder="Province Name"
            style={styles.input}
            value={province}
            onChangeText={setProvince}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            placeholder="Postal Code"
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
          />
        </View>

        {/* Radio Buttons for Default Address
        <Text style={styles.label}>Set as Default Address</Text>
        <RadioButtonGroup
          radioButtons={radioButtonsData}
          onPress={(radioButtons) => {
            const selected = radioButtons.find((e) => e.selected);
            setDefaultAddress(selected ? selected.value : '0'); // Update state based on the selected button
          }}
        /> */}

        <Button
          title="Save Address"
          color="#069906"
          onPress={handleAddAddress}
        />
      </ScrollView>

      {/* Modal Component */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Successfully Saved Address</Text>
            <Button title="OK" onPress={handleCloseModal} color="#069906" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles to ensure consistency across platforms
const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    color: '#888888',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  label: {
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default EditAddress;
