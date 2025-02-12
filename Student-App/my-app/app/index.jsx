import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
export default function HostelWelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Title at Top Center */}
      <Text style={styles.title}>TPGIT Hostels</Text>

      {/* Enhanced Image */}
      <Image
  source={require('../assets/images/hostelimg.jpeg')} // Replace with your image file path if needed
  style={styles.imageFullWidth}
  resizeMode="cover"
/>

      {/* Quote */}
      <Text style={styles.quote}>
        “Hostel life teaches you that home is not a place; it’s the people you surround yourself with.”
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={() => alert('/register')}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={() =>  router.push('/login') }>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background color
    alignItems: 'center',
    justifyContent: 'space-evenly', // Evenly distribute content vertically
    padding: 16,
  },
  imageFullWidth: {
    width: '120%', // Ensure the image takes full width
    height: undefined, // Remove fixed height
    aspectRatio: 1, // Adjust the aspect ratio based on your image's proportions
    backgroundSize: 'cover'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D47A1', // Dark blue color for title text
    textAlign: 'center',
    marginTop: '10%',
    fontStyle: 'italic'
  },
  quote: {
    fontSize: 16,
    color: '#1E88E5', // Medium blue color for the quote text
    textAlign: 'center',
    fontStyle: 'italic',
    marginHorizontal: 20,
    fontWeight: 'bold'
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  registerButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#ffffff', // white background
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Rounded border
    borderWidth: 2,
    borderColor: '#1976D2', // Border matches text color
    marginBottom: 16,
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#1976D2', // Solid blue for login button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1976D2', // Matching border color
  },
  registerButtonText: {
    color: '#1976D2', // Blue text for register button
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButtonText: {
    color: '#FFFFFF', // White text for login button
    fontSize: 18,
    fontWeight: 'bold',
  },
});