import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ConversationScreen() {
  const navigation = useNavigation();

  const [messages, setMessages] = useState([
    { id: '1', text: '1500 lang boss!', sender: 'user' },
    { id: '2', text: 'Magkano yung banga boss?', sender: 'other' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/449981890_1575169576393143_1393559107253070735_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGJlmm0bjKEsd1NVOugEkCeDRfONeGNz3QNF8414Y3PdAqjwVNsVSqMEMVEy6KAXNlsYshNVpf65e1qNgPOFdnx&_nc_ohc=dAxytuuaW0cQ7kNvgHVj9Js&_nc_ht=scontent.fmnl17-2.fna&oh=00_AYBB5FhtNQOPxpwu_TQuDSyA_NDCqujHFKDOOyLAyGgbcA&oe=66CA4CE2' }} // Replace with your profile picture URL
            style={styles.profilePicture}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Ronnie Bulauan</Text>
            <Text style={styles.activeStatus}>Active Now</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#069906',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    top:20,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  activeStatus: {
    fontSize: 12,
    color: '#d0d0d0',
  },
  arrowButton: {
    marginRight: 10,
    top:20,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#069906',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#808080',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
