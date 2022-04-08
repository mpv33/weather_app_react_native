import React, { useRef, useEffect, useState, useCallback } from 'react';
import Toast from 'react-native-toast-message'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  StatusBar,
  Animated,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
//import {Card} from 'react-native-paper';

import Locations from './model/locations';
import axios from 'axios';
import SunIcon from './assets/sun.png';
import CloudIcon from './assets/ncloudy.png';
import MoonIcon from './assets/night.png';
import RainIcon from './assets/thunder.png';
import MenuIcon from './assets/menu.png';
import SearchIcon from './assets/search.svg';
import AddIcon from './assets/whiteplus.png';

import { getStatusBarHeight } from 'react-native-status-bar-height';

const WeatherIcon = weatherType => {
  if (weatherType == 'Sunny' || weatherType == 'Clear') {
    //return <SunIcon width={34} height={34} fill="#fff" />;
    return <Image style={styles.weather} source={SunIcon} />
  }
  if (weatherType == 'Rainy' || weatherType == 'Rain') {
    //return <RainIcon width={34} height={34} fill="#fff" />;
    return <Image style={styles.weather} source={RainIcon} />
  }
  if (weatherType == 'Haze' || weatherType == 'Clouds' || weatherType == 'Smoke') {
    // return <CloudIcon width={34} height={34} fill="#fff" />;
    return <Image style={styles.weather} source={CloudIcon} />
  }
  if (weatherType == 'Night') {
    // return <MoonIcon width={34} height={34} fill="#fff" />;
    return <Image style={styles.weather} source={MoonIcon} />
  }
  return <Image style={styles.weather} source={CloudIcon} />
};

