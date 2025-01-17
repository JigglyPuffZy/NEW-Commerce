import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Alert,
  FlatList,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function EditProfile() {
  const [profilePicture, setProfilePicture] = useState(
    "https://images4.alphacoders.com/125/thumb-1920-1258018.png"
  );
  const [lastname, setlastName] = useState("");
  const [firstname, setfirstName] = useState("");
  const [midname, setmidName] = useState("");

  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Male");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [genderOptions] = useState(["Male", "Female"]);
  const genderModalAnimation = useRef(new Animated.Value(0)).current;

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userData ? userData.id : null;

  const navigation = useNavigation();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `https://rancho-agripino.com/database/potteryFiles/fetch_profile.php?buyerID=${userId}`
      );
      const result = await response.json();
      if (result.status === "success") {
        const data = result.data;
        setfirstName(data.firstname);
        setmidName(data.midname);
        setlastName(data.lastname);
        setPhone(data.contactNo);
        setEmail(data.email);
        setAddress(data.address);
        // Set other fields if they exist in the response, e.g., gender, bio, birthday
      } else {
        Alert.alert("Error", "Failed to fetch profile data");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch data. Please try again later.");
      console.error(error);
    }
  };
  const handleSave = async () => {
    if (!lastname || !firstname || !midname || !email || !phone || !address) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }
    try {
      const response = await fetch(
        `https://rancho-agripino.com/database/potteryFiles/update_profile.php?buyerID=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            midname: midname,
            gender: gender,
            contactNo: phone,
            email: email,
            address: address,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setSubmitModalVisible(true);
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating your profile.");
    }
  };

  const handleEditProfilePicture = () => {
    setModalVisible(true);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your gallery.");
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
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your camera.");
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
    <TouchableOpacity
      onPress={() => handleGenderSelect(item)}
      style={styles.genderOption}
    >
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
    const numbers = text.replace(/[^0-9]/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4)
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
      4,
      8
    )}`;
  };

  const formatPhone = (text) => {
    const numbers = text.replace(/[^0-9]/g, "");
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.arrowButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#069906" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePictureText}>No Profile Picture</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={handleEditProfilePicture}
          >
            <FontAwesome5 name="edit" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Input fields */}
        {[
          {
            label: "First Name",
            value: firstname,
            onChangeText: setfirstName,
            placeholder: "Enter your firstname",
          },
          {
            label: "Middle Name",
            value: midname,
            onChangeText: setmidName,
            placeholder: "Enter your middlename",
          },
          {
            label: "Last Name",
            value: lastname,
            onChangeText: setlastName,
            placeholder: "Enter your lastname",
          },

          // { label: 'Bio', value: bio, onChangeText: setBio, placeholder: 'Enter your bio', multiline: true },
          {
            label: "Gender",
            value: gender,
            onPress: handleGenderModalOpen,
            placeholder: "Select your gender",
            editable: false,
          },
          // {
          //   label: 'Birthday',
          //   value: birthday,
          //   onChangeText: (text) => setBirthday(formatDate(text)),
          //   placeholder: 'MM/DD/YYYY',
          //   keyboardType: 'numeric'
          // },
          {
            label: "Phone",
            value: phone,
            onChangeText: (text) => setPhone(text),
            placeholder: "Enter your phone",
            keyboardType: "numeric",
          },
          {
            label: "Email",
            value: email,
            onChangeText: setEmail,
            placeholder: "Enter your email",
          },
          {
            label: "Address",
            value: address,
            onChangeText: setAddress,
            placeholder: "Enter your address",
          },
        ].map(
          (
            {
              label,
              value,
              onChangeText,
              placeholder,
              multiline = false,
              editable = true,
              onPress = () => {},
              keyboardType = "default",
            },
            index
          ) => (
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
          )
        )}

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
            <TouchableOpacity
              onPress={pickImageFromGallery}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCameraAction}
              style={styles.modalButton}
            >
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
              transform: [
                {
                  translateY: genderModalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.genderModalContent}>
            <FlatList
              data={genderOptions}
              renderItem={renderGenderOption}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              onPress={handleGenderModalClose}
              style={styles.modalButton}
            >
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
            <Text style={styles.modalMessage}>
              Profile updated successfully!
            </Text>
            <TouchableOpacity
              onPress={handleModalOkay}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Okay</Text>
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
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#069906',
  },
  headerSpacer: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 15,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  priceInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  pesoSign: {
    fontSize: 16,
    color: '#069906',
    marginRight: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  buttonContainer: {
    marginBottom: 15,
  },
  gradientButton: {
    backgroundColor: '#069906',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  recentImagesContainer: {
    marginBottom: 15,
  },
  recentImageContainer: {
    marginRight: 10,
  },
  recentImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  removeRecentImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 2,
  },
  removeRecentImageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#069906',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#069906',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

