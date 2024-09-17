import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSignIn = () => {
    setModalVisible(true);
  };

  const selectRole = (role) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      router.push(role === 'buyer' ? 'auth/home' : 'auth/seller');
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Let's Sign You In</Text>
        <Text style={styles.subtitle}>Welcome Back, we've missed you!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Feather
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={20}
                color={Colors.DARK_GRAY}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSignIn}
          style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
          
        <TouchableOpacity
          onPress={() => router.push('auth/sign-up')}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.modalTitle}>Select Your Role</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => selectRole('buyer')}
            >
              <Text style={styles.modalButtonText}>Buyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => selectRole('seller')}
            >
              <Text style={styles.modalButtonText}>Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollViewContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Poppins-bold',
    fontSize: 30,
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-medium',
    fontSize: 20,
    color: Colors.GRAY,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-medium',
    fontSize: 16,
    color: Colors.DARK_GRAY,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    padding: 14,
    borderRadius: 10,
    fontFamily: 'Poppins-regular',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: 'Poppins-regular',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  signInButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  signInButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
    fontSize: 18,
  },
  createAccountButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    elevation: 3,
  },
  createAccountButtonText: {
    color: Colors.DARK_GRAY,
    fontFamily: 'Poppins-medium',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 350,
    backgroundColor: Colors.WHITE,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontFamily: 'Poppins-bold',
    fontSize: 22,
    color: Colors.PRIMARY,
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
    fontSize: 18,
  },
  modalCloseButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: Colors.GRAY,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  modalCloseButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-medium',
    fontSize: 18,
  },
});
