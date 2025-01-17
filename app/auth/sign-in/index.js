import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getPhpFilePath } from '../utils/pathHelper';
import $ from 'jquery';

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [selectedRole, setSelectedRole] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (selectedRole) {
      setButtonDisabled(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setButtonDisabled(true);
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedRole, fadeAnim]);

  const handleSignIn = async () => {
    setErrorMessage('');
  
    if (!contact || !password) {
      setErrorMessage('Phone number and password are required.');
      return;
    }

    console.log("This is the contact", contact)
    console.log("This is the password", password)
    console.log("This is the role", selectedRole)

  
    const loginUrl = getPhpFilePath('login.php'); // URL
  
    try {
      const formData = new URLSearchParams();
      formData.append('contact', contact);
      formData.append('password', password);
      formData.append('role', selectedRole);
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      console.log('Received response READY for backend:', response);
  // Ensure the response is valid
  if (response.ok) {
    const result = await response.json();  // Parsing the response as JSON
    console.log('Parsed response JSON:', result);  // Debugging log

    if (result.success) {
      sessionStorage.setItem('userData', JSON.stringify(result.user_data)); // Store user data
      if (selectedRole === 'buyer') {
        router.push('auth/home');
      } else if (selectedRole === 'seller') {
        router.push('auth/seller');
      }
    } else {
      setErrorMessage(result.message || 'Invalid login credentials.');
    }
  } else {
    console.log('Response not ok:', response);  // If the response isn't ok
    setErrorMessage('Failed to login. Please try again.');
  }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('An error occurred while logging in.');
    }
  };


  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType=""
              autoCapitalize="none"
              value={contact}
              onChangeText={setContact}

            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Feather
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={20}
                color={'#999'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.roleContainer}>
          <Text style={styles.label}>Select your role:</Text>
          <View style={styles.roleSelectionRow}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'buyer' && styles.selectedRole,
              ]}
              onPress={() => setSelectedRole('buyer')}
            >
              <Text style={styles.radioLabel}>Buyer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'seller' && styles.selectedRole,
              ]}
              onPress={() => setSelectedRole('seller')}
            >
              <Text style={styles.radioLabel}>Seller</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.signInButtonContainer, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.signInButton, buttonDisabled && styles.buttonDisabled]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={buttonDisabled}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          onPress={() => router.push('auth/sign-up')}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountButtonText}>Create an Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#FFE8E8',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#333333',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212529',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212529',
  },
  eyeIcon: {
    paddingLeft: 15,
  },
  roleContainer: {
    width: '100%',
    marginBottom: 35,
    padding: 25,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  roleSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F1F3F5',
    borderRadius: 15,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedRole: {
    backgroundColor: '#E3FCE3',
    borderColor: '#069906',
    borderWidth: 2,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  radioLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  signInButtonContainer: {
    width: '100%',
    marginTop: 25,
    shadowColor: '#069906',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  signInButton: {
    backgroundColor: '#069906',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 18,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#82C782',
  },
  signInButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  createAccountButton: {
    marginTop: 20,
    paddingVertical: 16,
  },
  createAccountButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#069906',
    textDecorationLine: 'underline',
  },
});

