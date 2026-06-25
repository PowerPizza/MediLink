import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import { COMMON_STYLES } from '../commons/common-styles';

export default function MedicalReportCard({
    reportId = '12345',
    patientName = 'Patient Name',
    disease = 'Condition',
    createdBy = 'Doctor Name',
    status = 'CLOSED',
    statusColor = COLORS.darkRed,
    date = '',
}) {
    const initials = patientName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={[COMMON_STYLES.tooltipTextMid, {color: COLORS.darkGreen, fontWeight: '700'}]}>Report #{reportId}</Text>
                <Text style={styles.dateText}>{date}</Text>
                <TouchableOpacity style={styles.moreIconStyle}>
                    <FontAwesome name="ellipsis-v" size={16} color={COLORS.gray} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentRow}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>

                <View style={styles.infoColumn}>
                    <Text style={styles.patientName}>{patientName}</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Disease</Text>
                        <Text style={styles.value}>{disease}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Created by</Text>
                        <Text style={styles.value}>{createdBy}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22`, borderColor: statusColor+"55", borderWidth: 1 }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 8,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
        gap: 4,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.gray,
        marginLeft: 'auto',
    },
    moreIconStyle: {
        padding: 4,
        borderRadius: 12,
        alignSelf: 'flex-end',
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 2,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.lightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        color: COLORS.darkGreen,
        fontSize: 16,
        fontWeight: '700',
    },
    infoColumn: {
        flex: 1,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.lazyBlack,
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray,
        marginRight: 6,
    },
    value: {
        fontSize: 14,
        color: COLORS.lazyBlack,
        fontWeight: '500',
    },
});
