import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Modal, Animated, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const comments = [
  { rating: 4, author: 'Reymel', text: 'Okay naman yung banga pero maliit pala.' },
  { rating: 5, author: 'Andiemar', text: 'Saktong sakto yung product boss maganda.' },
];

const calculateAverageRating = (comments) => {
  if (comments.length === 0) return 0;
  const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
  return (totalRating / comments.length).toFixed(1);
};

const renderStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

export default function ProductScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const averageRating = calculateAverageRating(comments);

  const handleAddToCart = () => {
    setModalVisible(true);
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
    router.push('auth/message');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={40} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        
        {/* Main Content */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' }}
              style={styles.image}
            />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productTitle}>Banga</Text>
              <TouchableOpacity onPress={handleChat}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#069906" style={styles.messageIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.brand}>Kainan ng Aso</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{renderStars(Math.round(averageRating))}</Text>
              <Text style={styles.ratingCount}>({comments.length} reviews)</Text>
              <Text style={styles.averageRating}>Average Rating: {averageRating}</Text>
            </View>
            <Text style={styles.price}>₱125</Text>
            <Text style={styles.description}>
              This is a traditional, handmade earthenware jar or pot. It is likely used for storage or as a decorative piece. Its dark brown color and simple design give it a rustic and antique appearance.
            </Text>

            {/* Seller Information */}
            <TouchableOpacity style={styles.sellerInfo} onPress={() => handleCall('0917-123-4567')}>
              <Text style={styles.sellerName}>Seller: Kainan ng Aso</Text>
              <Text style={styles.contactNumber}>Contact: 0917-123-4567</Text>
              <Text style={styles.location}>Location: Santa Maria Mozozzing</Text>
            </TouchableOpacity>
            
            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Customer Comments</Text>
              <ScrollView style={styles.commentsList}>
                {comments.map((comment, index) => (
                  <View key={index} style={styles.comment}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentRating}>{renderStars(comment.rating)}</Text>
                      <Text style={styles.commentAuthor}>- {comment.author}</Text>
                    </View>
                    <Text style={styles.commentText}>"{comment.text}"</Text>
                  </View>
                ))}
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
           onPress={() => router.push('auth/payment')}
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
                opacity: animation, 
                transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] 
              }
            ]}
          >
            <Text style={styles.modalText}>Added to Cart!</Text>
            <TouchableOpacity 
              onPress={closeModal} 
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#069906',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    position: 'absolute',
    left: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 160,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1fae5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    marginBottom: 20,
  },
  productTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
  },
  messageIcon: {
    marginLeft: 8, // Spacing between the title and icon
  },
  brand: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    color: '#ffc107',
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  averageRating: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333333',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#069906',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  sellerInfo: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#069906',
  },
  location: {
    fontSize: 14,
    color: '#333333',
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentsList: {
    maxHeight: 200,
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentRating: {
    fontSize: 16,
    color: '#ffc107',
    marginRight: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#333333',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#069906',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#069906',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
