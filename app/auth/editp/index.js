import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Alert, FlatList, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
  const [profilePicture, setProfilePicture] = useState('https://images4.alphacoders.com/125/thumb-1920-1258018.png');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('Male');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [genderOptions] = useState(['Male', 'Female']);
  const genderModalAnimation = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const handleSave = () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    setSubmitModalVisible(true);
  };

  const handleEditProfilePicture = () => {
    setModalVisible(true);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
      setModalVisible(false);
    }
  };

  const handleCameraAction = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setGenderModalVisible(false);
  };

  const handleModalOkay = () => {
    setSubmitModalVisible(false);
    navigation.goBack(); // Navigate back to the previous screen
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setGenderModalVisible(false);
  };

  const renderGenderOption = ({ item }) => (
    <TouchableOpacity onPress={() => handleGenderSelect(item)} style={styles.genderOption}>
      <Text style={styles.genderOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleGenderModalOpen = () => {
    setGenderModalVisible(true);
    Animated.timing(genderModalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleGenderModalClose = () => {
    Animated.timing(genderModalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setGenderModalVisible(false));
  };

  const formatDate = (text) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const formatPhone = (text) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowButton}>
            <MaterialIcons name="arrow-back" size={24} color="#069906" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePictureText}>No Profile Picture</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editIconContainer} onPress={handleEditProfilePicture}>
            <FontAwesome5 name="edit" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Input fields */}
        {[ 
          { label: 'Name', value: name, onChangeText: setName, placeholder: 'Enter your name' },
          { label: 'Bio', value: bio, onChangeText: setBio, placeholder: 'Enter your bio', multiline: true },
          { 
            label: 'Gender', 
            value: gender, 
            onPress: handleGenderModalOpen,
            placeholder: 'Select your gender',
            editable: false
          },
          { 
            label: 'Birthday', 
            value: birthday, 
            onChangeText: (text) => setBirthday(formatDate(text)), 
            placeholder: 'MM/DD/YYYY',
            keyboardType: 'numeric'
          },
          { 
            label: 'Phone', 
            value: phone, 
            onChangeText: (text) => setPhone(formatPhone(text)), 
            placeholder: 'Enter your phone',
            keyboardType: 'numeric'
          },
          { label: 'Email', value: email, onChangeText: setEmail, placeholder: 'Enter your email' },
          { label: 'Address', value: address, onChangeText: setAddress, placeholder: 'Enter your address' },
        ].map(({ label, value, onChangeText, placeholder, multiline = false, editable = true, onPress = () => {}, keyboardType = 'default' }, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            {editable ? (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={multiline}
                keyboardType={keyboardType}
                editable={editable}
              />
            ) : (
              <TouchableOpacity onPress={onPress} style={styles.input}>
                <Text style={styles.inputText}>{value}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for editing profile picture */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={pickImageFromGallery} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCameraAction} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal
        transparent={true}
        visible={genderModalVisible}
        animationType="none"
        onRequestClose={handleGenderModalClose}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: genderModalAnimation,
              transform: [{ translateY: genderModalAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [500, 0],
              }) }]
            }
          ]}
        >
          <View style={styles.genderModalContent}>
            <FlatList
              data={genderOptions}
              renderItem={renderGenderOption}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity onPress={handleGenderModalClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* Submit Confirmation Modal */}
      <Modal
        transparent={true}
        visible={submitModalVisible}
        animationType="slide"
        onRequestClose={() => setSubmitModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>Profile updated successfully!</Text>
            <TouchableOpacity onPress={handleModalOkay} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  arrowButton: {
    marginRight: 10,
    right:90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#069906',
    right:90,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    fontSize: 16,
    color: '#fff',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#069906',
    padding: 6,
    borderRadius: 15,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#069906',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#069906',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#069906',
    borderRadius: 5,
    width: 150,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 20,
    marginBottom: 20,
    color: '#069906',
  },
  genderOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  genderOptionText: {
    fontSize: 18,
    color: '#069906',
  },
  genderModalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
});
