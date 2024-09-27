import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView, FlatList, ScrollView, ActionSheetIOS, Platform, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const EditProduct = () => {
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [recentImages, setRecentImages] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to pick an image.');
      }
    };
    requestPermissions();
  }, []);

  const pickImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose from Library', 'Take Photo'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            launchImageLibrary();
          } else if (buttonIndex === 2) {
            launchCamera();
          }
        }
      );
    } else {
      Alert.alert(
        'Select Image',
        'Choose how you want to select an image',
        [
          {
            text: 'Choose from Library',
            onPress: launchImageLibrary,
          },
          {
            text: 'Take Photo',
            onPress: launchCamera,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Allow multiple image selection
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setRecentImages(prevImages => [...prevImages, ...newImages]);
    } else {
      Alert.alert('Image Selection Error', 'Could not pick an image. Please try again.');
    }
  };

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Allow image editing
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setRecentImages(prevImages => [newImage, ...prevImages]);
    } else {
      Alert.alert('Camera Error', 'Could not take a photo. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!price || !description) {
      Alert.alert('Input Error', 'Please fill in both price and description fields.');
      return;
    }

    setIsLoading(true);
    console.log('Product Saved', { price, description, recentImages });
    setIsLoading(false);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  const removeRecentImage = (uri) => {
    setRecentImages(prevImages => prevImages.filter(imageUri => imageUri !== uri));
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.recentImageContainer}>
      <Image source={{ uri: item }} style={styles.recentImage} />
      <TouchableOpacity style={styles.removeRecentImageButton} onPress={() => removeRecentImage(item)} accessibilityLabel="Remove image">
        <Text style={styles.removeRecentImageButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#d0f0c0', '#b0e57c', '#a0e472']} style={styles.container}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Product</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="Enter product price"
                placeholderTextColor="#888"
                accessibilityLabel="Product price input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter product description"
                placeholderTextColor="#888"
                multiline
                accessibilityLabel="Product description input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image Upload</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage} accessibilityLabel="Pick images">
                  <Text style={styles.buttonText}>Pick Images</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Images Section */}
            <View style={styles.recentImagesContainer}>
              <Text style={styles.label}>Recent Uploads</Text>
              <FlatList
                data={recentImages}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Success</Text>
              <Text style={styles.modalText}>Product has been saved successfully!</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal} accessibilityLabel="Close modal">
                <Text style={styles.modalButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 28,
    color: '#069906',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#069906',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#069906',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentImagesContainer: {
    marginVertical: 12,
  },
  recentImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  recentImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  removeRecentImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  removeRecentImageButtonText: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#069906',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#069906',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#069906',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default EditProduct;
