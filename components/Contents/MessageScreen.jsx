import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MessageItem = ({ name, lastMessage, timestamp, profilePic, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.messageItem}>
    <View style={styles.profilePicContainer}>
      <Image source={{ uri: profilePic }} style={styles.profilePic} />
    </View>
    <View style={styles.messageContent}>
      <Text style={styles.messageName}>{name}</Text>
      <Text style={styles.messageText}>{lastMessage}</Text>
    </View>
    <Text style={styles.messageTimestamp}>{timestamp}</Text>
  </TouchableOpacity>
);

export default function MessageScreen() {
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        const userId = userData ? userData.id : null; // Get the current user's ID
        
        const response = await fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_user_messages.php?user_id=${userId}`);
        const data = await response.json();
        
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    
    fetchMessages();
  }, []);


  const renderItem = ({ item }) => (
    <MessageItem
      name={item.name}               // use "name" here
      lastMessage={item.lastMessage}  // use "lastMessage" here
      timestamp={item.timestamp}      // use "timestamp" here
      profilePic={item.profile_pic}   // use "profile_pic" here
      onPress={() => router.push(`auth/message?seller_id=${item.recipient_id}&oder_id=`)}
    />
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="envelope" size={24} color="#069906" />
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.recipient_id.toString()} // Use recipient_id as key

        contentContainerStyle={styles.listContent}
      />
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
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 4, // Shadow effect for elevation
  },
  headerText: {
    marginLeft: 10,
    fontSize: 24, // Increased font size for prominence
    fontWeight: 'bold',
    color: '#069906', // Match with icon color
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#ffffff',
    marginVertical: 4,
    borderRadius: 12, // Rounded corners for a softer look
    elevation: 3, // Shadow for depth
    overflow: 'hidden', // Ensures shadow and rounded corners work together
    transition: 'background-color 0.3s', // Smooth background color change on press
  },
  messageItemPressed: {
    backgroundColor: '#eaeaea', // Change background color on press
  },
  profilePicContainer: {
    borderWidth: 2,
    borderColor: '#069906',
    borderRadius: 40, // Increased for better circular profile picture
    padding: 2,
    marginRight: 12,
    elevation: 1, // Shadow for profile picture
  },
  profilePic: {
    width: 52, // Slightly larger profile picture for better visibility
    height: 52,
    borderRadius: 26,
  },
  messageContent: {
    flex: 1,
    paddingRight: 10, // Space between text and timestamp
  },
  messageName: {
    fontSize: 18, // Increased font size for better readability
    fontWeight: 'bold',
    color: '#333', // Darker color for contrast
  },
  messageText: {
    fontSize: 16, // Increased font size for better readability
    color: '#555',
  },
  messageTimestamp: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic', // Make timestamp italic for differentiation
  },
  listContent: {
    paddingTop: 16,
  },
});
