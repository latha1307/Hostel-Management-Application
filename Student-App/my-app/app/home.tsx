 import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigationBar from '../components/BottomNavigationBar';

const Home = () => {
  const router = useRouter();

  const navItems = [
    { title: 'Apply Leave', icon: require('../assets/images/leave.png'), route: '/leave' },
    { title: 'Mess Bill', icon: require('../assets/images/mess.png'), route: '/mess-bill' },
    { title: 'Attendance', icon: require('../assets/images/attendence.png'), route: '/attendance' },
    { title: 'Notice Board', icon: require('../assets/images/notice.png'), route: '/notice-board' },
    { title: 'Raise Complaint', icon: require('../assets/images/complaint.png'), route: '/complaint' },
    { title: 'Phone Directory', icon: require('../assets/images/phone.png'), route: '/phone-directory' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/photo.png')} // Replace with user profile picture
          style={styles.profileImage}
        />
        <Text style={styles.title}>Name</Text>
        </View>
        <Image
          source={require('../assets/images/tpgitlogo.png')} // Replace with TPGIT logo
          style={styles.logo}
        />
      </View>

      {/* Grid Navigation */}
      <View style={styles.grid}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(item.route)}
          >
            <Image source={item.icon} style={styles.cardIcon} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <BottomNavigationBar />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
    borderWidth: 2,
    borderColor: '#007BFF', // Optional border color
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
   // Space between name and profile picture
  },
  logo: {
    width: 180,
    height: 60,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 2,
    paddingVertical: 10
  },
  card: {
    width: '40%',
    margin: 10,
    marginVertical: 3,
    marginHorizontal: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  cardIcon: {
    width: 100,
    height: 60,
    borderRadius: 10, // Rounded corners for card images
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});