import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg_secondary,
        padding: 16,
        paddingTop: 30,
    },
    topBoxes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    box: {
        flex: 1,
        backgroundColor: colors.bg_primary,
        padding: 16,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    boxLabel: {
        color: "white",
        fontSize: 14,
        marginBottom: 4,
    },
    boxValue: {
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
    },
    pieBox: {
        backgroundColor: colors.bg_primary,
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        alignItems: "center",
    },
    maxExpenseBox: {
        flexDirection: "row",
        backgroundColor: colors.bg_primary,
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 32,
    },
    viewMaxExpense: {
        flexDirection: "row",
        columnGap: 10
    },
    maxExpenseValue: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    maxExpenseAmount: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    barChartSection: {
        bottom: 20,
        marginBottom: 32,
    },
});


export default styles;