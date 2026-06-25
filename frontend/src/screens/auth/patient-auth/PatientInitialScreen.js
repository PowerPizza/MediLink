import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from "react-native";
import { COLORS } from "../../../colors/colors";
import { GRADIENTS } from "../../../colors/gradients";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import SignupScreen from "./Signup";
import LoginScreen from "./Login";
import { THEME } from "../../../themes/theme";

function SwitchableButton({onSwitch=(btn_id)=>{}, btnText0, btnText1}) {
    const [selected, setSelected] = useState(0);
    const btnActiveStyle = {backgroundColor: THEME.light.buttonBG, borderColor: THEME.light.buttonBG, color: COLORS.white};
    const btnInactiveStyle = {backgroundColor: COLORS.white, borderColor: COLORS.lightGray, color: COLORS.black};

    useEffect(()=>{
        onSwitch(selected);
    }, [selected]);

    return (
        <View style={style.switchableBtnContainer}>
            <TouchableOpacity style={{flex: 1}} onPress={()=>{setSelected(0)}} activeOpacity={0.8}>
                <Text style={[style.switchableBtnClickable, style.switchableBtnLeft, selected === 0 ? btnActiveStyle : btnInactiveStyle ]}>{btnText0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={()=>{setSelected(1)}} activeOpacity={0.8}>
                <Text style={[style.switchableBtnClickable, style.switchableBtnRight, selected === 1 ? btnActiveStyle : btnInactiveStyle ]}>{btnText1}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function PatientInitialScreen() {
    const [formId, setFormId] = useState(0)  // 0 --> Signup form | 1 ---> Login form
    const insets = useSafeAreaInsets();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    
    useEffect(()=>{
        const showKeyboardHandle = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', ()=>{
            setKeyboardVisible(true);
        });
        const hideKeyboardHandle = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', ()=>{
            setKeyboardVisible(false);
        });

        return ()=>{
            showKeyboardHandle.remove();
            hideKeyboardHandle.remove();
        }
    });

    return (
        <LinearGradient colors={GRADIENTS.defaultScreenGradient} style={{flex: 1}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding': 'height'} keyboardVerticalOffset={insets.bottom}>
                <View style={[style.container, {marginBottom: insets.bottom}]}>
                    {!keyboardVisible ? 
                    <>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={[style.appHeading, {color: COLORS.darkBlue}]}>medi</Text>
                            <Text style={[style.appHeading, {color: COLORS.cyanGreen}]}>link</Text>
                        </View>

                        <View style={style.patientBanner}>
                            <View style={style.patientBannerIcon}>
                                <FontAwesome name="user" size={44} color={COLORS.darkGreen} />
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    <Text style={{fontSize: 24, color: COLORS.darkGreen}}>Welcome </Text>
                                    <Text style={{fontSize: 24, color: COLORS.darkGreen, fontWeight: 'bold'}}>User</Text>
                                </View>
                                <Text style={[style.tooltipText, {width: '80%'}]} textBreakStrategy="balanced">Let's create your account and get started</Text>
                            </View>
                        </View>

                        <View style={{height: 12}} />
                    </>
                    : null}

                    <SwitchableButton btnText0={'Signup'} btnText1={'Login'} onSwitch={setFormId} />

                    <View style={{height: 12}} />

                    {formId === 0 ? <SignupScreen /> : null}
                    {formId === 1 ? <LoginScreen /> : null}
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    )
}

const style = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: COLORS.white,
        margin: 12,
        padding: 12,
        borderRadius: 12,
        flex: 1
    },
    appHeading: {
        fontFamily: 'PoppinsMedium',
        fontSize: 32,
    },
    patientBanner: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 4,
        paddingRight: 4
    },
    patientBannerIcon: {
        backgroundColor: COLORS.lightGreen2,
        borderRadius: '50%',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
    },
    tooltipText: {
        fontSize: 12,
        color: COLORS.gray,
    },

    switchableBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    switchableBtnClickable: {
        textAlign: 'center',
        padding: 6,
        color: COLORS.white
    },
    switchableBtnLeft: {
        borderWidth: 2,
        borderRadius: 14,
        borderTopLeftRadius: 0,
        borderColor: COLORS.lightGray
    },
    switchableBtnRight: {
        borderWidth: 2,
        borderRadius: 14,
        borderTopRightRadius: 0,
        borderColor: COLORS.lightGray
    }
});