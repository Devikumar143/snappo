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

      // Fetch friends list to get exact count
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
        <ActivityIndicator size="large" color="#FFFC00" />
      </View>
    );
  }

  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : 'SN';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.logoutIconButton} onPress={handleLogout}>
          <Feather name="log-out" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarGlowContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <Text style={styles.usernameText}>@{user?.username || 'snapper'}</Text>
        <Text style={styles.emailText}>{user?.email || 'user@snappo.com'}</Text>

        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color="#000" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>Snappo Creator</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{friendsCount}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        
        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statCount}>12</Text>
          <Text style={styles.statLabel}>Snaps Sent</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statCount}>8</Text>
          <Text style={styles.statLabel}>Received</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Information', 'This feature is coming soon!')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-outline" size={20} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Edit Account Info</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Information', 'This feature is coming soon!')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Notification Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Information', 'This feature is coming soon!')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '950',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  logoutIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 20,
  },
  avatarGlowContainer: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: '#FFFC00', // yellow glow ring
    marginBottom: 15,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFC00',
  },
  usernameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFC00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#2C2C2E',
  },
  menuSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
