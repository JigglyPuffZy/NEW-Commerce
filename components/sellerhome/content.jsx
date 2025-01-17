import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
function fetchMonthlyOrders() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const sellerID = userData ? userData.id : null;
  console.log("Seller ID:", sellerID); // Debugging the seller ID

  return fetch(
    `https://rancho-agripino.com/database/potteryFiles/get_orders_data.php?sellerID=${sellerID}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Orders Data:", data); // Check if data is being returned correctly

      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const ordersData = months.map((month) => {
        const monthData = data.find((item) => item.month === String(month)); // Ensure both sides are strings
        return monthData
          ? {
              pending: Number(monthData.pending), // Ensure numeric values
              to_ship: Number(monthData.to_ship),
              delivered: Number(monthData.delivered),
            }
          : { pending: 0, to_ship: 0, delivered: 0 };
      });

      console.log("Processed Orders Data:", ordersData); // Debugging the processed data

      return ordersData;
    })
    .catch((error) => console.error("Error fetching orders data:", error));
}

function fetchMonthlySales() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const sellerID = userData ? userData.id : null;
  console.log(sellerID);

  return fetch(
    `https://rancho-agripino.com/database/potteryFiles/get_sales_data.php?sellerID=${sellerID}`
  )
    .then((response) => response.json())
    .then((data) => {
      const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

      const salesData = allMonths.map((month) => {
        const monthData = data.find((item) => item.month === String(month));
        return {
          month: month,
          sales: monthData ? monthData.sales : 0,
          orders: monthData ? monthData.orders : 0,
        };
      });

      const labels = salesData.map((item) => {
        const date = new Date(0);
        date.setMonth(item.month - 1);
        return date.toLocaleString("default", { month: "short" });
      });

      const salesAmount = salesData.map((item) => item.sales);

      const totalSales = salesData.reduce((acc, item) => acc + item.sales, 0);
      const totalOrders = salesData.reduce((acc, item) => acc + item.orders, 0);

      return {
        labels,
        salesData: salesAmount,
        totalSales,
        totalOrders,
        salesDetails: salesData,
      };
    })
    .catch((error) => console.error("Error fetching sales data:", error));
}

