import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';

const initialProducts = [
    { id: '1', title: 'Banga Ng Aso', description: 'A stylish and durable ceramic pet bowl...', price: '₱ 3000.00', images: ['https://cdn.shopify.com/s/files/1/1714/4379/products/PK_Ceramics_BangaPlanter_Black_Large_1_medium.jpg?v=1508971124', 'https://placehold.co/300?text=Product+Image+1', 'https://placehold.co/300?text=Product+Image+2'] },
    { id: '2', title: 'Banga Ng Aso', description: 'A stylish and durable ceramic pet bowl...', price: '₱ 2000.00', images: ['https://placehold.co/300?text=Product+Image'] },
    { id: '3', title: 'Banga Ng Aso', description: 'A stylish and durable ceramic pet bowl...', price: '₱ 4000.00', images: ['https://placehold.co/300?text=Product+Image'] },
];

export default function Widget() {
    const [products, setProducts] = useState(initialProducts);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const handleDelete = (productId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    onPress: () => setProducts(prevProducts => prevProducts.filter(product => product.id !== productId)),
                }
            ],
            { cancelable: true } 
        );
    };

    const handleImagePress = (images) => {
        setSelectedImages(images);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImages([]);
        setCurrentIndex(0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Products</Text>
                <TouchableOpacity 
                    onPress={() => router.push('auth/addproduct')}
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.main}>
                {products.map(product => (
                    <View key={product.id} style={styles.card}>
                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={() => handleImagePress(product.images)}>
                                <Image 
                                    source={{ uri: product.images[0] }} // Show only the first image
                                    style={styles.productImage} 
                                    onError={() => {/* Handle image load error */}}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.productTitle}>{product.title}</Text>
                            <Text style={styles.productDescription}>{product.description}</Text>
                            <Text style={styles.productPrice}>{product.price}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    onPress={() => router.push('auth/editproduct')} 
                                    style={styles.editButton}
                                >
                                    <FontAwesome name="pencil" size={16} color="#fff" />
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleDelete(product.id)} 
                                    style={styles.deleteButton}
                                >
                                    <FontAwesome name="trash" size={16} color="#fff" />
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            {/* Modal for image carousel */}
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Carousel
                            loop
                            width={400} // Adjust for fullscreen width
                            height={600} // Adjust for fullscreen height
                            autoPlay={false}
                            data={selectedImages}
                            scrollAnimationDuration={300}
                            onSnapToItem={(index) => setCurrentIndex(index)}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.fullscreenImage} resizeMode="contain" />
                            )}
                        />
                        <View style={styles.imageIndexContainer}>
                            <Text style={styles.imageIndexText}>{`${currentIndex + 1} of ${selectedImages.length}`}</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <FontAwesome name="times" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#069906', // Green header color
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },
    addButtonText: {
        color: '#069906', // Green text for the add button
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    main: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#ddd',
        borderRadius: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    productDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#069906', // Green price text
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    editButton: {
        backgroundColor: '#069906', // Green button for editing
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#f44336', // Red button for deleting
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 140, // Added padding at the top for spacing
        position: 'relative',
    },
    fullscreenImage: {
        width: '100%',
        height: '90%', // Adjusted height for better spacing
    },
    imageIndexContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    imageIndexText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'transparent',
        padding: 8,
        borderRadius: 50,
    },
});
