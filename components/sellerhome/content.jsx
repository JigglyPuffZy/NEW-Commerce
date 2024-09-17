import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function SellerDashboard() {
  const screenWidth = Dimensions.get('window').width;

  // Data for the Sales chart
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5000, 8000, 6000, 7000, 9000, 10000], // Example sales data
      },
    ],
  };

  // Data for the Orders chart
  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 35, 28, 40, 55, 60], // Example orders data
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <FontAwesome name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {/* Sales Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>
          <BarChart
            data={salesData}
            width={screenWidth - 24} // Width of the chart
            height={250}
            yAxisLabel="₱"
            chartConfig={{
              backgroundColor: '#4CAF50',
              backgroundGradientFrom: '#43A047',
              backgroundGradientTo: '#66BB6A',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              barRadius: 12, // Rounded bars
              barPercentage: 0.6, // Adjusted bar spacing
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: '#e3e3e3',
              },
              fillShadowGradient: '#43A047', // Bar fill color
              fillShadowGradientOpacity: 0.85,
              animationDuration: 1500, // Animation duration
            }}
            verticalLabelRotation={30}
            style={styles.chart}
          />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Total Sales: ₱ 10,000</Text>
            <Text style={styles.summaryText}>Orders: 120</Text>
            <Text style={styles.summaryText}>Revenue: ₱ 8,000</Text>
          </View>
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <BarChart
            data={ordersData}
            width={screenWidth - 24} // Width of the chart
            height={250}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#4CAF50',
              backgroundGradientFrom: '#43A047',
              backgroundGradientTo: '#66BB6A',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              barRadius: 12, // Rounded bars
              barPercentage: 0.6, // Adjusted bar spacing
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: '#e3e3e3',
              },
              fillShadowGradient: '#43A047', // Bar fill color
              fillShadowGradientOpacity: 0.85,
              animationDuration: 1500, // Animation duration
            }}
            verticalLabelRotation={30}
            style={styles.chart}
          />
          <View style={styles.orderBox}>
            <Text style={styles.orderText}>Pending Orders: 5</Text>
            <Text style={styles.orderText}>Shipped Orders: 100</Text>
            <Text style={styles.orderText}>Delivered Orders: 15</Text>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>View Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#069906',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  container: {
    flex: 1,
    padding: 12,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  orderBox: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
  },
  orderText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#43A047',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    transition: 'transform 0.2s ease-in-out',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});
