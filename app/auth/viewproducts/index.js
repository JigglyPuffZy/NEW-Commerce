import React, { useState, useEffect,useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import navigation

export default function Widget() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [opacity] = useState(new Animated.Value(0));
  const { width } = Dimensions.get("window");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch the products from the backend based on sellerId
  const navigation = useNavigation(); // Get navigation object

  // Fetch function
  const fetchProducts = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const sellerId = userData ? userData.id : null;

      if (!sellerId) {
        console.error("Seller ID not found in session");
        return;
      }

      const response = await fetch(
        `https://rancho-agripino.com/database/potteryFiles/fetch_products.php?seller_id=${sellerId}`
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products); // Set the fetched products to state
      } else {
        console.error("Error fetching products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // UseEffect hook to trigger fetch when screen is focused
  useEffect(() => {
    // Call fetchProducts when screen is focused
    const focusListener = navigation.addListener('focus', fetchProducts);

    // Cleanup listener when the component is unmounted
    return () => {
      focusListener();
    };
  }, [navigation]); 


  const handleImagePress = (images) => {
    const imageArray = images ? images.split(",").map((img) => img.trim()) : [];
    setSelectedImages(imageArray);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImages([]);
    setCurrentIndex(0);
  };

  const handleDeletePress = (productId) => {
    setSelectedProductId(productId);
    setModalVisible(true);
    // Fade in the modal
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
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
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://rancho-agripino.com/database/potteryFiles/delete_product.php?p_id=${selectedProductId}`,
        {
          method: "DELETE", 
        }
      );
      const data = await response.json();
      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.p_id !== selectedProductId)
        );
        setModalVisible(false);
       

        setIsModalVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();


        const router = useRouter();
        router.push('/auth/viewproducts'); 
      } else {
        Alert.alert("Error", "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert("Error", "Something went wrong while deleting the product.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Products</Text>
        <TouchableOpacity
          onPress={() => router.push("auth/addproduct")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
      {Array.isArray(products) &&
        products.map((product) => {
          const imageArray = product.images
            ? product.images.split(",").map((img) => img.trim())
            : [];
          const firstImage = imageArray[0] || ""; // Get the first image URL

          return (
            <View key={product.p_id} style={styles.card}>
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() => handleImagePress(product.images)}
                >
                  <Image
                    source={{
                      uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${firstImage}`,
                    }}
                    style={styles.productImage}
                    resizeMode="cover"
                    onError={(e) =>
                      console.log("Image load error:", e.nativeEvent.error)
                    }
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.productTitle}>{product.product_name}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <Text style={styles.productDescription}>
                  Available Size: {product.sizes}
                </Text>
                <Text style={styles.productDescription}>
                  Stocks: {product.quantityStocks}
                </Text>
                <Text style={styles.productPrice}>₱ {product.price}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`auth/editproduct?p_id=${product.p_id}`)
                    }
                    style={styles.editButton}
                  >
                    <FontAwesome name="pencil" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeletePress(product.p_id)}
                    style={styles.deleteButton}
                  >
                    <FontAwesome name="trash" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Carousel
              loop
              width={width}
              height={600}
              autoPlay={false}
              data={selectedImages} // Multiple image filenames
              scrollAnimationDuration={300}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <Image
                  source={{
                    uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${item}`, // Concatenate with the base URL
                  }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              )}
            />

            <View style={styles.imageIndexContainer}>
              <Text style={styles.imageIndexText}>
                {`${currentIndex + 1} of ${selectedImages.length}`}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <FontAwesome name="times" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
       {/* Delete Confirmation Modal */}
       <Modal transparent={true} animationType="fade" visible={modalVisible} onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity }]}>
            <Text style={styles.modalText}>Are you sure you want to delete this product?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#069906", // Green header color
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: "#069906", // Green text for the add button
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  main: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
  },
  productImage: {
    width: "100%", // or specific value
    height: 220, // matches container height
    resizeMode: "cover",
  },

  cardContent: {
    padding: 16,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#069906", // Green price text
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#069906", // Green button for editing
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#f44336", // Red button for deleting
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 140, // Added padding at the top for spacing
    position: "relative",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // This ensures the image scales correctly
  },

  imageIndexContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  imageIndexText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 50,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 6,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#069906',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
