import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://tpgit.edu.in/wp-content/uploads/2019/03/tpgit_logo.png' }}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back!</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#64B5F6" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#64B5F6"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#64B5F6" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64B5F6"
          secureTextEntry
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text style={styles.registerText} onPress={() => alert('Navigate to Register')}>Register here</Text>
      </Text>

      <Text style={styles.disclaimerText}>
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#0D47A1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    width: '90%',
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0D47A1',
  },
  forgotPasswordText: {
    color: '#42A5F5',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 16,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#42A5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: '#0D47A1',
    textAlign: 'center',
  },
  registerText: {
    color: '#1565C0',
    fontWeight: 'bold',
  },
  disclaimerText: {
    marginTop: 16,
    fontSize: 12,
    color: '#64B5F6',
    textAlign: 'center',
    maxWidth: 400,
  },
});