import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal,
  Animated,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { useNavigation } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ProductScreen({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [product, setProduct] = useState(null);
  const navigation = useNavigation();
  const router = useRouter();
  const { width } = Dimensions.get("window");

  // Replace the existing router.query code with:
  const { id } = useLocalSearchParams();

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://rancho-agripino.com/database/potteryFiles/fetch_products_with_comments.php?id=${id}`
        );
        const data = await response.json();
        setProduct(data); // Assume data contains product, comments, and seller info
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const redirectToCart = () => {
   
    router.push('/auth/home'); 
    // navigation.navigate('auth/home');
  };

  const handleAddToCart = async () => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    // Get the seller ID from user data
    const buyerId = userData ? userData.id : null;

    // Send a POST request to add the product to the cart
    try {
      const response = await fetch(
        "https://rancho-agripino.com/database/potteryFiles/add_to_cart.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `product_id=${product.id}&user_id=${buyerId}`,
        }
      );
      const result = await response.json();

      // Check if the response is successful
      if (result.success) {
        setModalVisible(true);

        // Start animation
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(animation, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();

        // Close the modal after a delay (optional)
        setTimeout(closeModal, 2000); // Close after 2 seconds (or adjust as needed)

        redirectToCart();
      } else {
        console.error(result.message); // Handle error messages
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleChat = () => {
    router.push("auth/message");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={16}
          color="#ffc107"
        />
      );
    }
    return stars;
  };

  if (!product) return <Text>Loading...</Text>; // Loading state
  const firstImage = product.image.split(",")[0].trim();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={40} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${firstImage}`,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <TouchableOpacity onPress={handleChat}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#069906"
                  style={styles.messageIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>₱{product.price}</Text>
            <Text style={styles.description}>
              Product Description:{product.description}
            </Text>
            <Text style={styles.description}>
              Stock: {product.quantityStock}
            </Text>

            {/* Seller Information */}
            <TouchableOpacity
              style={styles.sellerInfo}
              onPress={() => handleCall(product.contact)}
            >
              <Text style={styles.sellerName}>Seller: {product.shopName}</Text>
              <Text style={styles.contactNumber}>
                Contact: {product.shop_contact}
              </Text>
              <Text style={styles.location}>Email: {product.shop_email}</Text>

              <Text style={styles.location}>
                Location: {product.shop_address}
              </Text>
            </TouchableOpacity>

            {/* Comments Section */}
            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Customer Comments</Text>
              <ScrollView style={styles.commentsList}>
                {product.comments && product.comments.length > 0 ? (
                  product.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentRating}>
                          {renderStars(comment.rating)}
                        </Text>
                        <Text style={styles.commentAuthor}>
                          - {comment.author}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>"{comment.text}"</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.noCommentsContainer}>
                    <Ionicons name="cube-outline" size={24} color="gray" />
                    <Text style={styles.noCommentsText}>No comments yet</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAddToCart}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>ADD TO CART</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={handleAddToCart}
            // onPress={() => router.push("auth/payment")}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>BUY NOW</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Add to Cart */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="none"
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.modalTitle}>Added to Cart</Text>
            <Text style={styles.modalMessage}>
              Your product has been successfully added to the cart.
            </Text>
            {/* <TouchableOpacity
              onPress={redirectToCart} // Redirect on press
              style={styles.modalCloseButton}
            >
              <Text style={styles.buttonText}>Go to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity> */}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#069906",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    position: "absolute",
    left: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    padding: 16,
    paddingBottom: 160,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#d1fae5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    resizeMode: "cover",
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    marginBottom: 20,
  },
  productTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333",
  },
  messageIcon: {
    marginLeft: 8, // Spacing between the title and icon
  },
  brand: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    color: "#ffc107",
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  averageRating: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333333",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#069906",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },
  sellerInfo: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactNumber: {
    fontSize: 14,
    color: "#069906",
  },
  location: {
    fontSize: 14,
    color: "#333333",
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  commentsList: {
    maxHeight: 200,
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentRating: {
    fontSize: 16,
    color: "#ffc107",
    marginRight: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
    color: "#333333",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    width: "100%",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#069906",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  // buttonText: {
  //   fontSize: 16,
  //   color: "#ffffff",
  //   fontWeight: "bold",
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#069906",
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#069906", // Example color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10, // Ensure spacing between buttons
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});
