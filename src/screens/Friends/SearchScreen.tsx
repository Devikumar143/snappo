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
import { Feather } from '@expo/vector-icons';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);
  const [focusedInput, setFocusedInput] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers();
    }, 450);

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
      Alert.alert('Added', `@${friendUsername} is now your friend.`);
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
          activeOpacity={0.7}
        >
          {isAdded ? (
            <Feather name="check" size={14} color="#888888" />
          ) : (
            <Text style={styles.addButtonText}>ADD</Text>
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
        <Text style={styles.title}>DISCOVER</Text>
      </View>

      <View style={[styles.searchBarContainer, focusedInput && styles.searchBarFocused]}>
        <Feather name="search" size={16} color="#444444" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search username..."
          placeholderTextColor="#444444"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Feather name="x" size={16} color="#888888" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : query.trim() !== '' && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No matches found</Text>
        </View>
      ) : query.trim() === '' ? (
        <View style={styles.centerContainer}>
          <Feather name="users" size={32} color="#151515" />
          <Text style={styles.hintText}>Search usernames to add new connections</Text>
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
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    marginHorizontal: 25,
    paddingHorizontal: 5,
    height: 48,
    marginBottom: 20,
  },
  searchBarFocused: {
    borderBottomColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
    letterSpacing: 0.5,
  },
  clearIcon: {
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0A0A0A',
    paddingVertical: 14,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userInfo: {
    flex: 1,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  emailText: {
    fontSize: 12,
    color: '#444444',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    borderColor: '#151515',
    backgroundColor: '#050505',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#444444',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  hintText: {
    color: '#444444',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
});
