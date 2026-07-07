import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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

function CreateReportModal({ visible, title, description, disease, selectedPatient, patientOptions, onTitleChange, onDescriptionChange, onDiseaseChange, onSelectPatient, onCreate, onClose }) {
    if (!visible) return null;


    const patient_ids = useRef([]);
    const [searchPIDValue, setSearchPIDValue] = useState("");
    const [searchPIDResult, setSearchPIDResult] = useState([]);

    const onChangeSearchPatientId = (value) => {
        setSearchPIDResult(patient_ids.current.filter(id => id?.startsWith(value)));
    }

    const _onSelectPatientId = (patient_id)=>{
        onSelectPatient(patient_id);
        setSearchPIDResult([]);
    }

    useEffect(()=>{
        if (visible) {
            (async ()=>{
                // Load all active patient ids from backend.
                patient_ids.current = await apiClient.getAllPatientIds();
            })();
        }
    }, [visible]);

    return (
        <View style={COMMON_STYLES.modalOverlay}>
            <View style={[COMMON_STYLES.modalContent, styles.modalContent]}>
                <Text style={styles.modalTitle}>Create Report</Text>
                <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent} showsVerticalScrollIndicator={true}>
                    <Text style={styles.fieldLabel}>Report Title</Text>
                    <TextTypeInput
                        placeholder="Enter report title"
                        value={title}
                        onChangeText={onTitleChange}
                        style={styles.inputWrapper}
                    />

                    <Text style={styles.fieldLabel}>Description</Text>
                    <TextTypeInput
                        placeholder="Enter description"
                        value={description}
                        onChangeText={onDescriptionChange}
                        style={styles.textAreaWrapper}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical={'top'}
                    />

                    <Text style={styles.fieldLabel}>Disease Name</Text>
                    <TextTypeInput
                        placeholder="Enter disease name"
                        value={disease}
                        onChangeText={onDiseaseChange}
                        style={styles.inputWrapper}
                    />

                    <Text style={styles.fieldLabel}>Patient</Text>
                    {/* <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.selectInput} onPress={onTogglePatientSelect} activeOpacity={0.8}>
                            <Text style={[styles.selectText, !selectedPatient ? styles.placeholderText : null]}>
                                {selectedPatient ? selectedPatient.label : 'Select patient'}
                            </Text>
                            <FontAwesome name={patientSelectOpen ? "chevron-up" : "chevron-down"} size={16} color={COLORS.gray} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6}>
                            <FontAwesome name="qrcode" size={42} color={COLORS.darkGreen} />
                        </TouchableOpacity>
                    </View> */}
                    <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                        <TextTypeInput style={{flex: 1}} placeholder="Search patient id..." onChangeText={onChangeSearchPatientId} />

                        <TouchableOpacity activeOpacity={0.6}>
                            <FontAwesome name="qrcode" size={42} color={COLORS.darkGreen} />
                        </TouchableOpacity>
                    </View>

                    {searchPIDResult.length ? (
                        <View style={styles.selectOptions}>
                            {searchPIDResult.map((patient_id, idx) => (
                                <TouchableOpacity
                                    key={'pid-id'+idx}
                                    style={styles.selectOption}
                                    onPress={() => _onSelectPatientId(patient_id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.selectOptionText}>{patient_id}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : null}
                </ScrollView>

                <View style={styles.modalActions}>
                    <SubmitButton title="Cancel" onPress={onClose} style={styles.cancelButton} />
                    <SubmitButton title="Create" onPress={onCreate} style={styles.createButton} />
                </View>
            </View>
        </View>
    );
}

export default function ReportsScreen() {
    const navigator = useNavigation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [diseaseName, setDiseaseName] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);

    const patientOptions = [
        { label: "Patient A", value: "patient-a" },
        { label: "Patient B", value: "patient-b" },
        { label: "Patient C", value: "patient-c" },
    ];

    const openCreateReportScreen = () => {
        navigator.navigate("CreateReport");
    }

    const openCreateReportModal = () => {
        setShowCreateModal(true);
    }

    const closeCreateReportModal = () => {
        setShowCreateModal(false);
    }

    const handleCreateReport = () => {
        closeCreateReportModal();
        openCreateReportScreen();
    }

    React.useLayoutEffect(() => {
        navigator.getParent()?.setOptions({
            headerShown: false
        });

        return () => {
            navigator.getParent()?.setOptions({
                headerShown: true
            });
        };
    }, []);

    return (
        <View style={[COMMON_STYLES.screenContent, styles.mainContainer]}>
            <CreateReportModal
                visible={showCreateModal}
                title={reportTitle}
                description={reportDescription}
                disease={diseaseName}
                selectedPatient={selectedPatient}
                patientOptions={patientOptions}
                onTitleChange={setReportTitle}
                onDescriptionChange={setReportDescription}
                onDiseaseChange={setDiseaseName}
                onSelectPatient={setSelectedPatient}
                onCreate={handleCreateReport}
                onClose={closeCreateReportModal}
            />
            <View style={styles.headerSection}>
                <View style={styles.searchRow}>
                    <TextTypeInput placeholder="Search reports..." style={{flex: 1}} />
                    <SubmitButton title="+ Create" onPress={openCreateReportModal} />
                </View>
                <ExpandableView title="Filters">
                    <Text>Filter content goes here</Text>
                </ExpandableView>
            </View>

            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={true}
            >
                <MedicalReportCard date="20-09-2026" />
                <MedicalReportCard status="OPEN" statusColor={COLORS.darkGreen} />
                <MedicalReportCard date="18-09-2026" />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
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
        paddingBottom: 20,
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
});