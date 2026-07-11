import { View, Text, useWindowDimensions, StyleSheet, ScrollView } from "react-native";
import { Canvas, Circle, Group, Path, Rect, Skia } from '@shopify/react-native-skia';
import { COLORS } from "../../colors/colors";
import { useAnimatedReaction, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import { FontAwesome } from '@expo/vector-icons';
import LeftPanel from "./create-report-screen-parts/LeftPanel";
import RightPanel from "./create-report-screen-parts/RightPanel";
import CustomTopBar from "./create-report-screen-parts/CustomTopBar";
import apiClient from "../../utils/api-client";
import {File, Paths} from 'expo-file-system';
import { AsyncStorageDriver } from "../../data/AsyncStorageDriver";
import Toast from "react-native-toast-message";
import { THEME } from "../../themes/theme";

const DrawableContext = createContext({
    getStrokePoints: ()=>{},
});

function DrawableArea({currentTool, strokeTrace, setStrokeTrace}) {
    const drawCtx = useContext(DrawableContext);

    const points = useSharedValue([]);
    const lineOfPoints = useDerivedValue(()=>{
        const line = Skia.Path.Make();
        for (let i = 0; i < points.value.length; i++) {
            if (points.value[i].state === "begin") {
                line.moveTo(points.value[i].x, points.value[i].y);
            }
            else if (points.value[i].state === "update") {
                line.lineTo(points.value[i].x, points.value[i].y);
            }
        }
        return line;
    });

    const canvaPosition = useSharedValue({translateX: 0, translateY: 0, scale: 1});
    const canvaPositionGet = useDerivedValue(()=>{
        const {translateX, translateY, scale} = canvaPosition.value;
        return [{translateX: translateX}, {translateY: translateY}, {scale: scale}];
    })

    const eraserPosition = useSharedValue({x: 0, y: 0});
    const eraserPositionGet = useDerivedValue(()=>{
        const {x, y} = eraserPosition.value;
        return [{translateX: x}, {translateY: y}];
    });
    const eraserOpacity = useSharedValue(0);
    const eraserOpacityGet = useDerivedValue(()=>{
        return eraserOpacity.value ? 1 : 0;
    })
    const eraserRadius = useSharedValue(20);
    const eraserRadiusGet = useDerivedValue(()=>{
        return eraserRadius.value;
    });

    // =================== Gestures =====================
    // Drawing pen gesture
    const drawingGesture = Gesture.Pan()
    .onBegin((e)=>{
        points.value = [...points.value, {x: (e.x - canvaPosition.value.translateX) / canvaPosition.value.scale, y: (e.y - canvaPosition.value.translateY) / canvaPosition.value.scale, state: "begin"}]
    })
    .onUpdate((e)=>{
        points.value = [...points.value, {x: (e.x - canvaPosition.value.translateX) / canvaPosition.value.scale, y: (e.y - canvaPosition.value.translateY) / canvaPosition.value.scale, state: "update" }]
    })
    .onEnd((e)=>{
        points.value = [...points.value, {x: (e.x - canvaPosition.value.translateX) / canvaPosition.value.scale, y: (e.y - canvaPosition.value.translateY) / canvaPosition.value.scale, state: "end" }]
    });

    // Drag canvas gesture
    const lastDraggingPosition = useSharedValue({lastX: 0, lastY: 0, lastScale: 1});
    const draggingGesture = Gesture.Pinch()
    .onStart((e)=>{
        lastDraggingPosition.value = {lastX: e.focalX, lastY: e.focalY, lastScale: e.scale};
    })
    .onUpdate((e)=>{
        let movementX = 0;
        let movementY = 0;
        let scaleChange = 0;
        let dragVelocity = 5;
        const {lastX, lastY, lastScale} = lastDraggingPosition.value;
        if (lastX - e.focalX >= 1) {
            movementX = -dragVelocity;
        }
        else if (lastX - e.focalX <= -1) {
            movementX = dragVelocity;
        }
        if (lastY - e.focalY >= 1) {
            movementY = dragVelocity;
        }
        else if (lastY - e.focalY <= -1) {
            movementY = -dragVelocity;
        }

        if (lastScale - e.scale >= 0) {
            scaleChange = 0.01;
        }
        else {
            scaleChange = -0.01;
        }

        lastDraggingPosition.value = {lastX: e.focalX, lastY: e.focalY, lastScale: e.scale};

        const {translateX, translateY, scale} = canvaPosition.value;
        canvaPosition.value = {translateX: translateX + movementX, translateY: translateY - movementY, scale: scale - scaleChange};
    })
    .onEnd((e)=>{
        console.log("PINCH END", e.focalY, e.scale, e.velocity);
    });

    // Ereaser gesture
    const eraserGesture = Gesture.Pan()
    .onBegin((e)=>{
        eraserOpacity.value = 1;
        eraserPosition.value = {x: (e.x - canvaPosition.value.translateX) / canvaPosition.value.scale, y: (e.y - canvaPosition.value.translateY) / canvaPosition.value.scale};
    })
    .onUpdate((e)=>{
        const new_point = {x: (e.x - canvaPosition.value.translateX) / canvaPosition.value.scale, y: (e.y - canvaPosition.value.translateY) / canvaPosition.value.scale};
        eraserPosition.value = new_point;
        
        for (let i = 0; i < points.value.length; i++) {
            const old_point = points.value[i];
            let distance = Math.sqrt(Math.pow(old_point.x - new_point.x, 2) + Math.pow(old_point.y - new_point.y, 2));
            if (distance <= eraserRadius.value) {
                const points_cpy = [...points.value];
                if (i > 0 && i < points.value.length-1) {
                    points_cpy[i-1].state = 'begin';
                    points_cpy[i+1].state = 'begin';
                }
                points_cpy.splice(i, 1);
                points.value = points_cpy;
                // console.log("Point to be removed: ", points.value[i], distance);
            }
        }
        eraserOpacity.value = 1;
    })
    .onEnd(()=>{
        eraserOpacity.value = 0;
    });

    // Select appropiate gasture for user interaction.
    let gestures = Gesture.Race(
        draggingGesture,
        drawingGesture,
    );
    switch (currentTool) {
        case 'pen':
            gestures = drawingGesture;
            break;
        case 'select':
            gestures = draggingGesture;
            break;
        case 'eraser':
            gestures = eraserGesture;
            break;
        default:
            break;
    }

    useEffect(()=>{
        drawCtx.getStrokePoints = ()=>{
            return points.value;
        }
    }, []);
    
    return (
        <ScrollView style={style.drawContainer} scrollEnabled={false}>
            <GestureHandlerRootView>
                <GestureDetector gesture={gestures} >
                    <Canvas style={{width: 1000, height: 1000, backgroundColor: COLORS.white}}>
                        <Group transform={canvaPositionGet}>
                            <Path path={lineOfPoints} style={'stroke'} color={'red'} strokeWidth={5}  />
                        </Group>

                        <Circle transform={eraserPositionGet} cx={0} cy={0} r={eraserRadiusGet} color={COLORS.black+"55"} opacity={eraserOpacityGet} />
                    </Canvas>
                </GestureDetector>
            </GestureHandlerRootView>
        </ScrollView>
    )
}

export default function CreateReportScreen({route}) {
    const [reportData, setReportData] = useState(route.params);
    const {width, height} = useWindowDimensions();
    const navigator = useNavigation();
    const [currentTool, setCurrentTool] = useState('pen');
    const [strokeTrace, setStrokeTrace] = useState([]);
    const [reportId, setReportId] = useState([]);

    const drawCtx = useContext(DrawableContext);

    const onSaveReport = async ()=>{
        const report_draw_data = {
            strokes: drawCtx.getStrokePoints(),
        }

        // Save report file in cloud storage
        const dummy_file_name = (new Date()).toISOString()+".report";
        const report_file = new File(Paths.cache, dummy_file_name);
        await report_file.write(JSON.stringify(report_draw_data));

        const form_data = new FormData();
        form_data.append('file', {
            uri: report_file.uri,
            name: dummy_file_name,
            type: "application/octet-stream",
        });
        const file_save_resp = await apiClient.sendReportFile(form_data);
        
        // If file is saved then save report data
        if (file_save_resp?.success) {
            const doctor_info = JSON.parse(await AsyncStorageDriver.getItem("user_data"));
            const report_data = {
                title: reportData.title,
                disease: reportData.diseaseName,
                patient_id: reportData.patient.id,
                doctor_id: doctor_info.id,
                hospital_id: doctor_info.hospital.id,
                report_file_name: file_save_resp.data.report_file_name
            }
            const data_save_resp = await apiClient.saveReportData(report_data);
            if (data_save_resp.success) {
                setReportId(report_data.report_file_name);
                Toast.show({text2: 'Successfully saved report', type: 'success'});
            }
            else {
                Toast.show({text2: `Failed to save report.\nError: ${data_save_resp?.message || data_save_resp?.data}`, type: 'error'});
            }
        }
    }

    const autoScreenOrientation = async ()=>{
        if (width > height || 1) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        }
        else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }
    }

    useEffect(()=>{
        autoScreenOrientation();
        return ()=>{
            ScreenOrientation.unlockAsync();
        }
    }, []);

    useEffect(()=>{
        navigator.setOptions({
            headerShown: false
        });
        navigator.getParent()?.setOptions({
            tabBarStyle: {display: 'none', backgroundColor: THEME.light.bottomBarBG, borderRadius: 18},
        });

        return ()=>{
            navigator.setOptions({
                headerShown: true
            });
            navigator.getParent()?.setOptions({
                tabBarStyle: {display: 'flex', backgroundColor: THEME.light.bottomBarBG, borderRadius: 18},
            });
        }
    }, [navigator]);

    return (
        <SafeAreaView style={style.container}>
            <CustomTopBar title={reportData?.title} patientData={reportData?.patient} onSave={onSaveReport} />
            <View style={{flexDirection: 'row', flex: 1, gap: 2}}>
                <LeftPanel onSelectTool={setCurrentTool} selectedTool={currentTool} />
                <DrawableArea currentTool={currentTool} strokeTrace={strokeTrace} setStrokeTrace={setStrokeTrace} />
                <RightPanel />
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        padding: 2,
        flex: 1,
        backgroundColor: COLORS.white,
        gap: 2,
    },

    drawContainer: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightGray1,
    },

    toolButton: {},
});