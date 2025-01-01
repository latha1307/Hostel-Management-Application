import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    rollNo: '',
    feesReceipt: '',
    course: '',
    year: '',
    studentName: '',
    studentPhoto: null, // Changed to support photo object
    dob: '',
    gender: '',
    studentMobile: '',
    studentEmail: '',
    fatherName: '',
    fatherMobile: '',
    motherName: '',
    motherMobile: '', // Added field for Mother's Mobile Number
    guardianName: '',
    guardianMobile: '',
    permanentAddress: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectPhoto = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const source = response.assets[0];
        handleChange('studentPhoto', source.uri); // Save the photo URI to formData
      }
    });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    Alert.alert('Success', 'Form submitted successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hostel Registration</Text>



      {/** Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Student Name"
        value={formData.studentName}
        onChangeText={(value) => handleChange('studentName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Roll No"
        value={formData.rollNo}
        onChangeText={(value) => handleChange('rollNo', value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Department"
        value={formData.department}
        onChangeText={(value) => handleChange('department', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={formData.year}
        onChangeText={(value) => handleChange('year', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={formData.dob}
        onChangeText={(value) => handleChange('dob', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(value) => handleChange('gender', value)}
      />
      {/** Photo selection as input-style field */}
      <View style={styles.photoInput}>
        <TextInput
          style={styles.photoText}
          placeholder="Student Photo"
          value={formData.studentPhoto ? 'Photo selected' : ''}
          editable={false} // Makes it read-only
        />
        <TouchableOpacity style={styles.photoButton} onPress={selectPhoto}>
          <Text style={styles.photoButtonText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>
      {formData.studentPhoto && (
        <Image
          source={{ uri: formData.studentPhoto }}
          style={styles.photoPreview}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Fees Receipt"
        value={formData.feesReceipt}
        onChangeText={(value) => handleChange('feesReceipt', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Student Mobile Number"
        keyboardType="phone-pad"
        value={formData.studentMobile}
        onChangeText={(value) => handleChange('studentMobile', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Student Email"
        keyboardType="email-address"
        value={formData.studentEmail}
        onChangeText={(value) => handleChange('studentEmail', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Father's Name"
        value={formData.fatherName}
        onChangeText={(value) => handleChange('fatherName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Father's Mobile Number"
        keyboardType="phone-pad"
        value={formData.fatherMobile}
        onChangeText={(value) => handleChange('fatherMobile', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mother's Name"
        value={formData.motherName}
        onChangeText={(value) => handleChange('motherName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mother's Mobile Number" // New field
        keyboardType="phone-pad"
        value={formData.motherMobile}
        onChangeText={(value) => handleChange('motherMobile', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Guardian's Name"
        value={formData.guardianName}
        onChangeText={(value) => handleChange('guardianName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Guardian's Mobile Number"
        keyboardType="phone-pad"
        value={formData.guardianMobile}
        onChangeText={(value) => handleChange('guardianMobile', value)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Permanent Address"
        multiline
        numberOfLines={4}
        value={formData.permanentAddress}
        onChangeText={(value) => handleChange('permanentAddress', value)}
      />

      {/** Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 40,
    color: '#007BFF',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  photoText: {
    flex: 1,
    color: '#666',
  },
  photoButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 8,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 12,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007BFF', // Dark blue color
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});