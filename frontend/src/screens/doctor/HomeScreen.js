import { Text, View } from "react-native";
import { COMMON_STYLES } from "../../commons/common-styles";
import apiClient from "../../utils/api-client";
import { AsyncStorageDriver } from "../../data/AsyncStorageDriver";
import { useEffect, useState } from "react";
import LoaderOverlay from "../../components/LoaderOverlay";

export default function HomeScreen() {
    const [doctorData, setDoctorData] = useState(null);
    
    useEffect(()=>{
        (async ()=>{
            try {
                const cached_user_data = JSON.parse(await AsyncStorageDriver.getItem('user_data'));
                if (!cached_user_data) throw "Doctor data not found.";
                if ((cached_user_data.full_name ?? 'undf') === 'undf') throw "Doctor data not found.";  // THIS MUST BE REMOVED AND PROPER ROLE BASED IDENTIFICATION OF STORED CACHE DATA IS NEEDED.
                setDoctorData(cached_user_data);
                console.log("Doctor data found in cache.");
            }
            catch (_) {
                try {
                    const latest_user_data = await apiClient.getDoctorData();
                    await AsyncStorageDriver.setItem('user_data', JSON.stringify(latest_user_data));
                    setDoctorData(latest_user_data);
                    console.log("Doctor data didn't found in cache, fetching from backend.");
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

    if (!doctorData) {
        return (
            <LoaderOverlay />
        )
    }

    return (
        <View style={COMMON_STYLES.screenContent}>
            <Text>Welcome back doctor!</Text>
        </View>
    );
}