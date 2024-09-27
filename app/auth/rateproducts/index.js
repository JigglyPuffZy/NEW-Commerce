import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, SafeAreaView, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function Widget() {
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState(''); // State for comments
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const getRatingIcon = (rating) => {
        switch (rating) {
            case 1: return '😡';
            case 2: return '😞';
            case 3: return '😐';
            case 4: return '😊';
            case 5: return '😁';
            default: return null;
        }
    };

    const handleSubmit = () => {
        setModalVisible(true); // Show the modal
    };

    const handleOkay = () => {
        setRating(0); // Reset the rating
        setComments(''); // Clear comments
        setModalVisible(false); // Hide the modal
        router.push('/auth/rate'); // Navigate to the desired route
    };

    const handleClose = () => {
        setModalVisible(false); // Hide the modal
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>
                        "How was your order? Your feedback is invaluable to us. Please let us know how we did!"
                    </Text>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableWithoutFeedback key={star} onPress={() => setRating(star)}>
                                <MaterialIcons 
                                    name={star <= rating ? "star" : "star-border"} 
                                    size={40} 
                                    color={star <= rating ? "#FFD700" : "#ccc"} 
                                />
                            </TouchableWithoutFeedback>
                        ))}
                    </View>
                    <Text style={styles.ratingLabel}>{getRatingIcon(rating)}</Text>
                </View>
                <View style={styles.commentsContainer}>
                    <Text style={styles.label}>Comments</Text>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Your comments..."
                        placeholderTextColor="#999" // Placeholder text color
                        value={comments}
                        onChangeText={setComments} // Update comments state
                    />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Enhanced Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <MaterialIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Thank You!</Text>
                        <Text style={styles.modalText}>Thank you for your rating. Your feedback is valuable to us.</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleOkay}>
                            <Text style={styles.modalButtonText}>Okay</Text>
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
        backgroundColor: '#ffffff', // Background color remains white
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    innerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333', // Title text color
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 26, // Increase line height for better readability
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    ratingLabel: {
        fontSize: 40,
        marginTop: 8,
    },
    commentsContainer: {
        marginBottom: 16,
        width: '100%', // Ensure full width
    },
    label: {
        fontSize: 16,
        color: '#666666', // Label color
        marginBottom: 8,
    },
    textInput: {
        width: '100%',
        padding: 12,
        borderColor: '#cccccc', // Border color
        borderWidth: 1,
        borderRadius: 10, // More rounded corners
        backgroundColor: '#f9f9f9',
        elevation: 1, // Add slight elevation for shadow
    },
    submitButton: {
        backgroundColor: '#069305', // Primary color
        paddingVertical: 12,
        borderRadius: 10, // More rounded corners
        alignItems: 'center',
        marginTop: 24,
        elevation: 4, // Adds a shadow effect on Android
    },
    submitButtonText: {
        color: '#ffffff', // Text color for the button
        fontWeight: '600',
        fontSize: 18, // Slightly larger font size
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%', // Adjust width for better mobile experience
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16, // Make corners rounded
        alignItems: 'center',
        elevation: 5, // Adds a shadow effect on Android
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        borderRadius: 50,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#069305', // Primary color
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10, // More rounded corners
        alignItems: 'center',
        elevation: 2, // Adds a shadow effect on Android
    },
    modalButtonText: {
        color: '#ffffff', // Text color for the button
        fontWeight: '600',
        fontSize: 16,
    },
});
