import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COMMON_STYLES } from '../../commons/common-styles';
import { COLORS } from '../../colors/colors';
import apiClient from '../../utils/api-client';
import { useEffect, useState } from 'react';
import { AsyncStorageDriver } from '../../data/AsyncStorageDriver';
import Toast from 'react-native-toast-message';
import LoaderOverlay from '../../components/LoaderOverlay';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {
    const [patientData, setPatientData] = useState(null);

    useEffect(()=>{
        (async ()=>{
            try {
                const cached_user_data = JSON.parse(await AsyncStorageDriver.getItem('user_data'));
                if (!cached_user_data) throw "Patient data not found.";
                setPatientData(cached_user_data);
                console.log("Patient data found in cache.");
            }
            catch (_) {
                try {
                    const latest_user_data = await apiClient.getPatientData();
                    await AsyncStorageDriver.setItem('user_data', JSON.stringify(latest_user_data));
                    setPatientData(latest_user_data);
                    console.log("Patient data didn't found in cache, fetching from backend.");
                }
                catch (err) {
                    console.log(err);
                    Toast.show({
                        text2: "Failed to fetch or cache user data : "+err,
                        type: 'error'
                    });
                }
            }
        })();
    }, []);

    if (!patientData) {
        return (
            <LoaderOverlay />
        )
    }
    return (
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={COMMON_STYLES.screenContent}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <FontAwesome name="user" size={48} color={COLORS.darkGreen} />
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.patientName}>{patientData.fullname}</Text>
                        <Text style={styles.patientMetaInfo}>
                            {patientData.gender} • {patientData.age} Years
                        </Text>
                        <Text style={styles.patientEmail}>{patientData.gmail}</Text>
                    </View>
                </View>

                <View style={styles.profileDivider} />

                <View style={styles.qrSection}>
                    <View style={styles.qrPlaceholder}>
                        <QRCode size={130} value={patientData.patient_id} />
                    </View>
                    <Text style={styles.qrInstructionText}>
                        Show this QR to your doctor to connect your profile
                    </Text>
                </View>

                <View style={styles.patientIdCard}>
                    <FontAwesome name="id-card" size={28} color={COLORS.darkGreen} style={styles.idIcon} />
                    <View style={styles.idTextContainer}>
                        <Text style={styles.idLabel}>Patient ID</Text>
                        <Text style={styles.idValue}>{patientData.patient_id}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.lazyBlack,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.lazyBlack,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.lightGreen2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoSection: {
        flex: 1,
        justifyContent: 'center',
    },
    patientName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.lazyBlack,
        marginBottom: 4,
    },
    patientMetaInfo: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 4,
    },
    patientEmail: {
        fontSize: 14,
        color: COLORS.gray,
    },
    profileDivider: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginVertical: 16,
    },
    qrSection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    qrPlaceholder: {
        width: 180,
        height: 180,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
    },
    qrPlaceholderText: {
        fontSize: 14,
        color: COLORS.gray,
        fontWeight: '500',
    },
    qrInstructionText: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 20,
    },
    patientIdCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 14,
        marginTop: 12,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        gap: 12,
    },
    idIcon: {
        padding: 8,
        backgroundColor: COLORS.lightGreen2,
        borderRadius: 8,
    },
    idTextContainer: {
        flex: 1,
    },
    idLabel: {
        fontSize: 12,
        color: COLORS.gray,
        fontWeight: '500',
        marginBottom: 2,
    },
    idValue: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.lazyBlack,
    },
});