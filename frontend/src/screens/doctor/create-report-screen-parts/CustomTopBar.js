import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../colors/colors";
import { TextInput } from "react-native-gesture-handler";
import SmallButton from "../../../components/SmallButton";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function CustomTopBar({title, patientData, onSave=async()=>{}}) {
    const navigation = useNavigation();
    const [showPatientInfo, setShowPatientInfo] = useState(false);
    const [saving, setSaving] = useState(false);

    const onClickBack = () => {
        navigation.goBack();
    }

    const onSaveReport = ()=>{
        setSaving(true);
        onSave().finally(()=>{
            setSaving(false);
        })
    }

    return (
        <View style={style.topBarBody}>
            <TouchableOpacity activeOpacity={0.7} style={style.backIcon} onPress={onClickBack}>
                <FontAwesome name="arrow-left" size={24} color={COLORS.deepDarkGreen} />
            </TouchableOpacity>

            <View style={style.patientPfp}>
                <TouchableOpacity onPress={()=>setShowPatientInfo(!showPatientInfo)}>
                    <FontAwesome name="user" size={32} color={COLORS.darkGreen} />
                </TouchableOpacity>
                {showPatientInfo ? 
                <View style={style.expandedInfoBox}>
                    <Text>
                        {patientData?.fullname+'\n'} • {patientData?.age} yrs • {patientData?.gender}
                    </Text>
                    <Text style={{marginLeft: 'auto'}}>📞 {patientData?.phone_no}</Text>
                </View>
                :
                null}
            </View>

            <View style={style.titleArea}>
                <Text style={style.screenTitle}>Create Report</Text>
                <TextInput value={title} style={style.reportTitleInput} />
            </View>

            <View style={style.leftOptions}>
                <SmallButton title={"Export"} btnStyle={{backgroundColor: COLORS.dodgerBlue}} />
                <SmallButton title={saving ? "Saving": "Save"} onPress={onSave} disabled={saving} />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    topBarBody: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightGray,
        height: 70,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray1,
        alignItems: 'center',
        gap: 20,
    },

    backIcon: {
        marginLeft: 20,
    },

    patientPfp: {
        width: 50,
        height: 50,
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedInfoBox: {
        position: 'absolute',
        top: 50,
        left: 0,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 12,
        zIndex: 4,
        width: 170,
        elevation: 4,
        gap: 8,
    },

    titleArea: {
        gap: 3
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: COLORS.deepDarkGreen
    },

    reportTitleInput: {
        borderBottomColor: COLORS.darkGreen,
        borderBottomWidth: 2,
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0
    },

    leftOptions: {
        flexDirection: 'row',
        marginLeft: 'auto',
        paddingRight: 20,
        gap: 8,
    },
});