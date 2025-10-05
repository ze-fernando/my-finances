import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../utils/colors";

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg_secondary,
        padding: 16,
        paddingTop: 30,
    },
    eyeButtonContainer: {           // Botão de olho
   flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%' 
    },
    eyeButton: {
        backgroundColor: colors.bg_primary,
        borderRadius: 12,
        padding: 6,
    },

    boxLabel: {
        color: "white",
        fontSize: 16, // maior
        marginBottom: 6,
        textAlign: "left",
        alignSelf: "flex-start",
    },
    boxValue: {
        color: "white",
        fontSize: 18, // maior
        fontWeight: "bold",
        textAlign: "left",
        alignSelf: "flex-start",
    },
    mainCard: {
        backgroundColor: colors.bg_primary,
        padding: 18,
        borderRadius: 10,
        marginBottom: 14,
        alignItems: "flex-start", // alinhamento à esquerda
    },
    sideCard: {
        backgroundColor: colors.bg_primary,
        padding: 18,
        borderRadius: 10,
        height: 120,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    cardsRow: {                     // Linha de cards
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    maxExpenseName: {
        color: "white",
        marginTop: 4,
    },

    barChartSection: {
        marginBottom: 100,
    },
    barChartTitle: {
        color: "white",
        fontSize: 16,
        marginBottom: 8,
    },
    barChartStyle: {
        borderRadius: 16,
    },

});

export default styles;

