// ResponseDisplayScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ResponseDisplayScreen = ({ route }) => {
  const { apiResponse, date } = route.params;
  const studentsPresent = JSON.parse(apiResponse);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Students Present on {date}</Text>
      <FlatList
        data={studentsPresent}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={24} color="green" style={styles.icon} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ResponseDisplayScreen;
