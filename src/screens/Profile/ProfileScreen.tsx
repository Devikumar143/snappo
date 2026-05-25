import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Platform 
} from 'react-native';
import { getAuthData, clearAuthData } from '../../store/auth';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/client';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const auth = await getAuthData();
      setUser(auth.user);

      const response = await api.get('/friends');
      setFriendsCount(response.data.length);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from Snappo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await clearAuthData();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : 'SN';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <TouchableOpacity style={styles.logoutIconButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.usernameText}>@{user?.username || 'snapper'}</Text>
        <Text style={styles.emailText}>{user?.email || 'user@snappo.com'}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>VERIFIED CREATOR</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{friendsCount}</Text>
          <Text style={styles.statLabel}>FRIENDS</Text>
        </View>
        
        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statCount}>12</Text>
          <Text style={styles.statLabel}>SENT</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statCount}>8</Text>
          <Text style={styles.statLabel}>RECEIVED</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Information', 'This feature is coming soon!')}>
          <View style={styles.menuItemLeft}>
            <Feather name="user" size={16} color="#FFFFFF" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemText}>Edit Account Details</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#444444" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Information', 'This feature is coming soon!')}>
          <View style={styles.menuItemLeft}>
            <Feather name="bell" size={16} color="#FFFFFF" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemText}>Notification Settings</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#444444" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Information', 'This feature is coming soon!')}>
          <View style={styles.menuItemLeft}>
            <Feather name="lock" size={16} color="#FFFFFF" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemText}>Privacy & Security</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#444444" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOG OUT</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  logoutIconButton: {
    padding: 8,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 35,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#050505',
    borderRadius: 2,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  emailText: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 1,
  },
  badgeText: {
    color: '#888888',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#050505',
    borderRadius: 2,
    paddingVertical: 20,
    marginBottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 9,
    color: '#555555',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#151515',
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 15,
    letterSpacing: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    paddingVertical: 14,
    marginBottom: 5,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 2,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
