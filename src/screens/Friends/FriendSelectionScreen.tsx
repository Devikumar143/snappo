import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Platform 
} from 'react-native';
import api from '../../api/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { uploadToCloudinary } from '../../utils/upload';
import { Feather } from '@expo/vector-icons';

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

      Alert.alert('Sent', 'Snaps sent successfully!');
      navigation.navigate('Camera');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send snaps.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>SEND TO FRIENDS</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : friends.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="users" size={32} color="#222" />
          <Text style={styles.emptyText}>You haven't added any friends yet</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const isSelected = selectedFriends.includes(item.id);
            const initials = item.username.substring(0, 2).toUpperCase();

            return (
              <TouchableOpacity 
                style={[
                  styles.friendItem, 
                  isSelected && styles.selectedItem
                ]}
                onPress={() => toggleSelect(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.avatar, isSelected && styles.selectedAvatar]}>
                  <Text style={[styles.avatarText, isSelected && styles.selectedAvatarText]}>
                    {initials}
                  </Text>
                </View>
                <Text style={[styles.friendName, isSelected && styles.selectedFriendName]}>
                  @{item.username}
                </Text>
                {isSelected && (
                  <Feather name="check" size={16} color="#000000" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
      
      <TouchableOpacity 
        style={[styles.sendButton, selectedFriends.length === 0 && styles.disabledButton]}
        onPress={sendSnaps}
        disabled={selectedFriends.length === 0 || sending}
        activeOpacity={0.9}
      >
        {sending ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text style={styles.sendButtonText}>
            {selectedFriends.length === 0 
              ? 'SELECT FRIENDS' 
              : `SEND TO ${selectedFriends.length} ${selectedFriends.length === 1 ? 'FRIEND' : 'FRIENDS'}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  listContainer: {
    paddingVertical: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0A0A0A',
    marginBottom: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedAvatar: {
    borderColor: '#CCCCCC',
    backgroundColor: '#000000',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  selectedAvatarText: {
    color: '#FFFFFF',
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.5,
  },
  selectedFriendName: {
    color: '#000000',
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 35 : 20,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#333333',
    fontSize: 14,
    marginTop: 15,
    letterSpacing: 0.5,
  }
});
