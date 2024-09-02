import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, TouchableOpacity, Modal, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const EditAddress = () => {
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const navigation = useNavigation(); // For navigating back

  const handleAddAddress = () => {
    // Handle address submission logic here
    setModalVisible(true); // Show the modal on address addition
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Hide the modal
    navigation.goBack(); // Navigate back to the previous page
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
          <TextInput
            placeholder="Street Name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            placeholder="0983533526287"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>House Number *</Text>
          <TextInput
            placeholder="House Number"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Floor</Text>
          <TextInput
            placeholder="Floor Number"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street Name *</Text>
          <TextInput
            placeholder="Street Name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput
            placeholder="City Name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            placeholder="Postal Code"
            style={styles.input}
          />
        </View>

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
