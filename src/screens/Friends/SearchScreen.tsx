import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import api from '../../api/client';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  username: string;
  email: string;
  isAdded?: boolean;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/friends/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendUsername: string, friendId: string) => {
    try {
      await api.post('/friends/add', { friendUsername });
      setAddedUserIds([...addedUserIds, friendId]);
      Alert.alert('Success', `${friendUsername} has been added to your friends!`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error adding friend';
      Alert.alert('Error', msg);
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isAdded = addedUserIds.includes(item.id);
    const initials = item.username.substring(0, 2).toUpperCase();

    return (
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.usernameText}>@{item.username}</Text>
          <Text style={styles.emailText}>{item.email}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, isAdded && styles.addedButton]} 
          onPress={() => !isAdded && handleAddFriend(item.username, item.id)}
          disabled={isAdded}
        >
          {isAdded ? (
            <Ionicons name="checkmark-circle" size={20} color="white" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Find Friends</Text>
      </View>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFFC00" />
        </View>
      ) : query.trim() !== '' && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      ) : query.trim() === '' ? (
        <View style={styles.centerContainer}>
          <Ionicons name="people-outline" size={80} color="#333" />
          <Text style={styles.hintText}>Type a username to discover new friends!</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFC00', // Iconic Snapchat yellow
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  userInfo: {
    flex: 1,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emailText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#34C759', // Beautiful iOS green
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#8E8E93',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  hintText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
});
