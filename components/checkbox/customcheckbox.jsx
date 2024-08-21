import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomCheckbox = ({ isChecked, onCheck }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onCheck}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Icon name="check" size={18} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#069906',
    borderColor: '000',
  },
});

export default CustomCheckbox;