const App = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [input, setInput] = useState('delhi');
  const [data, setData] = useState([]);
  const [locations, setLocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([])

  const fetchCities = (text) => {
    setInput(text)
  }

  const api = {
    key: '486a7dceff36934a00e8daaa99a9630e',
   // key: 'f658d8df2d4039180b02dd98d4f48a3f',
    baseUrl: 'http://api.openweathermap.org/data/2.5/',
  };

  const fetchDataHandler = () => {
    if (input) {
      setLoading(true);
      axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${api.key}`,
      })
        .then(res => {
          console.log(res.data);
          setData(res.data);
        })
        .catch(err => {
          console.dir(err);
          Alert.alert('City not found', 'Please Try again');
          setInput('')
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (input) {
     fetchDataHandler()
    }

  }, [])
  useEffect(() => {
    if (data?.name) {
      let addData = {};
      let l = locations?.length
      addData.id = l > 0 ? l + 1 : 1;
      addData.city = data?.name;
      addData.temparature = data?.main?.temp;
      addData.temp_min = data?.main?.temp_min;
      addData.temp_max = data?.main?.temp_max;
      addData.humidity = data?.main?.humidity;
      addData.wind = data?.wind?.speed;
      addData.rain = 50;
      addData.weatherType = data?.weather[0]?.main
      console.log('added data', addData)
      setLocation([addData,...locations])
      setInput('')
    }

  }, [data])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={1}>
        {locations.map((location, index) => {
          if (location.weatherType == 'Sunny' || location.weatherType == 'Clear') {
            bgImg = require('./assets/sunny.jpg');
          } else if (location.weatherType == 'Night') {
            bgImg = require('./assets/night2.jpg');
          } else if (location.weatherType == 'Haze' || location.weatherType == 'Cloud' || location.weatherType == 'Smoke') {
            bgImg = require('./assets/cloudy.jpeg');
          } else if (location.weatherType == 'Rainy' || location.weatherType == 'Rain') {
            bgImg = require('./assets/rainy.jpg');
          }
          else{
            bgImg = require('./assets/cloudy.jpeg');
          }
         

          return (
            <View
              style={{ width: windowWidth, height: windowHeight }}
              key={index}>
              <ImageBackground
                source={bgImg}
                style={{
                  flex: 1,
                }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: 20,
                  }}>
                  <View style={styles.topInfoWrapper}>
                    <View>
                      <Text style={styles.city}>{location.city}</Text>
                      <Text style={styles.weatherType}>
                        {location?.weatherType}
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
                        {WeatherIcon(location?.weatherType)}
                      </View>
                      <View>
                        <Text style={styles.temparature}>
                          {location?.temparature} °C
                        </Text>
                        <Text style={styles.compareTemp}>
                          10 °C higher than yesterday
                        </Text>
                        <Text style={styles.HLTemp} >
                          {location?.temp_min} °C / {location?.temp_max} °C
                        </Text>
                      </View>
                    </View>

                  </View>
                  <View
                    style={{
                      borderBottomColor: 'rgba(255,255,255,0.7)',
                      marginTop: 20,
                      borderBottomWidth: 1,
                    }}
                  />
                  <View style={styles.bottomInfoWrapper}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Wind</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {location.wind}
                      </Text>
                      <Text style={styles.infoText}>km/h</Text>
                      <View style={styles.infoBar}>
                        <View
                          style={{
                            width: location.wind / 2,
                            height: 5,
                            backgroundColor: '#69F0AE',
                          }}
                        />
                      </View>
                    </View>
                    {/* <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Rain</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {location.rain}
                      </Text>
                      <Text style={styles.infoText}>%</Text>
                      <View style={styles.infoBar}>
                        <View
                          style={{
                            width: location.rain / 2,
                            height: 5,
                            backgroundColor: '#F44336',
                          }}
                        />
                      </View>
                    </View> */}
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.infoText}>Humidity</Text>
                      <Text style={[styles.infoText, { fontSize: 24 }]}>
                        {location.humidity}
                      </Text>
                      <Text style={styles.infoText}>%</Text>
                      <View style={styles.infoBar}>
                        <View
                          style={{
                            width: location.humidity / 2,
                            height: 5,
                            backgroundColor: '#F44336',
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.appHeader}>
        <TouchableOpacity onPress={() => { }}>
          <Image
            style={styles.menuIcon}
            source={MenuIcon} />
        </TouchableOpacity>

        <TextInput
          placeholder="Enter city name"
          style={{ color: '#fff' }}
          onChangeText={(text) => fetchCities(text)}
          placeholderTextColor={'#fff'}
          value={input}
        />
        <TouchableOpacity onPress={fetchDataHandler}>
          <Image
            style={styles.addIcon}
            source={AddIcon} />
        </TouchableOpacity>
        {/* <FlatList
        data={cities}
        renderItem={({item})=>{
            return(
                <View 
                 style={{margin:2,padding:12}}
                 onPress={()=>setInput(item.name)}
                >
                    <Text>{item.name}</Text>
                </View>
            )
        }}
        keyExtractor={item=>item.name}
        /> */}

      </View>

      <View style={styles.indicatorWrapper}>
        {locations.map((location, index) => {
          const width = scrollX.interpolate({
            inputRange: [
              windowWidth * (index - 1),
              windowWidth * index,
              windowWidth * (index + 1),
            ],
            outputRange: [5, 12, 5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View key={index} style={[styles.normalDot, { width }]} />
          );
        })}
      </View>

    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    //backgroundColor: 'white',
    height: 30,
    width: 40
  },
  weather: {
    height: 50,
    width: 50
  },
  appHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: getStatusBarHeight() + 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20
  },
  topInfoWrapper: {
    flex: 1,
    marginTop: 160,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  city: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    padding: 10
  },
  time: {
    color: '#fff',
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
  },
  temparature: {
    color: '#fff',
    fontFamily: 'Lato-Light',
    fontSize: 55,
    padding: 10
  },
  weatherType: {
    color: '#fff',
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 25,
    lineHeight: 34,
    marginLeft: 10,
    padding: 10,
    alignItems: 'center'
  },
  compareTemp: {
    color: '#fff',
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 28,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'

  },
  HLTemp: {
    color: '#fff',
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    fontSize: 10,
    lineHeight: 28,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'

  },
  bottomInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
  },
  infoBar: {
    width: 45,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorWrapper: {
    position: 'absolute',
    top: 500,
    left: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalDot: {
    height: 5,
    width: 5,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
});
