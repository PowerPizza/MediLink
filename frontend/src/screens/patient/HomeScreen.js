import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COMMON_STYLES } from '../../commons/common-styles';
import { COLORS } from '../../colors/colors';

export default function HomeScreen() {
    const patientData = {
        name: "John Doe",
        gender: "Male",
        age: 28,
        email: "johndoe123@gmail.com",
        patientId: "PT-2024-001234"
    };

    return (
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={COMMON_STYLES.screenContent}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <FontAwesome name="user" size={48} color={COLORS.darkGreen} />
                    </View>
                    
                    <View style={styles.infoSection}>
                        <Text style={styles.patientName}>{patientData.name}</Text>
                        <Text style={styles.patientMetaInfo}>
                            {patientData.gender} • {patientData.age} Years
                        </Text>
                        <Text style={styles.patientEmail}>{patientData.email}</Text>
                    </View>
                </View>

                <View style={styles.profileDivider} />

                <View style={styles.qrSection}>
                    <View style={styles.qrPlaceholder}>
                        <Text style={styles.qrPlaceholderText}>QR Code</Text>
                    </View>
                    <Text style={styles.qrInstructionText}>
                        Show this QR to your doctor to connect your profile
                    </Text>
                </View>

                <View style={styles.patientIdCard}>
                    <FontAwesome name="id-card" size={28} color={COLORS.darkGreen} style={styles.idIcon} />
                    <View style={styles.idTextContainer}>
                        <Text style={styles.idLabel}>Patient ID</Text>
                        <Text style={styles.idValue}>{patientData.patientId}</Text>
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