export default function SellerDashboard() {
  const screenWidth = Dimensions.get("window").width;
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [ordersFadeAnim] = useState(new Animated.Value(0));

  const [ordersData, setOrdersData] = useState([]);

  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [{ data: [] }],
    totalSales: 0,
    totalOrders: 0,
    salesDetails: [],
  });

  useEffect(() => {
    fetchMonthlySales().then((data) => {
      setSalesData({
        labels: data.labels,
        datasets: [{ data: data.salesData }],
        totalSales: data.totalSales,
        totalOrders: data.totalOrders,
        salesDetails: data.salesDetails,
      });
    });

    fetchMonthlyOrders().then((data) => {
      console.log("Orders Data in useEffect:", data); // Debugging ordersData
      setOrdersData(data);
    });
  }, []);

  // const salesData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //   datasets: [{ data: [5000, 8000, 6000, 7000, 9000, 10000] }],
  // };

  // const ordersData = [
  //   { pending: 5, to_ship: 3, delivered: 1 },
  //   { pending: 2, to_ship: 4, delivered: 6 },
  //   { pending: 8, to_ship: 2, delivered: 4 },
  //   { pending: 3, to_ship: 5, delivered: 7 },
  //   { pending: 6, to_ship: 1, delivered: 9 },
  //   { pending: 4, to_ship: 8, delivered: 2 },
  //   { pending: 7, to_ship: 6, delivered: 3 },
  // { pending: 1, to_ship: 9, delivered: 5 },
  // { pending: 9, to_ship: 2, delivered: 4 },
  // { pending: 2, to_ship: 7, delivered: 6 },
  // { pending: 6, to_ship: 3, delivered: 8 },
  // { pending: 4, to_ship: 5, delivered: 1 },
  // ];
  
  // Mapping month numbers to month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toggleModal = () => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    } else {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleOrdersModal = () => {
    setOrdersModalVisible(!ordersModalVisible);
    if (!ordersModalVisible) {
      Animated.timing(ordersFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(ordersFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/sellersettings")}
          style={styles.settingsButton}
        >
          <FontAwesome name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Sales Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>
          <BarChart
            data={salesData}
            width={screenWidth * 0.85}
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={styles.chart}
          />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              Total Sales: ₱ {salesData.totalSales}
            </Text>
            <Text style={styles.summaryText}>
              Orders: {salesData.totalOrders}
            </Text>
            {/* <Text style={styles.summaryText}>Revenue: ₱ 8,000</Text> */}
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Show Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for Sales Detailed Information */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sales Details</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <FontAwesome name="times" size={24} color="#069906" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                Here are the details of your sales:
              </Text>
              <View style={styles.detailsContainer}>
                {salesData.salesDetails.map((item, index) => (
                  <Text key={index} style={styles.detailText}>
                    - {monthNames[item.month - 1]}: ₱{" "}
                    {item.sales.toLocaleString()} ({item.orders} Orders)
                  </Text>
                ))}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <BarChart
            data={{
              labels: Array.from({ length: 12 }, (_, i) => monthNames[i]), // Month names (January, February, etc.)
              datasets: [
                {
                  // Dataset for pending orders
                  data: ordersData.map((order) => order.pending),
                  color: () => "red", // Color for Pending
                  strokeWidth: 2,
                  name: "Pending",
                },
                {
                  // Dataset for orders to ship
                  data: ordersData.map((order) => order.to_ship),
                  color: () => "blue", // Color for To Ship
                  strokeWidth: 2,
                  name: "To Ship",
                },
                {
                  // Dataset for delivered orders
                  data: ordersData.map((order) => order.delivered),
                  color: () => "green", // Color for Delivered
                  strokeWidth: 2,
                  name: "Delivered",
                },
              ],
            }}
            width={screenWidth * 0.85}
            height={220}
            yAxisLabel=""
            chartConfig={{
              ...chartConfig,
              decimalPlaces: 0, // Prevent decimal places for order counts
              categoryPercentage: 0.7, // Adjust this for proper spacing between bars
              barPercentage: 0.3, // Width of the individual bars
            }}
            verticalLabelRotation={30}
            style={styles.chart}
          />

          <View style={styles.orderBox}>
            <Text style={styles.orderText}>
              Pending Orders:{" "}
              {ordersData.reduce((acc, curr) => acc + curr.pending, 0)}
            </Text>
            <Text style={styles.orderText}>
              Shipped Orders:{" "}
              {ordersData.reduce((acc, curr) => acc + curr.to_ship, 0)}
            </Text>
            <Text style={styles.orderText}>
              Delivered Orders:{" "}
              {ordersData.reduce((acc, curr) => acc + curr.delivered, 0)}
            </Text>
            <TouchableOpacity
              onPress={toggleOrdersModal}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Show Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for Orders Detailed Information */}
        <Modal
          animationType="none"
          transparent={true}
          visible={ordersModalVisible}
          onRequestClose={toggleOrdersModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalContent, { opacity: ordersFadeAnim }]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Orders Details</Text>
                <TouchableOpacity onPress={toggleOrdersModal}>
                  <FontAwesome name="times" size={24} color="#069906" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                Here are the details of your orders:
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  - Pending Orders:{" "}
                  {ordersData.reduce((acc, curr) => acc + curr.pending, 0)}
                </Text>
                <Text style={styles.detailText}>
                  - Shipped Orders:{" "}
                  {ordersData.reduce((acc, curr) => acc + curr.to_ship, 0)}
                </Text>
                <Text style={styles.detailText}>
                  - Delivered Orders:{" "}
                  {ordersData.reduce((acc, curr) => acc + curr.delivered, 0)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleOrdersModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => router.push("auth/viewproducts")}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="eye" size={18} color="#fff" />
              <Text style={styles.actionButtonText}> View Product</Text>
            </TouchableOpacity>
            {/* New My Orders Button */}
            <TouchableOpacity
              onPress={() => router.push("auth/myorder")}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="list" size={18} color="#fff" />
              <Text style={styles.actionButtonText}> My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: "#ffffff", // Chart background color
  backgroundGradientFrom: "#ffffff", // Gradient from color
  backgroundGradientTo: "#ffffff", // Gradient to color
  decimalPlaces: 0, // To show whole numbers
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Grid line color
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
  barRadius: 8, // Rounded bars
  barPercentage: 0.3, // Adjust width of bars
  categoryPercentage: 0.7, // Adjust spacing between grouped bars
  style: {
    borderRadius: 16,
    paddingVertical: 5,
    marginVertical: 10,
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e3e3e3", // Grid lines color
  },
  fillShadowGradientFrom: "#069906", // Shadow gradient color for fill
  fillShadowGradientFromOpacity: 0.5,
  fillShadowGradientTo: "#069906", // Shadow gradient color for fill
  fillShadowGradientToOpacity: 0.5,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#069906",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  settingsButton: {
    backgroundColor: "#069906",
    padding: 10,
    borderRadius: 10,
  },
  container: {
    alignItems: "center",
    paddingBottom: 16,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: "90%",
    elevation: 2,
    top: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryBox: {
    marginTop: 10,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#069906",
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#069906",
  },
  modalText: {
    marginVertical: 10,
  },
  detailsContainer: {
    marginVertical: 10,
  },
  detailText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#069906",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#069906",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  orderBox: {
    marginTop: 10,
    alignItems: "center",
  },
  orderText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
