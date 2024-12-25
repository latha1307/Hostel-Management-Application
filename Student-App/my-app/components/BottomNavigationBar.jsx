// components/BottomNavigationBar.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const BottomNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Home", route: "/home", icon: "home" },
    { label: "Mess Bill", route: "/mess-bill", icon: "receipt" },
    { label: "Notifications", route: "/notifications", icon: "notifications" },
    { label: "Account", route: "/account", icon: "account-circle" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tab}
          onPress={() => router.push(tab.route)}
        >
          <Icon
            name={tab.icon}
            size={24}
            style={[
              styles.icon,
              pathname === tab.route && styles.activeIcon, // Apply active styles for icon
            ]}
          />
          <Text
            style={[
              styles.tabText,
              pathname === tab.route && styles.activeTabText, // Apply active styles for text
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute", // Keep it fixed at the bottom
    bottom: 0, // Align to the bottom
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: "#555", // Default text color
    marginTop: 5,
  },
  activeTabText: {
    color: "#007BFF", // Blue text color for active tab
    fontWeight: "bold",
  },
  icon: {
    color: "#555", // Default icon color
  },
  activeIcon: {
    color: "#007BFF", // Blue icon color for active tab
  },
});

export default BottomNavigationBar;
