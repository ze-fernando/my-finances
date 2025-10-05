import React, { useCallback, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DebtItem } from "../Debt/interfaces";
import { IncomeItem } from "../Income/interfaces";
import styles from "./styles";
import { fetchDebts, fetchIncomes } from "../../utils/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../utils/colors";
import BarChart from "react-native-chart-kit/dist/BarChart";

const screenWidth = Dimensions.get("window").width;

function Home() {
    const [debts, setDebts] = useState<DebtItem[]>([]);
    const [incomes, setIncomes] = useState<IncomeItem[]>([]);
    const [hideValues, setHideValues] = useState(false);

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalRemaining, setTotalRemaining] = useState(0);
    const [spentPercentage, setSpentPercentage] = useState(0);

    const loadData = async () => {
        const dbDebts = fetchDebts();
        const dbIncomes = fetchIncomes();

        const debtsPaidState = await AsyncStorage.getItem("debtsPaid");
        const incomesReceivedState = await AsyncStorage.getItem("incomesReceived");

        const debtsPaidMap: Record<string, boolean> = debtsPaidState ? JSON.parse(debtsPaidState) : {};
        const incomesReceivedMap: Record<string, boolean> = incomesReceivedState ? JSON.parse(incomesReceivedState) : {};

        const mappedDebts = dbDebts.map(d => ({ ...d, paid: debtsPaidMap[d.id] ?? d.paid }));
        const mappedIncomes = dbIncomes.map(i => ({ ...i, received: incomesReceivedMap[i.id] ?? i.received }));

        setDebts(mappedDebts);
        setIncomes(mappedIncomes);

        const expenses = mappedDebts.reduce((acc, d) => acc + d.value, 0);
        const income = mappedIncomes.reduce((acc, i) => acc + i.value, 0);

        setSpentPercentage(income > 0 ? (expenses / income) * 100 : 0);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    useEffect(() => {
        const expenses = debts.reduce((acc, d) => acc + d.value, 0);
        const income = incomes.reduce((acc, i) => acc + i.value, 0);

        setTotalExpenses(expenses);
        setTotalIncome(income);
        setTotalRemaining(income - expenses);
    }, [debts, incomes]);

    const formatCurrency = (value: number) =>
        hideValues
            ? "••••"
            : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const maxExpense = debts.reduce(
        (prev, current) => (current.value > prev.value ? current : prev),
        { id: 0, value: 0, name: "", paid: false }
    );

    const getPercentageColor = (percent: number) => {
        if (percent <= 30) return "green";
        if (percent <= 60) return "orange";
        return "red";
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            {/* Botão de olho */}
           

            {/* Cards principais */}
            <View style={{ marginBottom: 24 }}>
                <View style={styles.mainCard}>
                <View style={styles.eyeButtonContainer}>
                    <Text style={styles.boxLabel}>Recebido</Text>
                <TouchableOpacity style={styles.eyeButton} onPress={() => setHideValues(!hideValues)}>
                    <Ionicons name={hideValues ? "eye-off-outline" : "eye-outline"} size={20} color="white" />
                </TouchableOpacity>
</View>
                    <Text style={styles.boxValue} numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(totalIncome)}
                    </Text>
                </View>
                <View style={styles.mainCard}>
                    <Text style={styles.boxLabel}>Saída</Text>
                    <Text style={styles.boxValue} numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(totalExpenses)}
                    </Text>
                </View>
                <View style={styles.mainCard}>
                    <Text style={styles.boxLabel}>Restante</Text>
                    <Text style={styles.boxValue} numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(totalRemaining)}
                    </Text>
                </View>
            </View>

            {/* Linha de cards */}
            <View style={styles.cardsRow}>
                {/* Maior gasto */}
                <View style={[styles.sideCard, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.boxLabel}>Maior Gasto</Text>
                    <Text style={styles.boxValue} numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(maxExpense.value)}
                    </Text>
                    <Text style={styles.maxExpenseName}>{maxExpense.name}</Text>
                </View>

                {/* Percentual gasto */}
                <View style={[styles.sideCard, { flex: 1, marginLeft: 8, justifyContent: "center", alignItems: "center" }]}>
                    <Text style={styles.boxLabel}>Percentual gasto</Text>
                    <Text style={{ fontSize: 22, fontWeight: "bold", color: getPercentageColor(spentPercentage) }}>
                        {totalIncome > 0 ? `${spentPercentage.toFixed(0)}%` : "--%"}
                    </Text>
                    <Text style={{ color: "white", fontSize: 12 }}>do seu recebimento</Text>
                </View>
            </View>

            {/* Gráfico */}
            <View style={styles.barChartSection}>
                <Text style={styles.barChartTitle}>Gastos x Recebimentos</Text>
                <BarChart
                    data={{
                        labels: ["Recebido", "Saída"],
                        datasets: [{ data: [totalIncome, totalExpenses] }],
                    }}
                    width={screenWidth - 30}
                    height={220}
                    yAxisLabel="R$ "
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundGradientFrom: colors.bg_secondary,
                        backgroundGradientTo: colors.bg_secondary,
                        decimalPlaces: 2,
                        color: (opacity = 1) => colors.primary,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                    }}
                    style={styles.barChartStyle}
                    fromZero
                />
            </View>
        </ScrollView>
    );
}

export default Home;
