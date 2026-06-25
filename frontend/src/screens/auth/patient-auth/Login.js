import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import TextTypeInput from '../../../components/auth-entries/TextTypeInput';
import PasswordTypeInput from '../../../components/auth-entries/PasswordTypeInput';
import SubmitButton from '../../../components/SubmitButton';
import { COMMON_STYLES } from "../../../commons/common-styles";
import { COLORS } from "../../../colors/colors";
import apiClient from "../../../utils/api-client";
import Toast from "react-native-toast-message";
import { AsyncStorageDriver } from "../../../data/AsyncStorageDriver";

export default function LoginScreen() {
    const navigation = useNavigation();
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        if (!gmail || !password) {
            Toast.show({
                text2: "All fields are required to be filled.",
                type: "error"
            });
            return;
        }

        const loginData = {
            gmail,
            password
        }
        setIsLoggingIn(true);
        const response = await apiClient.signinPatient(loginData);
        if (response.status === 200) {
            if (response.data.success) {
                await AsyncStorageDriver.setItem("jwt", response.data.token);
                Toast.show({
                    text2: `Login successful.`,
                    type: "success"
                });
                navigation.dispatch(CommonActions.reset({  // Using dispatch due to .navigate() presists back-stack of navigator.
                    index: 0,
                    routes: [{name: "patientNavs"}]
                }));
            }
            else {
                Toast.show({
                    text2: `Login Failed : ${response.data.message}`,
                    type: "error"
                });
            }
        }
        else {
            Toast.show({
                text2: `Login Failed : ${response}`,
                type: "error"
            });
        }
        setIsLoggingIn(false);
    };

    const handleForgotPassword = () => {
        console.log('Forgot Password pressed');
        // navigation.navigate('ForgotPassword');
    };

    const handleBiometricAuth = () => {
        console.log('Biometric authentication pressed');
    };

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View>
                    <Text style={styles.subtitle}>Sign in with your Gmail and Password to continue.</Text>

                    <View style={styles.fieldsContainer}>
                        <TextTypeInput
                            iconName="envelope"
                            placeholder="Gmail"
                            value={gmail}
                            onChangeText={setGmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <PasswordTypeInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.forgotRow} onPress={handleForgotPassword} activeOpacity={0.7}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <SubmitButton title="Login" onPress={handleLogin} style={styles.loginButton} loading={isLoggingIn} />

                    <TouchableOpacity onPress={handleBiometricAuth} activeOpacity={0.7}>
                        <Text style={[COMMON_STYLES.tooltipTextSmall, styles.biometricText]}>Use biometric authentication instead</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 14,
        lineHeight: 20,
    },
    fieldsContainer: {
        gap: 14,
    },
    forgotRow: {
        marginTop: 6,
        alignSelf: 'flex-end',
    },
    forgotText: {
        color: COLORS.darkBlue,
        fontSize: 13,
        fontWeight: '600',
    },
    loginButton: {
        marginTop: 22,
    },
    biometricText: {
        textAlign: 'center',
        marginTop: 16,
        color: COLORS.darkGreen,
        fontWeight: '600',
    },
});