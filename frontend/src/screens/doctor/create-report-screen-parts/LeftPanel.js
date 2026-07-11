import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { COLORS } from "../../../colors/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

function ToolButton({iconName, label, selected=false, onClick}) {
    return (
        <TouchableOpacity style={style.toolButtonOuter} onPress={onClick} activeOpacity={0.8}>
            <View style={[style.toolButton, selected ? style.toolButtonSelected : {}]}>
                <FontAwesome name={iconName} size={26} color={COLORS.black} />
                <Text>{label}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default function LeftPanel({selectedTool, onSelectTool=(tool)=>{}}) {
    const _onSelectTool = (tool)=>{
        onSelectTool(tool);
    }

    return (
        <ScrollView style={style.leftPanelBodyRaw} contentContainerStyle={style.leftPanelBody}>
            <View style={style.panelContent}>
                <Text>Tools</Text>
                <ToolButton iconName={'pencil'} label={"Pen"} selected={selectedTool === 'pen'} onClick={() => _onSelectTool('pen')} />
                <ToolButton iconName={'eraser'} label={"Eraser"} selected={selectedTool === 'eraser'} onClick={() => _onSelectTool('eraser')} />
                <ToolButton iconName={'arrows'} label={"Select"} selected={selectedTool === 'select'} onClick={() => _onSelectTool('select')} />
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    leftPanelBodyRaw: {
        backgroundColor: COLORS.lightGray,
        width: 150,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray1,
        padding: 8,
    },
    leftPanelBody: {
        paddingBottom: 20,
    },

    panelContent: {
        gap: 3,
    },

    toolButtonOuter: {
        borderRadius: 8,
    },
    toolButton: {
        alignItems: 'center',
        padding: 4,
        borderRadius: 8,
    },
    toolButtonSelected: {
        backgroundColor: COLORS.lightGreen2,
        elevation: 1
    },
});