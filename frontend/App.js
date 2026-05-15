import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/splash-screen/SplashScreen';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './src/navigations/BottomNavigation';
import { COLORS } from './src/colors/colors';
import StackNavigation from './src/navigations/StackedNavigation';

function AppContent() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  )
}

export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [fontLoaded] = useFonts({
    RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
    KanitRegular: require('./assets/fonts/Kanit-Regular.ttf'),
    RubikRegular: require('./assets/fonts/Rubik-Regular.ttf'),
    RobotoSlabRegular: require('./assets/fonts/RobotoSlab-Regular.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('./assets/fonts/Poppins-Medium.ttf')
  });
  
  useEffect(()=>{
    setTimeout(()=>{
      setShowSplashScreen(false);
    }, 3000);
  }, []);

  if (showSplashScreen || !fontLoaded) {
    return (
      <SplashScreen />
    )
  }

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
