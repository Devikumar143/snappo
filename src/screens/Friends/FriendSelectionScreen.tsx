import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../api/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { uploadToCloudinary } from '../../utils/upload';

export default function FriendSelectionScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { photoUri } = route.params;

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends');
      setFriends(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(f => f !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const sendSnaps = async () => {
    if (selectedFriends.length === 0) return;
    
    setSending(true);
    try {
      const mediaUrl = await uploadToCloudinary(photoUri);

      await api.post('/snaps/send', {
        receiverIds: selectedFriends,
        mediaUrl: mediaUrl,
        duration: 5
      });

      alert('Snaps sent!');
      navigation.navigate('Camera');
    } catch (error) {
      console.error(error);
      alert('Failed to send snaps');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send to Friends</Text>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.friendItem, 
                selectedFriends.includes(item.id) && styles.selectedItem
              ]}
              onPress={() => toggleSelect(item.id)}
            >
              <Text style={styles.friendName}>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity 
        style={[styles.sendButton, selectedFriends.length === 0 && styles.disabledButton]}
        onPress={sendSnaps}
        disabled={selectedFriends.length === 0 || sending}
      >
        <Text style={styles.sendButtonText}>
          {sending ? 'Sending...' : `Send to ${selectedFriends.length} friends`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedItem: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  friendName: {
    color: 'white',
    fontSize: 18,
  },
  sendButton: {
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
