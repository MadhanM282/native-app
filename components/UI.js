import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, LogBox} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
  Platform,
  ImageBackground,
} from 'react-native';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 260;
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const ImageSLider = ({data, Reload}) => {
  const [CityImages, SetCityImages] = useState([]);
  const [date, SetDate] = useState('');
  const [Time, SetTime] = useState('');
  const [State, SetState] = useState(false);
  const [CurrentPage, SetCurrentPAge] = useState(0);
  data.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  let today = new Date();
  let NewDate =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  let NewTime = today.getHours() + ':' + today.getMinutes();

  useEffect(() => {
    SetState(false);
    LogBox.ignoreLogs([
      'Animated: `useNativeDriver`',
      'componentWillReceiveProps',
      'componentWillMount',
    ]);
    SetDate(NewDate);
    SetTime(NewTime);
    image();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Reload]);
  const image = async () => {
    try {
      await fetch('https://jsons-ervermock.herokuapp.com/images/')
        .then(Responce => Responce.json())
        .then(Resdata => {
          SetCityImages(Resdata);
        });
      setTimeout(() => {
        SetState(true);
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };
  const renderPage = (Data, index) => {
    let imageURI;
    CityImages.map(e => {
      if (e.name === Data.name) {
        imageURI = e.image;
      }
    });
    return (
      <View key={index}>
        <View>
          <Image style={styles.CardImage} source={{uri: imageURI}} />
        </View>

        <View style={WeatherCard.container}>
          <Text style={WeatherCard.TempBox}>Location:- {Data.name}</Text>
          <Text style={WeatherCard.Text}>
            Feels Like:- {Math.floor(Data.main.feels_like - 273.15)}°C
          </Text>
          <Text style={WeatherCard.Text}>
            Wind Speed:- {Data.wind.speed}M/S
          </Text>
          <Text style={WeatherCard.Text}>
            Max Temperature:- {Math.ceil(Data.main.temp_max - 273.15)}°C
          </Text>
          <Text style={WeatherCard.Text}>
            Min Temperature:- {Math.floor(Data.main.temp_min - 273.15)}°C
          </Text>
          <Text style={WeatherCard.Text}>
            Atmospheric Pressure:- {Math.floor(Data.main.pressure / 1000)}-bar
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{height: screenHeight - 200}}>
      <View style={HeaderCard.Containor}>
        <ImageBackground
          source={{
            uri: 'https://img.icons8.com/ios-glyphs/1000/night-wind---v2.png',
          }}
          resizeMode="cover"
          style={styles.image}>
          <Text style={HeaderCard.Text}> Weather App</Text>
        </ImageBackground>
      </View>
      <View style={HeaderCard.DateSection}>
        <Text style={WeatherCard.Text}>Date:- {date}</Text>
        <Text style={WeatherCard.Text}>Last Updated:- {Time}</Text>
      </View>
      <View style={styles.container}>
        {State ? (
          <>
            <Carousel
              loop
              index={0}
              pageSize={BannerWidth}
              autoplay={false}
              showsPageIndicator={false}
              onPageChanged={i => SetCurrentPAge(i)}>
              {data ? data.map((Data, index) => renderPage(Data, index)) : ''}
            </Carousel>
            <View>
              <Text style={WeatherCard.Pagination}>
                {CurrentPage + 1}/{data ? data.length : 0}
              </Text>
            </View>
          </>
        ) : (
          <View>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: screenWidth - 60,
    height: screenHeight - Platform.select({ios: 350, android: 350}),
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  CardImage: {
    width: BannerWidth - 20,
    height: BannerHeight,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 5,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
});

const WeatherCard = StyleSheet.create({
  container: {
    borderColor: 'white',
    borderRadius: 5,
    marginTop: 5,
    fontSize: 20,
    height: 200,
    width: screenWidth - 60,
    padding: 5,
  },
  TempBox: {
    color: 'white',
    fontSize: 35,
  },
  Pagination: {
    fontSize: 25,
    color: 'white',
    padding: 15,
  },
  Text: {
    fontSize: 20,
    color: 'black',
    padding: 5,
  },
});

const HeaderCard = StyleSheet.create({
  Containor: {
    backgroundColor: '#6da7de',
    marginTop: Platform.select({ios: -60, android: -90}),
    height: 50,
    borderRadius: 5,
  },
  Text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  },
  DateSection: {
    flex: 0.12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
