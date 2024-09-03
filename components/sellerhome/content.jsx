import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function SellerDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Total Sales: ₱ 10,000</Text>
            <Text style={styles.summaryText}>Orders: 120</Text>
            <Text style={styles.summaryText}>Revenue: ₱ 8,000</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <View style={styles.orderBox}>
            <Text style={styles.orderText}>Pending Orders: 5</Text>
            <Text style={styles.orderText}>Shipped Orders: 100</Text>
            <Text style={styles.orderText}>Delivered Orders: 15</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Orders</Text>
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
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    padding: 12,
    top:25,
  },
  section: {
    marginVertical: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 4,
  },
  balanceBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  balanceText: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#069906',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
