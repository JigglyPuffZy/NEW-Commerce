import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

export default function AddressSelection() {
  const [selectedValue, setSelectedValue] = useState('jigglypuff');
  const router = useRouter(); 

  const handleAddAddress = () => {
    
    router.push('/auth/editaddress');
  };

  const handleGoBack = () => {
    
    router.back(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={24} color="#069906" />
          </TouchableOpacity>
          <Text style={styles.header}>Address Selection</Text>
        </View>

        <View style={styles.addressContainer}>
          <RadioButton
            value="jigglypuff"
            status={selectedValue === 'jigglypuff' ? 'checked' : 'unchecked'}
            color="#069906"
            onPress={() => setSelectedValue('jigglypuff')}
          />
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Viah Daquioag</Text>
            <Text style={styles.addressPhone}>(+63) 906 692 7818</Text>
            <Text style={styles.addressDetail}>
              Purok 6, Mozzozzin North, Santa Maria, Isabela, North Luzon, 3330
            </Text>
            <Text style={styles.defaultTag}>Default</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/auth/editaddress')}
            style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <View style={styles.addressContainer}>
          <RadioButton
            value="jiggly"
            status={selectedValue === 'jiggly' ? 'checked' : 'unchecked'}
            color="#069906"
            onPress={() => setSelectedValue('jiggly')}
          />
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Rosalie Gatan</Text>
            <Text style={styles.addressPhone}>(+63) 910 463 3369</Text>
            <Text style={styles.addressDetail}>
              Purok 6, Buenavista, Santa Maria, Isabela, North Luzon, 3330
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/auth/editaddress')}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Text 
             onPress={() => router.push('/auth/addnew')}
          style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressName: {
    fontWeight: '500',
    fontSize: 16,
  },
  addressPhone: {
    color: '#6B6B6B',
    fontSize: 14,
  },
  addressDetail: {
    fontSize: 14,
    color: '#6B6B6B',
    marginVertical: 4,
  },
  defaultTag: {
    fontSize: 12,
    color: '#069906',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#069906',
    fontSize: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 12,
  },
  addButton: {
    backgroundColor: '#069906',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
