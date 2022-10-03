// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to register the user

import React, {useEffect, useState} from 'react';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

const RegisterUser = ({Result, SetAllCites}) => {
  const Data = JSON.stringify(Result);
  const [Status, SetStatus] = useState(false);
  useEffect(() => {
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
    register_user();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Status]);
  let register_user = () => {
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
        console.log(JSON.parse(temp));
        SetAllCites(JSON.parse(temp));
        setTimeout(() => {
          SetStatus(true);
        }, 1000);
      });
    });
  };
  return;
};

export default RegisterUser;
