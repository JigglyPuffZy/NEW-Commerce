import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Colors = {
  background: '#f8f8f8',
  text: '#333',
  buttonBackground: '#069305',
  buttonText: '#ffffff',
};

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./../assets/images/login.png')}
          style={styles.image}
        />
      </View>
      <View>
        <Text style={styles.title}>
        Empowering our community, one banga at a time. Together, let us discover, connect and thrive in the world of unique bangas.
        </Text>
      </View>
      <TouchableOpacity style={styles.button}
      onPress={()=>router.push('auth/sign-in')}
      >
        <Text style={styles.buttonText}>Let's Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 220,
    height: 500,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
    marginTop: 60,
  },
  title: {
    fontSize: 15,
    fontFamily: 'serif',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    color: Colors.text,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 5,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 18,
    fontWeight: 'Poppins-medium',
    textAlign: 'center',
  },
});
