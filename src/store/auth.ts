import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuthData = async (token: string, user: any) => {
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getAuthData = async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');
  return { token, user: user ? JSON.parse(user) : null };
};

export const clearAuthData = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};
