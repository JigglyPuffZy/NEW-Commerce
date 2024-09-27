import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  FlatList,
  ScrollView,
  ActionSheetIOS,
  Platform,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const EditProduct = () => {
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [recentImages, setRecentImages] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
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
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setRecentImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setRecentImages(prevImages => [newImage, ...prevImages]);
    }
  };

  const handleSave = () => {
    console.log('Product Saved', { price, description, recentImages });
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
      <TouchableOpacity style={styles.removeRecentImageButton} onPress={() => removeRecentImage(item)}>
        <Text style={styles.removeRecentImageButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#d0f0c0', '#b0e57c', '#a0e472']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Product</Text>
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
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image Upload</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                  <FontAwesome name="upload" size={16} color="#fff" />
                  <Text style={styles.buttonText}> Pick Images</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.recentImagesContainer}>
              <Text style={styles.label}>Recent Images</Text>
              <FlatList
                data={recentImages}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Product</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Success</Text>
              <Text style={styles.modalText}>Product has been added successfully!</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
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
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    flexGrow: 1,
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
    fontSize: 30,
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
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  descriptionInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#069906',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentImagesContainer: {
    marginTop: 20,
  },
  recentImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  recentImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeRecentImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    padding: 5,
  },
  removeRecentImageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#069906',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#069906',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditProduct;
