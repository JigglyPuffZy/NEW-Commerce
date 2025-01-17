import {
  View,
  Alert,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useRoute } from "react";

import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
export default function ToPayScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const router = useRouter();
  // const [paymentData, setPaymentData] = useState(initialPaymentData);
  const reasons = [
    "Wrong shipping address",
    "Changed my mind",
    "Ordered by mistake",
    "Found a better price",
  ];
  const [orders, setOrders] = useState([]);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const buyerID = userData ? userData.id : null;

  useEffect(() => {
    if (buyerID) {
      fetch(
        `https://rancho-agripino.com/database/potteryFiles/fetch_buyer_orders.php?buyerID=${buyerID}`
      )
        .then((response) => {
          return response.text(); // Change to text() to inspect the raw response
        })
        .then((text) => {
          console.log("Raw response:", text);
          const data = JSON.parse(text); // Parse the JSON manually
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            console.error("Unexpected data format:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [buyerID]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>To Pay</Text>
      </View>

      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>Order #{item.order_id}</Text>
      </View>
      <View style={styles.itemContainer}>
        {/* <Text style={styles.itemName}>Product ID: {item.product_id}</Text> */}
        <Text style={styles.itemDescription}>Shop Name: {item.shopName}</Text>
        <Text style={styles.itemQuantity}>Status: To Pay</Text>
      </View>
      <Text style={styles.originalPrice}>Order Date: {item.order_date}</Text>
      <Text style={styles.itemDescription}>
        Quantity: {item.quantity_carted}
      </Text>
      <Text style={styles.originalPrice}>{item.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => router.push(`auth/message?seller_id=${item.user_id}&oder_id=${item.order_id}`)}
        >
          <FontAwesome name="envelope" size={16} color="#fff" />
          <Text style={styles.buttonText}>Contact Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setItemToRemove(item.order_id); // Set the order ID to cancel
            setModalVisible(true); // Show the modal
          }}
        >
          <FontAwesome name="times" size={16} color="#fff" />
          <Text style={styles.buttonText}> Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleRemoveItem = () => {
    if (itemToRemove && selectedReason) {
      axios
        .post(
          "https://rancho-agripino.com/database/potteryFiles/cancel_order.php",
          {
            order_id: itemToRemove,
            reason: selectedReason,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // or 'application/json'
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            Alert.alert("Warning", "Order cancelled successfully.");
            setModalVisible(false);
          } else {
            alert(`Error: ${response.data.message}`);
          }
        })
        .catch((error) => {
          console.error("Error cancelling order:", error);
          alert("An error occurred while cancelling the order.");
        })
        .finally(() => {
          setItemToRemove(null);
          setSelectedReason("");
          setModalVisible(false);
        });
    } else {
      alert("Please select a reason for cancellation.");
    }
  };

  const totalAmount = orders.reduce(
    (total, item) => total + parseFloat(item.price || 0),
    0
  );
  const itemCount = orders.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>To Pay</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.order_id}_${index}`}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Item Count:</Text>
          <Text style={styles.summaryValueText}>{itemCount}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Subtotal:</Text>
          <Text style={styles.summaryValueText}>₱{totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Delivery fee:</Text>
          <Text style={styles.summaryValueText}>₱ 50.00</Text>
        </View>
        <View style={styles.summaryDetail}>
          <Text style={styles.summaryLabelText}>Total:</Text>
          <Text style={styles.totalText}>
            ₱{(totalAmount + 50.0).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Enhanced Modal for Cancel Confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Why are you cancelling?</Text>
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonOption}
                onPress={() => setSelectedReason(reason)}
              >
                <FontAwesome
                  name={selectedReason === reason ? "dot-circle-o" : "circle-o"}
                  size={20}
                  color="#069906"
                />
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButtonYes}
                onPress={handleRemoveItem} // Calls the updated function
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Pressable>

              <Pressable
                style={styles.modalButtonNo}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#069906",
    elevation: 4,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#069906",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#888",
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#33A853",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactButton: {
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#069906",
    borderRadius: 8,
    justifyContent: "center",
    elevation: 2,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    justifyContent: "center",
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  summaryDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabelText: {
    fontSize: 16,
    color: "#333",
  },
  summaryValueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#069906",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  reasonText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButtonYes: {
    backgroundColor: "#069906",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  modalButtonNo: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
