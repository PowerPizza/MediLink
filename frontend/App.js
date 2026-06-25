import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/splash-screen/SplashScreen';
import { createContext, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { COLORS } from './src/colors/colors';
import StackNavigation from './src/navigations/StackedNavigation';
import { NAV_CONTAINER_THEME } from './src/themes/navContainerTheme';
import Toast, { BaseToast, ErrorToast, SuccessToast } from 'react-native-toast-message';
import LoaderOverlay from './src/components/LoaderOverlay';
import AppContext from './src/contexts/AppContext';
import apiClient from './src/utils/api-client';
import { AsyncStorageDriver } from './src/data/AsyncStorageDriver';

function AppContent({isLoggedIn, role}) {
  return (
    <NavigationContainer theme={NAV_CONTAINER_THEME}>
      <StackNavigation isLoggedIn={isLoggedIn} role={role} />
    </NavigationContainer>
  )
}

export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const [fontLoaded] = useFonts({
    RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
    KanitRegular: require('./assets/fonts/Kanit-Regular.ttf'),
    RubikRegular: require('./assets/fonts/Rubik-Regular.ttf'),
    RobotoSlabRegular: require('./assets/fonts/RobotoSlab-Regular.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('./assets/fonts/Poppins-Medium.ttf')
  });

  const toastConfig = {
    success: (props) => (
      <SuccessToast {...props}
        style={{ borderLeftColor: COLORS.msgSuccessFG, borderLeftWidth: 4, width: '90%', backgroundColor: COLORS.msgSuccessBG, padding: 0 }}
        text1Style={{ fontSize: 14, fontWeight: '400', color: COLORS.msgSuccessFG }}
        text2Style={{ fontSize: 14, fontWeight: '400', color: COLORS.msgSuccessFG }}
        contentContainerStyle={{paddingVertical: 0, paddingHorizontal: 8}}
        text2NumberOfLines={5} />
    ),

    error: (props) => (
      <ErrorToast {...props}
        style={{ borderLeftColor: COLORS.msgErrorFG, borderLeftWidth: 4, width: '90%', backgroundColor: COLORS.msgErrorBG, padding: 0 }}
        text1Style={{ fontSize: 14, fontWeight: '400', color: COLORS.msgErrorFG }}
        text2Style={{ fontSize: 14, fontWeight: '400', color: COLORS.msgErrorFG }}
        contentContainerStyle={{paddingVertical: 0, paddingHorizontal: 8}}
        text2NumberOfLines={5} />
    ),

    info: (props) => (
      <BaseToast {...props}
        style={{ borderLeftColor: COLORS.msgInfoFG, borderLeftWidth: 4, width: '90%', backgroundColor: COLORS.msgInfoBG, padding: 0 }}
        text1Style={{ fontSize: 14, fontWeight: '400', color: COLORS.msgInfoFG }}
        text2Style={{ fontSize: 14, fontWeight: '400', color: COLORS.msgInfoFG }}
        contentContainerStyle={{paddingVertical: 0, paddingHorizontal: 8}}
        text2NumberOfLines={5} />
    )
  }
  
  useEffect(()=>{
    async function verifyJwtToken() {
      const response = await apiClient.verifySession();
      if (response.verified) {
        if (response.role === "doctor") {
          setIsLoggedIn(true);
        }
        if (response.role === "patient") {
          setIsLoggedIn(true);
        }
        setRole(response.role || "");
      }
      setTimeout(()=>{
        setShowSplashScreen(false);
      }, 3000);
    }
    verifyJwtToken();
  }, []);

  const sharedData = {
    showLoadingModal: setShowLoadingModal,
    setIsLoggedIn,
    setRole,
  }

  if (showSplashScreen || !fontLoaded) {
    return (
      <SplashScreen />
    )
  }

  return (
    <AppContext.Provider value={sharedData}>
      <SafeAreaProvider>
        <AppContent isLoggedIn={isLoggedIn} role={role} />
        <Toast config={toastConfig} />
        {showLoadingModal ? <LoaderOverlay /> : null}
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
    height: '100%'
  }
})