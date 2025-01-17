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
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as mime from 'react-native-mime-types';


const EditProduct = () => {
  const [productstocks, setProductStocks] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [size, setSize] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [recentImages, setRecentImages] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
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
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true; // Allow multiple selections
      input.onchange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
          // Instead of storing blob URLs, store File objects
          const fileArray = Array.from(files);
          setRecentImages(prevImages => [...prevImages, ...fileArray]); // Store File objects directly
        }
      };
      input.click();
    } else {
      // Mobile image selection (iOS/Android)
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
    }
  };

  const launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
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

  const handleSave = async () => {
    const formData = new FormData();
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    // Get the seller ID from user data
    const sellerId = userData ? userData.id : null;

    if (!sellerId) {
      console.error("Seller ID not found in session");
      return;
    }
  
    // Add product details to form data
    formData.append('user_id', sellerId);
    formData.append('productName', productName);
    formData.append('productstocks', productstocks);
    formData.append('price', price);
    formData.append('size', size);
    formData.append('description', description);
  
    // Add images to form data
    recentImages.forEach((image, index) => {
      if (Platform.OS === 'web') {
        // On web, 'image' is a File object
        formData.append('recentImages[]', image); // No need to specify `name` and `type`
      } else {
        // On mobile, 'image' is a URI, convert it to a blob
        let filename = image.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
  
        formData.append('recentImages[]', {
          uri: image,
          name: filename,
          type: type,
        });
      }
    });
  
    try {
      const response = await fetch('https://rancho-agripino.com/database/potteryFiles/save_product.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const result = await response.json();
      if (result.success) {
        console.log('Product saved successfully:', result.message);
        setIsModalVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        // Optionally, clear form fields or reset UI state after success
  clearFormFields(); // Custom function to reset form fields if needed
      } else {
        console.log('Failed to save product:', result.message);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  
  function clearFormFields() {
    setProductName('');
    setPrice('');
    setSize('');
    setDescription('');
    setRecentImages([]);
    setProductStocks('');
    // Reset other form fields as needed
  }
  

  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
      navigation.navigate('auth/viewproducts', { refresh: true });
    });
  };

  const removeRecentImage = (uri) => {
    setRecentImages(prevImages => prevImages.filter(imageUri => imageUri !== uri));
  };

  const renderImageItem = ({ item }) => {
    let imageUri = item;
  
    // On web, `item` is a File object, so we create a preview URL
    if (Platform.OS === 'web' && item instanceof File) {
      imageUri = URL.createObjectURL(item);
    }
  
    return (
      <View style={styles.recentImageContainer}>
        <Image source={{ uri: imageUri }} style={styles.recentImage} />
        <TouchableOpacity style={styles.removeRecentImageButton} onPress={() => removeRecentImage(item)}>
          <Text style={styles.removeRecentImageButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <LinearGradient colors={['#FFFFFF', '#e9f5e5']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#069906" />
            </TouchableOpacity>
            <Text style={styles.title}>Add Product</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.formContainer}>
            {/* Product Name */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <FontAwesome name="shopping-bag" size={18} color="#069906" />
                <TextInput
                  style={styles.input}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="Product Name"
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.pesoSign}>₱</Text>
                <TextInput
                  style={styles.priceInput}
                  value={price}
                  onChangeText={text => setPrice(text.replace(/[^0-9]/g, ''))} // Allow only numeric input
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            {/* Size */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <FontAwesome name="tag" size={18} color="#069906" />
                <TextInput
                  style={styles.input}
                  value={size}
                  onChangeText={setSize}
                  placeholder="Size"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            {/* Size */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <FontAwesome name="tag" size={18} color="#069906" />
                <TextInput
                  style={styles.input}
                  value={productstocks}
                  onChangeText={setProductStocks}
                  placeholder="Stocks"
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <FontAwesome name="info-circle" size={18} color="#069906" />
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Description"
                  placeholderTextColor="#888"
                  multiline
                />
              </View>
            </View>

            {/* Image Upload */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image Upload</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.gradientButton} onPress={pickImage}>
                  <FontAwesome name="upload" size={16} color="#fff" />
                  <Text style={styles.buttonText}> Pick Images</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Images */}
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

            {/* Save Button */}
            <TouchableOpacity style={styles.gradientButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Product</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Success Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Success</Text>
              <Text style={styles.modalText}>Product added successfully!</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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

export default EditProduct;
