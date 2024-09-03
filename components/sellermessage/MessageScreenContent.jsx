import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const messages = [
  { id: '1', name: 'Ronnie Bulauan', lastMessage: 'Ano size netong Banga boss?', timestamp: '10:30 AM', profilePic: 'https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/449981890_1575169576393143_1393559107253070735_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGJlmm0bjKEsd1NVOugEkCeDRfONeGNz3QNF8414Y3PdAqjwVNsVSqMEMVEy6KAXNlsYshNVpf65e1qNgPOFdnx&_nc_ohc=dAxytuuaW0cQ7kNvgHVj9Js&_nc_ht=scontent.fmnl17-2.fna&oh=00_AYBB5FhtNQOPxpwu_TQuDSyA_NDCqujHFKDOOyLAyGgbcA&oe=66CA4CE2' },
];

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
  const router = useRouter();

  const renderItem = ({ item }) => (
    <MessageItem
      name={item.name}
      lastMessage={item.lastMessage}
      timestamp={item.timestamp}
      profilePic={item.profilePic}
      onPress={() => router.push('auth/message')}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="envelope" size={24} color="black" />
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
