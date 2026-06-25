import { StyleSheet } from "react-native";
import { COLORS } from "../colors/colors";

export const COMMON_STYLES = StyleSheet.create({
    tooltipTextSmall: {
        fontSize: 12,
        color: COLORS.gray,
    },
    tooltipTextMid: {
        fontSize: 14,
        color: COLORS.gray,
    },
    tooltipTextLarge: {
        fontSize: 16,
        color: COLORS.gray,
    },

    screenContent: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 6,
        flex: 1,
        margin: 4,
        marginTop: 8,
        marginBottom: 8,
        elevation: 2,
    },

    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.modalBlackBG,
        zIndex: 2,
        justifyContent: 'center',
        padding: 4
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: 5
    }
});
