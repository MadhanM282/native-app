/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {useNetInfo} from '@react-native-community/netinfo';
import React, {useEffect, useState} from 'react';
import {Button, Dimensions, Platform, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {openDatabase} from 'react-native-sqlite-storage';
import {ImageSLider} from './components/UI';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Cities = [
  'Bengaluru',
  'chennai',
  'delhi',
  'mumbai',
  'Jammu and Kashmir',
  'Pune',
  'visakhapatnam',
  'goa',
  'kanyakumari',
  'Ooty',
  'kerala',
];
const {width: screenWidth} = Dimensions.get('window');

var db = openDatabase({name: 'UserDatabase.db'});

const App = () => {
  const NetInfo = useNetInfo();
  const [Result, SetResults] = useState([]);
  const [AllCites, SetAllCites] = useState([]);
  const [Status, SetStatus] = useState(false);
  const [Reload, SetReload] = useState(false);
  useEffect(() => {
    console.log(NetInfo);
    SetResults([]);
    Cities.map(e => {
      GetWeatherOfCity(e);
    });
    console.log(Reload);
    CreateTable();
    DataBase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Reload, Status]);
  const Data = JSON.stringify(Result);
  const GetWeatherOfCity = async city => {
    try {
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'0d73de379dffe7d028b1d22e3459a4fc'}`,
      )
        .then(Responce => Responce.json())
        .then(data => {
          SetResults(pre => [...pre, data]);
        })
        .then(() => {
          setTimeout(() => {
            SetStatus(true);
          }, 500);
        });
    } catch (error) {
      console.log('error', error.message);
    }
  };

  const DataBase = () => {
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM Weather');
      tx.executeSql('INSERT INTO Weather (WeatherData) VALUES (?)', [Data]);
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Weather', [], (txt, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i).WeatherData);
        }
        SetAllCites(JSON.parse(temp));
      });
    });
  };
  const CreateTable = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Weather'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS Weather', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Weather(WeatherData NVARCHAR(10000))',
              [],
            );
          }
        },
      );
    });
  };

  return (
    <View>
      <LinearGradient
        colors={['#c0392b', '#f1c40f', '#8e44ad']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 1}}
        style={styles.button}>
        <ImageSLider data={AllCites} Reload={Reload} />
        <Button
          title="Refresh"
          onPress={() => {
            SetReload(!Reload);
          }}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  button: {
    paddingTop: 100,
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: screenWidth - Platform.select({ios: -455, android: -550}),
  },
});

export default App;
