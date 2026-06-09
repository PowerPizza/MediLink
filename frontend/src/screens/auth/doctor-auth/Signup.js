import {View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Button, Pressable, TouchableHighlight, TouchableOpacity} from 'react-native';
import PasswordTypeInput from '../../../components/auth-entries/PasswordTypeInput';
import TextTypeInput from '../../../components/auth-entries/TextTypeInput';
import DividerWithLabel from '../../../components/DividerWithLabel';
import SubmitButton from '../../../components/SubmitButton';
import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../../colors/colors';
import SmallButton from '../../../components/SmallButton';
import { COMMON_STYLES } from '../../../commons/common-styles';
import { createVerificationCode } from '../../../utils/helper-functions';
import apiClient from '../../../utils/api-client';
import Toast from 'react-native-toast-message';
import { Checkbox } from 'expo-checkbox';
import AppContext from '../../../contexts/AppContext';
import { AsyncStorageDriver } from '../../../data/AsyncStorageDriver';
import NumericTypeInput from '../../../components/auth-entries/NumericTypeInput';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
    // Other UI and feature control states
    const [formStage, setFormStage] = useState(1);
    const [codeSentCooldown, setCodeSentCooldown] = useState(30);
    const [cooldownInterval, setCooldownInterval] = useState(null);
    const actualVerificationCode = useRef();
    const [isProcessing, setIsProcessing] = useState(false);

    // User entry states to store form data.
    const [fullName, setFullName] = useState('abc');
    const [email, setEmailEx] = useState('chandumesh845@gmail.com');
    const [phoneNo, setPhoneNo] = useState('2211223333');
    const [specialization, setSpecialization] = useState('dsad');
    const [experience, setExperience] = useState('0');
    const [qualifications, setQualifications] = useState('da');
    const [hospitalName, setHospitalName] = useState('dsa');
    const [city, setCity] = useState('dsa');
    const [hospitalAddress, setHospitalAddress] = useState('da');
    const [verificationCode, setVerificationCode] = useState('');
    const [doctorId, setDoctorId] = useState('dsadwda');
    const [newPin, setNewPin] = useState('444444');
    const [newPinRe, setNewPinRe] = useState('444444');
    const [isCheckedPinWarn, setIsCheckedPinWarn] = useState(false);
    const [isCheckedTerms, setIsCheckedTerms] = useState(false);

    // Validation based boolean states
    const [isGmailVerified, setIsGmailVerified] = useState(false);
    const [isGmailAvailable, setIsGmailAvailable] = useState(true);
    const [isInvalidCode, setIsInvalidCode] = useState(null);  // can't set initially false due to initially code isn't entered by user.

    // Context access & other accesses
    const shared_data = useContext(AppContext);
    const navigation = useNavigation();

    function startCodeCooldown() {
        if (cooldownInterval) return;
        let interval = setInterval(()=>{
            setCodeSentCooldown(prev => {
                if (prev === 0) {
                    setCooldownInterval(interval_id => {
                        clearInterval(interval_id);
                        return null;
                    });
                    return 30;
                }
                else {
                    return prev - 1;
                }
            });
        }, 1000);
        setCooldownInterval(interval);
    }

    async function sendVerificationCode() {
        if (cooldownInterval) return;

        actualVerificationCode.current = createVerificationCode();
        
        apiClient.sendVerificationCode(email, actualVerificationCode.current).then(resp => {
            if (resp.status === 200) {
                Toast.show({
                    text2: `Verification code has been sent at '${email}'`,
                    type: 'success'
                });
            }
        }).catch(err => {
            console.log(err);
        });
        console.log(actualVerificationCode.current);
        startCodeCooldown();
        console.log("Verification code has been sent");
    }

    function proceedToStage1() {
        setFormStage(1);
    }

    async function proceedToStage2() {
        setIsProcessing(true);
        const phone_no_regex = /^\d{10}$/;

        if (!email || !email.endsWith('@gmail.com')) {
            Toast.show({
                text2: 'Gmail is required with suffix @gmail.com',
                type: 'error'
            });
            setIsProcessing(false);
            return
        }

        if (await verifyGmailExistance()) {
            Toast.show({
                text2: 'Gmail is required with suffix @gmail.com',
                type: 'error'
            });
            setIsProcessing(false);
            return;
        }

        /* 
        // FOR DEVELOPEMENT: bypass all filters
        setFormStage(2);
        if (!isGmailVerified) sendVerificationCode();
        setIsProcessing(false);
        return;
        */

        if (!phoneNo || !phone_no_regex.test(phoneNo)) {
            Toast.show({
                text2: 'A valid phone no. of 10-digits is required.',
                type: 'error'
            });
            setIsProcessing(false);
            return
        }

        const fields = [fullName, email, phoneNo, specialization, experience, qualifications, hospitalAddress, city, hospitalAddress]
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i] || !fields[i].trim()) {
                Toast.show({
                    text2: 'All entries are required to be filled.',
                    type: 'error'
                });
                setIsProcessing(false);
                return;
            }
        }

        setIsProcessing(false);
        setFormStage(2);
        if (!isGmailVerified) sendVerificationCode();
    }

    function proceedToStage3(gmailVerified) {
        if (!gmailVerified) {
            Toast.show({
                text2: 'Gmail is not verified yet, please verify to proceed.',
                type: 'error'
            });
            return;
        }

        if (cooldownInterval) {
            clearInterval(cooldownInterval);
            setCodeSentCooldown(30);
            setCooldownInterval(null);
        }
        
        setFormStage(3);
    }
    
    function captureUserVerificationCode(code) {
        if (code?.length === 3 && verificationCode?.endsWith('-') === false) {
            setVerificationCode(code+'-');
        }
        else {
            setVerificationCode(code);
        }
        if (code?.length === 7) {  // Ensures verification to be called only for 7 length (abc-abc) valid code.
            if (code === actualVerificationCode.current) {
                setIsGmailVerified(true);
                setIsInvalidCode(false);
                proceedToStage3(true);
            }
        }
    }

    function setEmail(value) {
        if (isGmailVerified) {
            setIsGmailVerified(false);
            setVerificationCode('');
            actualVerificationCode.current = null;
        }
        setEmailEx(value);
    }

    async function verifyGmailExistance() {
        if (!email || !email.endsWith('@gmail.com')) return;
        const exists = await apiClient.checkGmailExists(email);
        if (exists) {
            Toast.show({
                text2: 'Gmail already exists',
                type: 'error'
            });
        }
        setIsGmailAvailable(!exists);
        return exists;
    }

    async function finishSignup() {
        shared_data.showLoadingModal(true);
        const form_data = {
            full_name: fullName?.trim(),
            gmail: email?.trim().toLowerCase(),
            phone_no: phoneNo?.trim(),
            specialization: specialization?.trim(),
            experience: experience,
            qualifications: qualifications?.trim(),
            hospital_name: hospitalName?.trim(),
            city: city?.trim(),
            hospital_address: hospitalAddress?.trim(),
            verification_code: verificationCode?.trim(),
            doctor_id: doctorId?.trim(),
            pin: newPin,
            agreed_to_pin_warning: isCheckedPinWarn,
            accepted_terms: isCheckedTerms,
            pfp_url: '',
            biomatric_method: 'FINGER_PRINT'
        };

        console.log("Sending data for signup doctor : ", form_data);

        const response = await apiClient.signupDoctor(form_data);
        if (response.status === 200) {
            if (response.data?.success === true) {
                console.log("[Signed Up] Access Token : ", response.data.token);
                await AsyncStorageDriver.setItem("jwt", response.data.token);
                Toast.show({
                    text2: 'Account has been created successfully',
                    type: 'success'
                });
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{name: "doctorNavs"}]
                }));
            }
            else {
                Toast.show({
                    text2: 'Signup failed : '+response.data?.message,
                    type: 'error'
                });
            }
        }
        else {
            Toast.show({
                text2: 'Signup failed with error : '+response,
                type: 'error'
            });
        }

        shared_data.showLoadingModal(false);
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom: 0, gap: 4}} keyboardShouldPersistTaps="handled" >
                <View style={styles.stagePreviewContainer}>
                    <TouchableOpacity onPress={proceedToStage1} style={[styles.stageLabelHolder, formStage === 1 ? {} : styles.stageLableHolderInactive]} activeOpacity={0.7}>
                        <Text style={[styles.stageLabel, formStage === 1 ? {} : styles.stageLabelInactive]}>{1}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={proceedToStage2} style={[styles.stageLabelHolder, formStage === 2 ? {} : styles.stageLableHolderInactive]} activeOpacity={0.7}>
                        <Text style={[styles.stageLabel, formStage === 2 ? {} : styles.stageLabelInactive]}>{2}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>proceedToStage3(isGmailVerified)} style={[styles.stageLabelHolder, formStage === 3 ? {} : styles.stageLableHolderInactive]} activeOpacity={0.7}>
                        <Text style={[styles.stageLabel, formStage === 3 ? {} : styles.stageLabelInactive]}>{3}</Text>
                    </TouchableOpacity>
                </View>

                {formStage === 1 ?
                <>
                    <DividerWithLabel label='Personal' />
                    <TextTypeInput iconName={'user'} placeholder='Full Name' value={fullName} onChangeText={setFullName} />
                    <TextTypeInput iconName={'envelope'} placeholder='Email' value={email} isValid={isGmailAvailable} onChangeText={setEmail} onBlur={verifyGmailExistance} />
                    <TextTypeInput iconName={'phone'} placeholder='Phone Number' value={phoneNo} onChangeText={setPhoneNo} />

                    <DividerWithLabel label='Professional' />

                    <TextTypeInput iconName={'certificate'} placeholder='Specialization' value={specialization} onChangeText={setSpecialization} />
                    <NumericTypeInput iconName={'flask'} placeholder='Experience' value={experience} onChangeText={setExperience} />
                    <TextTypeInput iconName={'graduation-cap'} placeholder='Qualifications' value={qualifications} onChangeText={setQualifications} />

                    <DividerWithLabel label='Hospital' />

                    <TextTypeInput iconName={'hospital-o'} placeholder='Hospital Name' value={hospitalName} onChangeText={setHospitalName} />
                    <TextTypeInput iconName={'street-view'} placeholder='City' value={city} onChangeText={setCity} />
                    <TextTypeInput iconName={'map-marker'} placeholder='Hospital Address' value={hospitalAddress} onChangeText={setHospitalAddress} />

                    <SubmitButton title='Next' onPress={proceedToStage2} style={{marginTop: 8}} loading={isProcessing}>
                        <FontAwesome name='angle-right' size={24} color={COLORS.white} />
                    </SubmitButton>

                    <View style={{height: 12}} />
                </> 
                :
                null}
                {/* <PasswordTypeInput /> */}

                {formStage === 2 ?
                <>
                    <View style={styles.gmailCard} >
                        <FontAwesome name='envelope-o' color={COLORS.darkGreen} style={styles.gmailCardIcon} size={24} />
                        <View style={{flex: 1}}>
                            <Text style={[COMMON_STYLES.tooltipTextMid, {fontWeight: 'bold'}]}>Email Address</Text>
                            <Text style={{fontSize: 16, fontWeight: '700'}}>{email}</Text>
                        </View>
                        {isGmailVerified ?
                            <View style={[styles.gmailVerfStatusBox, {backgroundColor: COLORS.lightGreen}]}>
                                <FontAwesome name='check' size={18} color={COLORS.darkGreen} />
                                <Text style={{textAlign: 'center', fontSize: 12, color: COLORS.darkGreen}}>{"verified"}</Text>
                            </View>
                        :
                            <View style={[styles.gmailVerfStatusBox, {backgroundColor: COLORS.lightGold}]}>
                                <FontAwesome name='warning' size={18} color={COLORS.gold} />
                                <Text style={{textAlign: 'center', fontSize: 12, color: COLORS.darkRed}}>{"not\nverified"}</Text>
                            </View>
                        }
                    </View>
                    
                    {!isGmailVerified ?
                    <>
                        <Text style={COMMON_STYLES.tooltipTextMid}>A verification code has been sent to {email}. Please enter the code below to continue.</Text>
                        
                        <Text style={COMMON_STYLES.tooltipTextMid}>Didn’t receive the verification code? Please check your spam or junk folder.</Text>

                        <View style={styles.codeResendGroup}>
                            <TextTypeInput placeholder='000-000' value={verificationCode} onChangeText={captureUserVerificationCode} style={[{width: 70}, (isInvalidCode && verificationCode.length === 7) ? {borderColor: COLORS.lightRed} : {} ]} />
                            {cooldownInterval ? 
                                <Text style={COMMON_STYLES.tooltipTextLarge}>Resend code in <Text style={{fontWeight: 'bold'}}>00:{String(codeSentCooldown).padStart(2, '0')}</Text></Text>
                            :
                                <TouchableHighlight onPress={sendVerificationCode}>
                                    <Text style={COMMON_STYLES.tooltipTextLarge}>Resend code</Text>
                                </TouchableHighlight>
                            }
                        </View>
                    </>
                    :null}

                    <View style={{height: 12}} />
                </>
                : null}

                {formStage === 3 ? 
                    <>
                        {/* NEED TO ADD PFP SETUP HERE TOO */}
                        {/* add Biomatic based auth */}
                        <TextTypeInput iconName={'id-card-o'} placeholder='Doctor ID' value={doctorId} onChangeText={setDoctorId} />
                        <PasswordTypeInput placeholder='New pin' value={newPin} onChangeText={setNewPin} />
                        <PasswordTypeInput placeholder='Re-Enter new pin' value={newPinRe} onChangeText={setNewPinRe} />

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                            <Checkbox onValueChange={setIsCheckedPinWarn} value={isCheckedPinWarn} />
                            <Text style={[COMMON_STYLES.tooltipTextSmall, {flex: 1}]}>Please create your PIN carefully and remember it, as it will be required for login, medical report access, and authorization.</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                            <Checkbox onValueChange={setIsCheckedTerms} value={isCheckedTerms} />
                            <Text style={[COMMON_STYLES.tooltipTextSmall, {flex: 1}]}>Agree to the Terms & Conditions and Privacy Policy.</Text>
                        </View>

                        <SubmitButton title='Finish' disabled={!newPin?.trim() || !newPinRe?.trim() || newPin !== newPinRe || !isCheckedPinWarn || !isCheckedTerms} onPress={finishSignup} style={{marginTop: 8}} loading={isProcessing} />

                        <View style={{height: 12}} />
                    </>
                : null}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    codeResendGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    stagePreviewContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    stageLabelHolder: {
        backgroundColor: COLORS.lightGreen,
        borderRadius: '50%',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.darkGreen
    },
    stageLableHolderInactive: {
        backgroundColor: COLORS.lightGray,
        borderColor: COLORS.gray,
        width: 35,
        height: 35,
        opacity: 0.6
    },
    stageLabel: {
        fontSize: 18,
        color: COLORS.darkGreen,
        fontWeight: 'bold'
    },
    stageLabelInactive: {
        color: COLORS.gray
    },

    gmailCard: {
        borderRadius: 6,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        gap: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    gmailCardIcon: {
        borderRadius: 8,
        backgroundColor: COLORS.lightGreen2,
        padding: 5,
    },
    gmailVerfStatusBox: {
        alignItems: 'center',
        borderRadius: 12,
        padding: 4,
        marginLeft: 'auto'
    },
});