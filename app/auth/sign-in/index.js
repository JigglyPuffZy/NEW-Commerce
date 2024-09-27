import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [selectedRole, setSelectedRole] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [email, setEmail] = useState('');
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

  const handleSignIn = () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (selectedRole === 'buyer') {
      router.push('auth/home');
    } else if (selectedRole === 'seller') {
      router.push('auth/seller');
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
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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
    backgroundColor: '#F9FAFB',
  },
  scrollViewContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#E11D48',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
  },
  eyeIcon: {
    paddingLeft: 12,
  },
  roleContainer: {
    width: '100%',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    top:10,
  },
  roleSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#BBF7D0',
    borderColor: '#069906',
    borderWidth: 2,
  },
  radioLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  signInButtonContainer: {
    marginTop: 20,
    backgroundColor: '#069906',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  signInButton: {
    backgroundColor: '#069906',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 15,
    paddingHorizontal:120,
    paddingVertical:-120,
  
  },
  buttonDisabled: {
    backgroundColor: '#069906',
  },
  signInButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  createAccountButton: {
    marginTop: 16,
    paddingVertical: 16,
    bottom:10,
  },
  createAccountButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#069906',
  },
});

