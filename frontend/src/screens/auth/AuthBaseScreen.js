import { useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBoxBigButton from '../../components/IconBoxBigButton';
import { COLORS } from '../../colors/colors';
import { GRADIENTS } from '../../colors/gradients';

export default function AuthBaseScreen() {
    const navigation = useNavigation();

    return (
        <LinearGradient colors={GRADIENTS.defaultScreenGradient} style={{ flex: 1 }} >
            <SafeAreaView style={style.container}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={[style.appHeading, {color: COLORS.darkBlue}]}>medi</Text>
                    <Text style={[style.appHeading, {color: COLORS.cyanGreen}]}>link</Text>
                </View>
                
                <IconBoxBigButton iconName={'user-md'} text={'Continue As Doctor'} onPress={()=>{navigation.navigate('doctor-base')}} />
                <IconBoxBigButton iconName={'user'} text={'Continue As Patient'} onPress={()=>{navigation.navigate('patient-base')}} />
            </SafeAreaView>
        </LinearGradient>
    )
}

const style = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        padding: 12,
        gap: 10
    },
    appHeading: {
        fontFamily: 'PoppinsMedium',
        fontSize: 44
    }
});