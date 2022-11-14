import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { API_KEY } from '@env';
import { StyleSheet, Text, View, Alert, Button, Image, TextInput } from 'react-native';
import { useEffect, useState } from 'react';

export default function App() {
  const [rates, setRates] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [eur, setEur] = useState('');

  const getData = async () => {
    const url = 'http://api.apilayer.com/exchangerates_data/latest';
    const headers = new Headers();
    headers.append('apikey', API_KEY);

    try {
      const response = await fetch(url, { headers });
      const currencyData = await response.json();
      setRates(currencyData.rates);
    } catch (e) {
      Alert.alert('Error fetching data');
    }
  }

  useEffect(() => { getData() }, []);

  function convert() {
    const amountEur = Number(amount) / rates[selectedCurrency];
    setEur(`${amountEur.toFixed(2)}e`);
  }

  return (
    <View style={styles.container}>
      
      <Text>{eur}</Text>
      <View>
        <TextInput
          style={styles.text}
          placeholder={'Amount'}
          keyboardType='numeric'
          value={amount}
          onChangeText={text => setAmount(text)}
        />
        <Picker style={{ height: 50, width: 100 }}
          selectedValue={selectedCurrency}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCurrency(itemValue);
          }}
        >
          {Object.keys(rates).sort().map(key => (<Picker.Item label={key} value={key} key={key} />))}
        </Picker>
      </View>
      <Button
        title='Convert'
        onPress={convert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'blue'
  }
});
