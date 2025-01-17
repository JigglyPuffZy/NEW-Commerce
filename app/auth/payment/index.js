import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter, useLocalSearchParams } from "expo-router";
export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [modalVisible, setModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();
  // Replace the existing router.query code with:
  const { cartId } = useLocalSearchParams();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const buyerId = userData ? userData.id : null;
  const [address, setDeliveryAddress] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          `https://rancho-agripino.com/database/potteryFiles/fetch_cart_details.php?cartId=${cartId}`
        );
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setCartItems(data);

          // Calculate subtotal based on quantity_carted * price for each item
          const calculatedSubtotal = data.reduce((sum, item) => {
            const itemSubtotal =
              (parseFloat(item.price) || 0) *
              (parseInt(item.quantity_carted) || 0); // Multiply price by quantity_carted
            return sum + itemSubtotal;
          }, 0);

          setSubtotal(calculatedSubtotal);
        } else {
          Alert.alert("Error", "No items found in cart.");
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        Alert.alert(
          "Error",
          "Failed to fetch cart items. Please try again later."
        );
      }
    };
    // Fetch delivery address
    const fetchDeliveryAddress = async () => {
      try {
        const response = await fetch(
          `https://rancho-agripino.com/database/potteryFiles/fetch_buyer_address.php?buyerId=${buyerId}`
        );
        const data = await response.json();

        if (data) {
          setDeliveryAddress(data);
        } else {
          setDeliveryAddress(null); // No address found
        }
      } catch (error) {
        console.error("Failed to fetch delivery address:", error);
        Alert.alert(
          "Error",
          "Failed to fetch delivery address. Please try again later."
        );
      }
    };

    

    fetchCartItems();
    fetchDeliveryAddress();
  }, [cartId]);
  const handleCheckout = async () => {
    setModalVisible(false);

    if (!address) {
      Alert.alert(
        "Error",
        "Please add a delivery address before proceeding."
      );
      return;
    }

    try {
      // Send cartId and deliveryId to PHP script
      const response = await fetch("https://rancho-agripino.com/database/potteryFiles/checkout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          buyerId,
          deliveryId: address.id, // Assuming the address object has an 'id' field
        })
      });
      const data = await response.json();

      if (data.success) {
        // Redirect to payment page
        router.push("auth/pay");
      } else {
        Alert.alert(
          "Error",
          "Failed to create order. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert("Error", "An error occurred during checkout.");
    }
  };
  const shippingFee = 50.0;
  const total = subtotal + shippingFee;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={24} color="#069906" />
          </TouchableOpacity>
          <Text style={styles.header}>Checkout</Text>
        </View>

        {/* Delivery Address Section */}
        {address ? (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Delivery Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.mutedText}>Address</Text>
              <Text style={styles.boldText}>
                House No. {address.house_number}, Floor No. {address.floor},
                {address.street}, {address.barangay},{address.city},{" "}
                {address.province},{address.postal_code}
              </Text>

              <TouchableOpacity
                onPress={() => router.push("auth/addressselection")}
              >
                <Text style={styles.linkText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Delivery Address</Text>
            <Text style={styles.mutedText}>No address found.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("auth/addressselection")}
            >
              <Text style={styles.linkText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Shopping List Section */}
        <Text style={styles.subHeader}>Shopping List</Text>
        {cartItems.map((item) => {
          const firstImage = item.imagesPath.split(",")[0].trim();

          return (
            <View key={item.id} style={styles.itemContainer}>
              <Image
                source={{
                  uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${firstImage}`,
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.boldText}>{item.product_name}</Text>
                <Text style={styles.mutedText}>
                  Variation: {item.variation}
                </Text>
                <Text style={styles.boldText}>
                  ₱{(parseFloat(item.price) || 0).toFixed(2)}{" "}
                  <Text style={styles.lineThrough}>
                    ₱{(parseFloat(item.originalPrice) || 0).toFixed(2)}
                  </Text>
                </Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.mutedText}>
          Total Order (
          {cartItems.reduce(
            (sum, item) => sum + parseInt(item.quantity_carted) || 0,
            0
          )}
          ): ₱{subtotal.toFixed(2)}
        </Text>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === "COD" &&
                  styles.paymentMethodButtonSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("COD")}
            >
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === "COD" &&
                    styles.paymentMethodTextSelected,
                ]}
              >
                Cash on Delivery (COD)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === "GCash" &&
                  styles.paymentMethodButtonSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("GCash")}
            >
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === "GCash" &&
                    styles.paymentMethodTextSelected,
                ]}
              >
                GCash
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <Text style={styles.mutedText}>Subtotal:</Text>
            <Text style={styles.mutedText}>₱{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.mutedText}>Shipping Fee:</Text>
            <Text style={styles.mutedText}>₱{shippingFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.boldText}>Total:</Text>
            <Text style={styles.boldText}>₱{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Checkout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to checkout?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  handleCheckout(); // Call handleCheckout when the user confirms
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)} // Close modal on "No"
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    // Removed background color to have a transparent header
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28a745", // Optional: Change text color if needed
    flex: 1,
    right: 10,
  },
  section: {
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  mutedText: {
    color: "#6c757d",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  linkText: {
    color: "#007bff",
    marginTop: 8,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  lineThrough: {
    textDecorationLine: "line-through",
    color: "#6c757d",
  },
  paymentMethodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  paymentMethodButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#e9ecef",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    elevation: 2,
  },
  paymentMethodButtonSelected: {
    backgroundColor: "#28a745",
    elevation: 3,
  },
  paymentMethodText: {
    color: "#333",
    fontWeight: "500",
  },
  paymentMethodTextSelected: {
    color: "#fff",
  },
  summarySection: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#f7f7f7",
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
