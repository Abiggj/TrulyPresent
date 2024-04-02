import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [prnNumber, setPrnNumber] = useState('');
  const [role, setRole] = useState('student');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.160.121:6000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role, // Use the selected role
          fullName,
          branch,
          batch,
          prnNumber,
        }),
      });

      if (response.ok) {
        console.log('Registration successful');
        navigation.navigate('Login');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Branch"
        value={branch}
        onChangeText={(text) => setBranch(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Batch"
        value={batch}
        onChangeText={(text) => setBatch(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="PRN Number"
        value={prnNumber}
        onChangeText={(text) => setPrnNumber(text)}
      />

      <View style={styles.radioContainer}>
        <Text>Role: </Text>
        <RadioButton.Group onValueChange={(value) => setRole(value)} value={role}>
          <View style={styles.radioButton}>
            <Text>Student</Text>
            <RadioButton value="student" />
          </View>
          <View style={styles.radioButton}>
            <Text>Faculty</Text>
            <RadioButton value="faculty" />
          </View>
        </RadioButton.Group>
      </View>

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
});

export default RegisterScreen;
