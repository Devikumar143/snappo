import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import api from '../../api/client';
import { saveAuthData } from '../../store/auth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const navigation = useNavigation<any>();

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !username)) {
      alert('Please fill out all fields');
      return;
    }
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { username, email, password };
      
      const response = await api.post(endpoint, payload);
      const { token, user } = response.data;
      
      await saveAuthData(token, user);
      navigation.replace('Main');
    } catch (error) {
      console.error(error);
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>S N A P P O</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Sign in to your account' : 'Create a new account'}</Text>
        
        {!isLogin && (
          <View style={[styles.inputWrapper, focusedField === 'username' && styles.inputWrapperFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#555"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}
        
        <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        
        <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.buttonText}>{isLogin ? 'LOG IN' : 'REGISTER'}</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setIsLogin(!isLogin)} 
          style={styles.switchButton}
          activeOpacity={0.6}
        >
          <Text style={styles.switchText}>
            {isLogin ? "CREATE ACCOUNT" : "SIGN IN INSTEAD"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    marginBottom: 20,
    height: 48,
    justifyContent: 'center',
  },
  inputWrapperFocused: {
    borderBottomColor: '#FFFFFF',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
  },
  switchButton: {
    marginTop: 25,
    paddingVertical: 10,
  },
  switchText: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  }
});
