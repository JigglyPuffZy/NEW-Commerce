import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ContactUs() {
  const router = useRouter();

  const handlePhonePress = () => {
    Linking.openURL('tel:+639175556789'); 
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:viahdaquioag@gmail.com'); 
  };

  const handleFacebookPress = () => {
    Linking.openURL('https://www.facebook.com/your-facebook-username'); // Replace with your Facebook profile link
  };

  const handleInstagramPress = () => {
    Linking.openURL('https://www.instagram.com/your-instagram-username'); // Replace with your Instagram profile link
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color="#069906" />
        </TouchableOpacity>
        
        <View style={styles.card}>
          <Text style={styles.header}>Contact Us</Text>
          
          <View style={styles.section}>
            <Text style={styles.subHeader}>Get in Touch</Text>
            <Text style={styles.description}>If you have any inquiries, get in touch with us. We'll be happy to help you.</Text>
            
            <View style={styles.contactInfo}>
              <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
                <FontAwesome name="phone" size={20} color="#069906" style={styles.contactIcon} />
                <Text style={styles.contactText}>+63 (917) 555-6789</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                <FontAwesome name="envelope" size={20} color="#069906" style={styles.contactIcon} />
                <Text style={styles.contactText}>viahdaquioag@gmail.com</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.subHeader}>Social Media</Text>
            <View style={styles.socialMediaList}>
              <TouchableOpacity style={styles.socialMediaItem} onPress={handleFacebookPress}>
                <FontAwesome name="facebook" size={20} color="#1877f2" style={styles.socialMediaIcon} />
                <Text style={styles.socialMediaText}>
                  <Text style={styles.socialMediaTitle}>Facebook:</Text> Viah Saquing Daquioag.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialMediaItem} onPress={handleInstagramPress}>
                <FontAwesome name="instagram" size={20} color="#e1306c" style={styles.socialMediaIcon} />
                <Text style={styles.socialMediaText}>
                  <Text style={styles.socialMediaTitle}>Instagram:</Text> Viah Saquing Daquioag.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',  
  },
  scrollContainer: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: '#ffffff',  
    padding: 16,
    borderRadius: 12,  
    shadowColor: '#000000',  
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',  
    color: '#333',
    marginBottom: 12,
  },
  section: {
    marginTop: 16,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',  
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',  
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',  
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  socialMediaList: {
    marginTop: 16,
  },
  socialMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialMediaIcon: {
    marginRight: 12,
  },
  socialMediaText: {
    fontSize: 16,
    color: '#555',
  },
  socialMediaTitle: {
    fontWeight: '600',
    color: '#333',
  },
});
