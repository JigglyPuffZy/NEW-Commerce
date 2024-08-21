import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomCheckbox from '../checkbox/customcheckbox';

const cartItems = [
  { id: '1', name: 'Item 1', price: '₱10.00', quantity: 1, image: require('./../../assets/images/Banga 2.jpg') },
  { id: '2', name: 'Item 2', price: '₱15.00', quantity: 2, image: require('./../../assets/images/Banga 3.jpg') },
  { id: '3', name: 'Item 3', price: '₱40.00', quantity: 1, image: require('./../../assets/images/Banga 4.jpg') },
];

const BodyScreen = () => {
  const [items, setItems] = useState(cartItems);
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (itemId) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const handleQuantityChange = (itemId, change) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CustomCheckbox
        isChecked={!!checkedItems[item.id]}
        onCheck={() => handleCheckboxChange(item.id)}
      />
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (checkedItems[item.id]) {
        return total + parseFloat(item.price.replace('₱', '')) * item.quantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.itemList}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{calculateTotal()}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  itemList: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
    marginTop:25,
    
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    marginLeft: 20,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  checkoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#069906',
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BodyScreen;
