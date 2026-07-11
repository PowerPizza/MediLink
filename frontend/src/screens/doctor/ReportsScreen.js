import { Text, View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { COMMON_STYLES } from "../../commons/common-styles";
import TextTypeInput from "../../components/auth-entries/TextTypeInput";
import SubmitButton from "../../components/SubmitButton";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../colors/colors";
import SmallButton from "../../components/SmallButton";
import MedicalReportCard from "../../components/MedicalReportCard";
import ExpandableView from "../../components/ExpandableView";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { THEME } from "../../themes/theme";
import apiClient from "../../utils/api-client";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import LoaderOverlay from "../../components/LoaderOverlay";
import Toast from "react-native-toast-message";

function CreateReportModal({ visible, onClose, navigator }) {
    const patient_ids = useRef([]);
    const [searchPIDValue, setSearchPIDValue] = useState("");
    const [searchPIDResult, setSearchPIDResult] = useState([]);
    const [selectedPatientData, setSelectedPatientData] = useState();
    const [permission, requestPermission] = useCameraPermissions();
    const [openCamera, setOpenCamera] = useState(false);

    const [reportTitle, setReportTitle] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [diseaseName, setDiseaseName] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);

    const onChangeSearchPatientId = (value) => {
        setSearchPIDValue(value);
        if (value === "") {
            setSearchPIDResult([]);
            return;
        }
        setSearchPIDResult(patient_ids.current.filter(id => id?.startsWith(value)));
    }

    const _onSelectPatientId = async (patient_id) => {
        setSearchPIDValue('');
        setSearchPIDResult([]);

        const patient_info = await apiClient.getPatientInfoByPID(patient_id);
        if (patient_info.status === 200) {
            setSelectedPatient(patient_id);
            setSelectedPatientData(patient_info?.data);
        }
        else {
            setSelectedPatient(null);
            setSelectedPatientData(null);
            Toast.show({ text2: "Failed to get patient.", type: 'error' });
        }
    }

    const onScanQR = async () => {
        if (!permission.granted) {
            await requestPermission();
        }
        setOpenCamera(true);
    }

    const onCloseQRScanner = async () => {
        setOpenCamera(false);
    }

    const captureQRResult = (result) => {
        _onSelectPatientId(result.data);
        setOpenCamera(false);
    }

    const onCloseModal = () => {
        setOpenCamera(false);
        onClose();
    }

    const openCreateReportScreen = () => {
        const creation_data = {
            title: reportTitle,
            description: reportDescription,
            diseaseName: diseaseName,
            patient: selectedPatientData,
        };

        if (!selectedPatient) {
            Toast.show({ text2: "Please select the patient.", type: 'error' });
            return;
        }
        else if (!reportTitle || !reportDescription || !diseaseName) {
            Toast.show({ text2: "Please fill all required entires.", type: 'error' });
            return;
        }
        onClose();
        navigator.navigate("CreateReport", creation_data);
    }

    useEffect(() => {
        (async () => {
            // Load all active patient ids from backend.
            patient_ids.current = await apiClient.getAllPatientIds();
        })();

        return () => {
            console.log('unmount');
        }
    }, [])

    if (openCamera) {
        return (
            <KeyboardAvoidingView
                style={[COMMON_STYLES.modalOverlay, { flex: 1, backgroundColor: COLORS.transparent, borderRadius: 8, padding: 0 }]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={[COMMON_STYLES.modalContent, styles.modalContent, { flex: 1, maxHeight: 'auto', gap: 4 }]}>
                    <View style={camModalStyles.header}>
                        <TouchableOpacity onPress={onCloseQRScanner} activeOpacity={0.8} style={camModalStyles.backIcon}>
                            <FontAwesome name="angle-left" size={32} color={COLORS.deepDarkGreen} />
                        </TouchableOpacity>
                        <Text style={camModalStyles.headingText}>QR Scanner</Text>
                    </View>

                    <View style={[camModalStyles.squareOverlay, { flex: 1 }]}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.darkGreen, marginBottom: 10 }}>Scan the patient's QR Code</Text>
                        {permission?.granted && openCamera ?
                            <CameraView style={camModalStyles.squareShape} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={captureQRResult} />
                            :
                            <View style={camModalStyles.squareShape}>
                                <LoaderOverlay />
                            </View>
                        }
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[COMMON_STYLES.modalOverlay, styles.modalKeyboardContainer]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
                <View style={[COMMON_STYLES.modalContent, styles.modalContent]}>
                    <Text style={styles.modalTitle}>Create Report</Text>
                    <ScrollView
                        style={styles.modalBody}
                        contentContainerStyle={styles.modalBodyContent}
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="interactive"
                    >
                        <Text style={styles.fieldLabel}>Report Title</Text>
                        <TextTypeInput
                            placeholder="Enter report title"
                            value={reportTitle}
                            onChangeText={setReportTitle}
                            style={styles.inputWrapper}
                        />

                        <Text style={styles.fieldLabel}>Description</Text>
                        <TextTypeInput
                            placeholder="Enter description"
                            value={reportDescription}
                            onChangeText={setReportDescription}
                            style={styles.textAreaWrapper}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical={'top'}
                        />

                        <Text style={styles.fieldLabel}>Disease Name</Text>
                        <TextTypeInput
                            placeholder="Enter disease name"
                            value={diseaseName}
                            onChangeText={setDiseaseName}
                            style={styles.inputWrapper}
                        />

                        <Text style={styles.fieldLabel}>Patient</Text>
                        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                            <TextTypeInput style={{ flex: 1 }} placeholder="Search patient id..." onChangeText={onChangeSearchPatientId} value={searchPIDValue} />

                            <TouchableOpacity activeOpacity={0.6} onPress={onScanQR}>
                                <FontAwesome name="qrcode" size={42} color={COLORS.darkGreen} />
                            </TouchableOpacity>
                        </View>

                        {searchPIDResult.length ? (
                            <View style={styles.selectOptions}>
                                {searchPIDResult.map((patient_id, idx) => (
                                    <TouchableOpacity
                                        key={'pid-id' + idx}
                                        style={styles.selectOption}
                                        onPress={() => _onSelectPatientId(patient_id)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.selectOptionText}>{patient_id}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null}

                        {selectedPatient ?
                            <View style={styles.patientView}>
                                <View style={styles.patientPfp}>
                                    <FontAwesome name="user" size={32} color={COLORS.darkGreen} />
                                </View>
                                <View style={styles.patientTxtInfo}>
                                    <Text style={{ color: COLORS.darkGreen, fontSize: 16, fontWeight: '700' }}>{selectedPatientData?.fullname}</Text>
                                    <Text style={{ color: COLORS.darkGreen }} numberOfLines={1} ellipsizeMode="tail">{selectedPatientData?.gmail}</Text>
                                </View>
                                <Text style={styles.tagSelectedPatient}>
                                    <FontAwesome name="check" color={COLORS.darkGreen} size={14} />
                                </Text>
                            </View>
                            :
                            null}
                    </ScrollView>

                    <View style={styles.modalActions}>
                        <SubmitButton title="Cancel" onPress={onCloseModal} style={styles.cancelButton} />
                        <SubmitButton title="Create" onPress={openCreateReportScreen} style={styles.createButton} />
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default function ReportsScreen() {
    const navigator = useNavigation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [reportsPartialList, setReportsPartialList] = useState([]);
    const [reportListLoading, setReportListLoading] = useState(false);

    const openCreateReportModal = () => {
        setShowCreateModal(true);
    }

    const closeCreateReportModal = () => {
        setShowCreateModal(false);
    }

    const loadReportsAsCards = async ()=>{
            setReportListLoading(true);
            const response = await apiClient.getAllPartialReportList();
            setReportsPartialList(response);
            setReportListLoading(false);
    }

    useEffect(() => {
        loadReportsAsCards();
    }, []);

    React.useLayoutEffect(() => {
        navigator.getParent()?.setOptions({
            headerShown: false
        });

        return () => {
            navigator.getParent()?.setOptions({
                headerShown: true
            });
        };
    }, [navigator]);

    return (
        <KeyboardAvoidingView
            style={styles.screenKeyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={[COMMON_STYLES.screenContent, styles.mainContainer]}>
                {showCreateModal ?
                    <CreateReportModal
                        onClose={closeCreateReportModal}
                        navigator={navigator}
                    />
                    :
                    null
                }

                <View style={styles.headerSection}>
                    <View style={styles.searchRow}>
                        <TextTypeInput placeholder="Search reports..." style={{ flex: 1 }} />
                        <SubmitButton title="+ Create" onPress={openCreateReportModal} />
                    </View>
                    <ExpandableView title="Filters">
                        <Text>Filter content goes here</Text>
                    </ExpandableView>
                </View>

                <ScrollView
                    style={styles.contentContainer}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    {reportListLoading ?
                        <LoaderOverlay />
                        :
                        reportsPartialList.length ?
                            reportsPartialList.map((report, idx) => {
                                return (
                                    <MedicalReportCard
                                        status={report.is_closed ? "CLOSED" : "OPEN"}
                                        statusColor={report.is_closed ? COLORS.darkRed : COLORS.darkGreen}
                                        title={report.title}
                                        patientName={report.patient_name}
                                        createdBy={report.created_by}
                                        date={report.created_at}
                                        disease={report.disease}
                                        reportId={report.id}
                                        key={"REPORT-PARTIAL" + idx} />
                                );
                            })
                            :
                            <Text style={COMMON_STYLES.tooltipTextMid}>No reports to show.</Text>
                    }
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screenKeyboardContainer: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        padding: 12,
    },
    headerSection: {
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingBottom: 8,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        gap: 12,
        paddingHorizontal: 0,
        paddingVertical: 6,
    },
    modalKeyboardContainer: {
        flex: 1,
    },
    modalContent: {
        borderRadius: 12,
        maxHeight: '90%',
        padding: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 14,
        color: COLORS.lazyBlack,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
        color: COLORS.lazyBlack,
    },
    inputWrapper: {
        marginBottom: 6,
    },
    textAreaWrapper: {
        minHeight: 100,
    },
    modalBody: {
        maxHeight: 380,
    },
    modalBodyContent: {
        paddingBottom: 12,
    },
    selectInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        borderRadius: 6,
        padding: 12,
        backgroundColor: COLORS.white,
    },
    selectText: {
        fontSize: 16,
        color: COLORS.lazyBlack,
    },
    placeholderText: {
        color: COLORS.gray,
    },
    selectOptions: {
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        borderRadius: 6,
        backgroundColor: COLORS.white,
        marginTop: 6,
        overflow: 'hidden',
    },
    selectOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    selectOptionText: {
        fontSize: 16,
        color: COLORS.lazyBlack,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 18,
    },
    cancelButton: {
        width: 100,
        backgroundColor: COLORS.lightRed,
    },
    createButton: {
        width: 100,
    },
    patientView: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightGreen,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        borderRadius: 6,
        marginTop: 8,
        alignContent: 'center',
        padding: 12,
    },
    patientPfp: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: COLORS.darkGreen,
        width: 50,
        height: 50,
    },
    patientTxtInfo: {
        justifyContent: 'center',
        marginLeft: 18,
        width: '50%',
    },
    tagSelectedPatient: {
        backgroundColor: COLORS.lightGreen2,
        borderWidth: 1,
        borderColor: COLORS.darkGreen,
        color: COLORS.darkGreen,
        paddingHorizontal: 12,
        marginBottom: 'auto',
        borderRadius: 12,
        paddingVertical: 2,
        marginLeft: 'auto',
    },
});

const camModalStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.lightGray,
    },

    backIcon: {
        borderRadius: '50%',
        paddingHorizontal: 12,
    },

    headingText: {
        fontSize: 18,
        fontWeight: 700,
        color: COLORS.darkGreen,
        marginLeft: 12,
    },

    squareOverlay: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.lightGreen,
        borderRadius: 4,
    },
    squareShape: {
        width: 250,
        height: 250,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.lightRed,
    },
});