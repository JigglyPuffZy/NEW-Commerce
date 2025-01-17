import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Dimensions } from 'react-native';
import CustomCheckbox from '../../components/checkbox/customcheckbox'; // Ensure CustomCheckbox is correctly implemented
import { useRouter } from 'expo-router';

export default function Widget() {
  const [checkedItems, setCheckedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const { width, height } = Dimensions.get('window');
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const buyerId = userData ? userData.id : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_cart.php?buyerId=${buyerId}`);
        const data = await response.json();
        setProducts(data);
  
        // Initialize checkedItems with quantity_carted values from fetched products
        const initialCheckedItems = {};
        data.forEach(item => {
          initialCheckedItems[item.cart_id] = {
            checked: false,
            quantity: item.quantity_carted, // Set the initial quantity from database
          };
        });
        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchProducts();
  }, [buyerId]);

  const toggleCheckbox = (cartId) => {
    setCheckedItems((prev) => {
      const newCheckedItems = {
        ...prev,
        [cartId]: {
          ...prev[cartId],
          checked: !(prev[cartId]?.checked), // Use optional chaining
          quantity: prev[cartId]?.quantity || 1, // Ensure quantity is defined
        },
      };
  
      const newTotalPrice = Object.keys(newCheckedItems)
        .filter(key => newCheckedItems[key].checked)
        .reduce((sum, key) => sum + (products.find(p => p.cart_id === key).price * newCheckedItems[key].quantity), 0);
  
      setTotalPrice(newTotalPrice);
      return newCheckedItems;
    });
  };

  const updateQuantityInDatabase = async (cartId, quantity) => {
    try {
      const response = await fetch(`https://rancho-agripino.com/database/potteryFiles/update_cart_quantity.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      // Remove product from the database
      const response = await fetch(`https://rancho-agripino.com/database/potteryFiles/remove_from_cart.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from cart');
      }

      // Remove the product from the state
      setProducts((prevProducts) => prevProducts.filter((product) => product.cart_id !== cartId));
      setCheckedItems((prevCheckedItems) => {
        const newCheckedItems = { ...prevCheckedItems };
        delete newCheckedItems[cartId];
        return newCheckedItems;
      });

      // Recalculate total price
      const newTotalPrice = Object.keys(checkedItems)
        .filter(key => checkedItems[key].checked)
        .reduce((sum, key) => sum + (products.find(p => p.cart_id === key).price * checkedItems[key].quantity), 0);
  
      setTotalPrice(newTotalPrice);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to remove product from cart');
    }
  };

  const changeQuantity = (cartId, change) => {
    setCheckedItems((prev) => {
      const currentItem = prev[cartId];
  
      if (!currentItem) {
        // If currentItem is undefined, return prev without any changes
        return prev;
      }
  
      const newQuantity = Math.max(parseInt(currentItem.quantity, 10) + change, 1); // Ensure quantity is an integer
      const newCheckedItems = {
        ...prev,
        [cartId]: {
          ...currentItem,
          quantity: newQuantity,
        },
      };
  
      // Update the quantity in the database
      updateQuantityInDatabase(cartId, newQuantity);
  
      const newTotalPrice = Object.keys(newCheckedItems)
        .filter(key => newCheckedItems[key].checked)
        .reduce((sum, key) => sum + (products.find(p => p.cart_id === key).price * newCheckedItems[key].quantity), 0);
  
      setTotalPrice(newTotalPrice);
      return newCheckedItems;
    });
  };

  const handleCheckout = () => {
    const selectedItems = Object.keys(checkedItems).filter(key => checkedItems[key].checked);
    const selectedItemsCount = selectedItems.length;
  
    if (selectedItemsCount === 0) {
      Alert.alert('Error', 'Please check an item before checking out', [{ text: 'OK' }], { cancelable: false });
    } else {
      // Pass selected cart_ids as a query parameter
      router.push({
        pathname: 'auth/payment',
        params: { cartId: selectedItems },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingHorizontal: width * 0.05 }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingVertical: height * 0.02 }]}>
        <View style={[styles.card, { paddingHorizontal: width * 0.04 }]}>
          {products.map((item) => {
            const imageArray = item.imagesPath
              ? item.imagesPath.split(",").map((img) => img.trim())
              : [];
            const firstImage = imageArray[0] || ""; // Get the first image URL
            return (
              <View key={item.cart_id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <View style={styles.checkboxContainer}>
                    <CustomCheckbox
                      isChecked={checkedItems[item.cart_id]?.checked || false}
                      onCheck={() => toggleCheckbox(item.cart_id)}
                    />
                    <Text style={styles.itemHeaderText}>{item.shopName}</Text>
                  </View>
                </View>
                <View style={styles.itemContent}>
                  <Image source={{ uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${firstImage}` }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.product_name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemPrice}>₱{item.price}</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => changeQuantity(item.cart_id, -1)}>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{checkedItems[item.cart_id]?.quantity || 1}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => changeQuantity(item.cart_id, 1)}>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                 
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.cart_id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
              </View>
            );
          })}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalPrice}>₱{totalPrice.toLocaleString()}</Text>
            </View>
            <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>
                Check Out ({Object.keys(checkedItems).filter(key => checkedItems[key].checked).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  removeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top:75,
  },
  itemContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeaderText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#069906',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
