import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import BottomNavigationBar from '../components/BottomNavigationBar';

const Leave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");
  const [document, setDocument] = useState("");
  const [historyClicked, setHistoryClicked] = useState(false);

  const calculateDays = (start, end) => {
    const startParts = start.split("/").map(Number);
    const endParts = end.split("/").map(Number);

    if (
      startParts.length === 3 &&
      endParts.length === 3 &&
      !isNaN(startParts[0]) &&
      !isNaN(endParts[0])
    ) {
      const startDateObj = new Date(startParts[2], startParts[1] - 1, startParts[0]);
      const endDateObj = new Date(endParts[2], endParts[1] - 1, endParts[0]);
      const differenceInTime = endDateObj - startDateObj;
      return differenceInTime / (1000 * 3600 * 24);
    }
    return -1;
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "/" });
      if (result.type === "success") {
        setDocument(result.name);
      }
    } catch (error) {
      Alert.alert("Error", "File upload failed.");
    }
  };

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !comment || !document) {
      Alert.alert("Error", "Please fill in all the required fields.");
      return;
    }

    const days = calculateDays(startDate, endDate);

    if (days < 7) {
      Alert.alert("Error", "The leave duration must be at least 7 days.");
      return;
    }

    Alert.alert("Success", "Your leave application has been submitted.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <View style={styles.container}>
      <Text style={styles.header}>Leave Application</Text>

      {/* Leave Type Dropdown */}
      <Text style={styles.label}>Leave Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={leaveType}
          onValueChange={(itemValue) => setLeaveType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Leave Type" value="" />
          <Picker.Item label="Sick Leave" value="sick" />
          <Picker.Item label="Casual Leave" value="casual" />
          <Picker.Item label="Earned Leave" value="earned" />
        </Picker>
      </View>

      {/* Leave Duration Inputs */}
      <Text style={styles.label}>Leave Duration</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Start Date (DD/MM/YYYY)"
          value={startDate}
          onChangeText={setStartDate}
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="End Date (DD/MM/YYYY)"
          value={endDate}
          onChangeText={setEndDate}
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
        />
      </View>

      {/* Comment Box */}
      <Text style={styles.label}>Comment</Text>
      <TextInput
        placeholder="Add comment"
        value={comment}
        onChangeText={setComment}
        style={[styles.input, styles.textArea]}
        multiline
      />

      {/* Document Upload */}
{/* Document Upload */}
<Text style={styles.label}>Attach Document</Text>
<View style={[styles.pickerWrapper, styles.documentBox]}>
  <TouchableOpacity onPress={handleDocumentUpload}>
    <MaterialIcons name="attach-file" size={24} color="#000" style={{ marginRight: 8 }} />
  </TouchableOpacity>
  <Text style={styles.documentText}>
    {document || "Upload your document"}
  </Text>
</View>



      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* View History Link */}
      <TouchableOpacity
        onPress={() => setHistoryClicked(true)}
        onPressOut={() => setHistoryClicked(false)}
      >
        <Text
          style={[styles.historyLink, historyClicked && styles.historyLinkUnderline]}
        >
          View History
        </Text>
      </TouchableOpacity>
      </View>
      <BottomNavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    color: "#000",
  },
  documentBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
    justifyContent: "flex-start"
  },
  documentTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  documentText: {
    color: "#000",
    fontSize: 14,
    textAlign: "left",
    
  },

  inputText: {
    flex: 1,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#0056b3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyLink: {
    color: "#007BFF",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  historyLinkUnderline: {
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default Leave;