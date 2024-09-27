import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

export default function SellerDashboard() {
  const screenWidth = Dimensions.get('window').width;
  const router = useRouter(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [ordersFadeAnim] = useState(new Animated.Value(0));

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [5000, 8000, 6000, 7000, 9000, 10000] }],
  };

  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [20, 35, 28, 40, 55, 60] }],
  };

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
    if (ordersModalVisible) {
      Animated.timing(ordersFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setOrdersModalVisible(false));
    } else {
      setOrdersModalVisible(true);
      Animated.timing(ordersFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/auth/settings')} style={styles.settingsButton}>
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
            <Text style={styles.summaryText}>Total Sales: ₱ 10,000</Text>
            <Text style={styles.summaryText}>Orders: 120</Text>
            <Text style={styles.summaryText}>Revenue: ₱ 8,000</Text>
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
              <Text style={styles.modalText}>Here are the details of your sales:</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>- January: ₱ 5000 (20 Orders)</Text>
                <Text style={styles.detailText}>- February: ₱ 8000 (35 Orders)</Text>
                <Text style={styles.detailText}>- March: ₱ 6000 (28 Orders)</Text>
                <Text style={styles.detailText}>- April: ₱ 7000 (40 Orders)</Text>
                <Text style={styles.detailText}>- May: ₱ 9000 (55 Orders)</Text>
                <Text style={styles.detailText}>- June: ₱ 10000 (60 Orders)</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <BarChart
            data={ordersData}
            width={screenWidth * 0.85}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={styles.chart}
          />
          <View style={styles.orderBox}>
            <Text style={styles.orderText}>Pending Orders: 5</Text>
            <Text style={styles.orderText}>Shipped Orders: 100</Text>
            <Text style={styles.orderText}>Delivered Orders: 15</Text>
            <TouchableOpacity onPress={toggleOrdersModal} style={styles.modalButton}>
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
            <Animated.View style={[styles.modalContent, { opacity: ordersFadeAnim }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Orders Details</Text>
                <TouchableOpacity onPress={toggleOrdersModal}>
                  <FontAwesome name="times" size={24} color="#069906" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>Here are the details of your orders:</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>- Pending Orders: 5</Text>
                <Text style={styles.detailText}>- Shipped Orders: 100</Text>
                <Text style={styles.detailText}>- Delivered Orders: 15</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={toggleOrdersModal}>
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
              onPress={() => router.push('auth/viewproducts')}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <FontAwesome name="eye" size={18} color="#fff" />
              <Text style={styles.actionButtonText}> View Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barRadius: 8,
  barPercentage: 0.6,
  style: {
    borderRadius: 16,
    paddingVertical: 5,
    marginVertical: 10,
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: '#e3e3e3',
  },
  fillShadowGradient: '#43A047',
  fillShadowGradientOpacity: 1,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#069906',
    padding: 15,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  container: {
    padding: 10,
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
    padding: 15,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  summaryBox: {
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 2,
  },
  modalButton: {
    backgroundColor: '#069906',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    marginVertical: 10,
  },
  detailsContainer: {
    marginVertical: 10,
  },
  detailText: {
    marginVertical: 2,
  },
  closeButton: {
    backgroundColor: '#069906',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderBox: {
    marginTop: 10,
  },
  orderText: {
    fontSize: 16,
    marginVertical: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

