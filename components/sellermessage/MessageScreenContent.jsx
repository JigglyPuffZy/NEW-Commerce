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
        
        const response = await fetch(`https://rancho-agripino.com/database/potteryFiles/fetch_user_messages_from_seller.php?user_id=${userId}`);
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
      onPress={() => router.push(`auth/message?seller_id=${item.akongID}&oder_id=`)}
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
        keyExtractor={(item) => item.sender_id.toString()} // Use recipient_id as key

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
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, 
    paddingVertical: 20, 
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#ffffff',
    marginTop: 1,
  },
  profilePicContainer: {
    borderWidth: 2,
    borderColor: '#069906',
    borderRadius: 30, 
    padding: 2, 
    marginRight: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#555',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#aaa',
  },
  listContent: {
    paddingTop: 16, 
  },
});
