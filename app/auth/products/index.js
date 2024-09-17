import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const maxRating = 5;
  const stars = Array.from({ length: maxRating }, (_, index) => 
    index < rating ? '★' : '☆'
  ).join('');
  return stars;
};

export default function ProductScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0)); // Initial opacity for modal
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
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
            <Text style={styles.productTitle}>Banga</Text>
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
            
            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Customer Comments</Text>
              {comments.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentRating}>{renderStars(comment.rating)}</Text>
                    <Text style={styles.commentAuthor}>- {comment.author}</Text>
                  </View>
                  <Text style={styles.commentText}>"{comment.text}"</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleAddToCart} 
            style={[styles.button, { backgroundColor: '#069906' }]}
          >
            <Text style={styles.buttonText}>ADD TO CART</Text>
          </TouchableOpacity>
          <TouchableOpacity 
           onPress={() => router.push('auth/payment')}
           style={[styles.button, { backgroundColor: '#069906' }]}
          >
            <Text style={styles.buttonText}>BUY NOW</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('auth/message')}
          style={[styles.button, { backgroundColor: '#069906' }]}>
            <Text style={styles.buttonText}>MESSAGE SELLER</Text>
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
                transform: [
                  { scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1]
                  }) },
                ],
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
    borderRadius: 12,
    resizeMode: 'contain',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rating: {
    color: '#fbbf24',
    fontSize: 18,
  },
  ratingCount: {
    marginLeft: 6,
    color: '#6b7280',
  },
  averageRating: {
    marginLeft: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  commentsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentRating: {
    color: '#fbbf24',
    fontSize: 16,
  },
  commentAuthor: {
    marginLeft: 6,
    color: '#374151',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#6b7280',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  button: {
    backgroundColor: '#069906',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign:'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#069906',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
