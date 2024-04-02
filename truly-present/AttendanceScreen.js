import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Text, Image, Platform, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const AttendanceScreen = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [classDetails, setClassDetails] = useState({
    className: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const { username } = route.params; 
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (hasPermission) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        setImage(photo.uri);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    } else {
      console.error('Camera permission not granted');
    }
  };

  const handleOpenGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.assets[0].uri);
      } else {
        console.log('User cancelled the photo selection.');
      }
    } catch (error) {
      console.error('Error in ImagePicker:', error);
    }
  };

  const handleAttendanceSubmit = async () => {
    try {
      if (!image) {
        console.error('No photo taken');
        return;
      }

      setIsLoading(true); // Start loading

      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpg',
      });
      formData.append('class_name', classDetails.className);
      formData.append('date', classDetails.date);

      const response = await axios.post(
        'http://192.168.160.121:5000/attendance',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const storing = await axios.post(
        'http://192.168.160.121:7000/storeResponse',
        {
          username,
          date: classDetails.date,
          apiResponse: response.data,
        }
      );


      console.log(storing.status);
      navigation.navigate('ResponseDisplay', { apiResponse: response.data, date: classDetails.date });

      setClassDetails({ className: '', date: new Date().toISOString().split('T')[0] }); // Reset to today
      setImage(null);
    } catch (error) {
      console.error('Error submitting attendance:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Camera style={{ flex: 1 }} ref={cameraRef}>
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
          <TouchableOpacity onPress={handleTakePhoto} disabled={isLoading} style={styles.captureButton}>
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenGallery} disabled={isLoading} style={styles.galleryButton}>
            <Text style={styles.galleryButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 10 }} />}
      <TextInput
        placeholder="Class Name"
        value={classDetails.className}
        onChangeText={(text) => setClassDetails((prev) => ({ ...prev, className: text }))}
        style={styles.input}
        editable={!isLoading}
      />
      <TextInput
        placeholder="Date"
        value={classDetails.date}
        onChangeText={(text) => setClassDetails((prev) => ({ ...prev, date: text }))}
        onFocus={() => Platform.OS === 'ios' && handleDatePicker()}
        style={styles.input}
        editable={!isLoading}
      />
      {image && <Text style={{ marginTop: 10 }}>Photo Taken!</Text>}
      <Button title="Submit Attendance" onPress={handleAttendanceSubmit} disabled={isLoading} />
      
      {/* Loading indicator */}
      {isLoading && (
        <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = {
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  captureButton: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  captureButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  galleryButton: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  galleryButtonText: {
    fontSize: 20,
    color: '#fff',
  },
};

export default AttendanceScreen;
