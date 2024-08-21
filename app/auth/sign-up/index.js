import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SignUp() {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        placeholder="Name"
        style={styles.input}
        placeholderTextColor="#aaa" // Light grey placeholder text color for better contrast
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa" // Light grey placeholder text color for better contrast
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#aaa" // Light grey placeholder text color for better contrast
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#aaa" // Light grey placeholder text color for better contrast
      />
      
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => router.push('auth/sign-in')}
        style={styles.signInLink}
      >
        <Text style={styles.signInLinkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#069305',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff', // Black background color
    color: '#000', // White text color
  },
  signUpButton: {
    backgroundColor: '#069305',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInLinkText: {
    color: '#069305',
    fontSize: 16,
  },
});
