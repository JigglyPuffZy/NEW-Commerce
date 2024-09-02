import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, SafeAreaView, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function Widget() {
    const [rating, setRating] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const getRatingIcon = (rating) => {
        switch (rating) {
            case 1:
                return <MaterialIcons name="mood-bad" size={30} color="red" />;
            case 2:
                return <MaterialIcons name="mood" size={30} color="orange" />;
            case 3:
                return <MaterialIcons name="mood" size={30} color="black" />;
            case 4:
                return <MaterialIcons name="mood" size={30} color="green" />;
            case 5:
                return <MaterialIcons name="mood" size={30} color="lightgreen" />;
            default:
                return null;
        }
    };

    const handleSubmit = () => {
        setModalVisible(true); // Show the modal
    };

    const handleOkay = () => {
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
                    <Text style={styles.title}>"How was your order? Your feedback is invaluable to us. Please let us know how we did!"</Text>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableWithoutFeedback key={star} onPress={() => setRating(star)}>
                                <MaterialIcons 
                                    name={star <= rating ? "star" : "star-border"} 
                                    size={30} 
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
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    ratingLabel: {
        fontSize: 30,
        marginTop: 8,
    },
    commentsContainer: {
        marginBottom: 16,
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
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
    },
    submitButton: {
        backgroundColor: '#069305', // Primary color
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonText: {
        color: '#ffffff', // Text color for the button
        fontWeight: '600',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
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
        fontSize: 20,
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
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#ffffff', // Text color for the button
        fontWeight: '600',
        fontSize: 16,
    },
});
