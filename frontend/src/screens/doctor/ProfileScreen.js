import { Text, View } from "react-native";
import { COMMON_STYLES } from "../../commons/common-styles";
import SmallButton from "../../components/SmallButton";
import { AsyncStorageDriver } from "../../data/AsyncStorageDriver";
import Toast from "react-native-toast-message";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import apiClient from "../../utils/api-client";
import AppContext from "../../contexts/AppContext";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [loggingOut, setLoggingOut] = useState(false);
    const shared_data = useContext(AppContext);

    const onLogout = async ()=>{
        setLoggingOut(true);
        if (await apiClient.logout()) {
            Toast.show({
                text2: "Logged out",
                type: "info"
            });
            
            shared_data.setIsLoggedIn(false);
            shared_data.setRole(null);
            try{
                navigation.getParent()?.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: "authNavs"}
                    ]
                }));
            }
            catch(exc) {
                Toast.show({
                    text2: "Logged out but navigation failed - please restart application.",
                    type: "error"
                });
            }
        }
        else {
            Toast.show({
                text2: "Failed to logout",
                type: "error"
            });
            setLoggingOut(false);
        }
    }
    return (
        <View style={COMMON_STYLES.screenContent}>
            <Text>Welcome to profiles!</Text>
            <SmallButton title={"Logout"} onPress={onLogout} disabled={loggingOut} />
        </View>
    );
}