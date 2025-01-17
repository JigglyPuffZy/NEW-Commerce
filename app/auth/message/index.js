import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from "react";

export default function ConversationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { seller_id, oder_id } = route.params;  // Make sure to get both seller_id and order_id
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const buyerID = userData ? userData.id : null;

  const [messages, setMessages] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Loading state to prevent multiple submissions

  useEffect(() => {
    // Fetch messages and seller's name
    const fetchMessages = async () => {
      try {
        // Fetch messages first
        const response = await fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_messages.php?my_id=${buyerID}&order_id=${oder_id}`);
        const data = await response.json();
    
        // If no messages, fetch the seller's name
        if (data.length === 0) {
          const sellerResponse = await fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_seller_name.php?seller_id=${seller_id}`);
          const sellerData = await sellerResponse.json();
          
          if (sellerData.firstname != null && sellerData.lastname != null) {
            // Set the seller's name if available
            setSellerName(`${sellerData.firstname} ${sellerData.lastname}`);
          } else {
            // If no seller name, fetch the buyer's name
            const buyerResponse = await fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_buyer_name.php?seller_id=${buyerID}`);
            const sellerData = await buyerResponse.json();
            setSellerName(`${sellerData.firstname} ${sellerData.lastname}`);
          }
        } else {
          // If messages exist, use the first message's data for the seller name
          setSellerName(`${data[0].firstname} ${data[0].lastname}`);
        }
    
        // Update the messages state
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, [oder_id, seller_id, buyerID]);
  
  const sendMessage = async () => {
    if (newMessage.trim() && !isLoading) {  // Make sure message is not empty and no message is currently being sent
      const sender_id = buyerID;
      const recipient_id = seller_id;
    
      // Set loading state to prevent multiple submissions
      setIsLoading(true);
    
      try {
        const response = await fetch('https://rancho-agripino.com/database/potteryFiles/send_message.php', {
          method: 'POST',
          body: JSON.stringify({
            sender_id,
            recipient_id,
            message: newMessage,
            oder_id,
            reply_to: replyTo, // Include the reply_to field
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
    
        if (data.status === 'success') {
          // Assuming 'data.id' holds the new message ID from the server
          const newMsg = { 
            message: newMessage, 
            sender_id, 
            id: data.id,  // Ensure this ID matches the new message's ID
            reply_to: replyTo 
          };
    
          // Append the new message to the current list of messages
          setMessages(prevMessages => [
            ...prevMessages,
            newMsg
          ]);
    
          // Reset input fields and reply state
          setNewMessage('');
          setReplyTo(null);
          setReplyMessage(null);
    
          // Optional: Re-fetch messages to ensure the latest state
          await fetchMessages();  // This ensures the latest messages are fetched, though it may be redundant
        } else {
          console.error('Error sending message:', data.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const renderMessage = ({ item }) => {
    const isBuyerMessage = item.sender_id === buyerID;
  
    return (
      <View
        style={[
          styles.messageContainer,
          isBuyerMessage ? styles.buyerMessageContainer : styles.sellerMessageContainer,
        ]}
      >
        {/* Display Product Details */}
        {item.product_name && item.imagesPath && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image
              source={{
                uri: `https://rancho-agripino.com/database/potteryFiles/product_images/${item.imagesPath.split(',')[0]}`,
              }}
              style={{ width: 40, height: 40, marginRight: 10 }}
            />
            <Text style={{ fontWeight: 'bold' }}>{item.product_name}</Text>
          </View>
        )}
  
        {/* Display Reply-To Section */}
        {item.reply_to_message && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>
              Replying to: {item.reply_to_message}
            </Text>
          </View>
        )}
  
        {/* Display Main Message */}
        <Text style={[styles.messageText, isBuyerMessage ? styles.buyerText : styles.sellerText]}>
          {item.message}
        </Text>
  
        {/* Reply Button for Seller Messages */}
        {!isBuyerMessage && (
          <TouchableOpacity onPress={() => {
            setReplyTo(item.id);  // Ensure we are using the correct message ID as the reply ID
            setReplyMessage(item.message);  // Set the message that you are replying to
          }}>
            <Ionicons name="arrow-undo" size={16} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/449981890_1575169576393143_1393559107253070735_n.jpg' }} 
            style={styles.profilePicture}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{sellerName || 'Loading...'}</Text>
            <Text style={styles.activeStatus}>Active Now</Text>
          </View>
        </View>
      </View>

      <FlatList
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item) => item.id.toString()}  // Ensure item has a valid key
  contentContainerStyle={styles.messagesList}
  inverted
/>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isLoading}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  replyContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  replyText: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '70%',
    borderRadius: 10,
    padding: 10,
  },
  buyerMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f8ff', // Light blue for buyer messages
  },
  sellerMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6e6e6', // Light gray for seller messages
  },
  messageText: {
    fontSize: 16,
  },
  buyerText: {
    color: '#000', // Black for buyer text
  },
  sellerText: {
    color: '#333', // Dark gray for seller text
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#069906',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  activeStatus: {
    fontSize: 14,
    color: '#d0d0d0',
  },
  arrowButton: {
    marginRight: 15,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#069906',
    borderBottomLeftRadius: 20,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#808080',
    borderBottomRightRadius: 20,
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    elevation: 3,
  },
  sendButton: {
    backgroundColor: '#069906',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});
