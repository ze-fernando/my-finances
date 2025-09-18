import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { colorPalette, colors } from "../../utils/colors";
import { DebtItem } from "../Debt/interfaces";
import { IncomeItem } from "../Income/interfaces";
import styles from "./styles";
import { fetchDebts, fetchIncomes } from "../../utils/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const getColor = (index: number) => colorPalette[index % colorPalette.length];

function Home() {
    const [debts, setDebts] = useState<DebtItem[]>([]);
    const [incomes, setIncomes] = useState<IncomeItem[]>([]);

    const loadData = async () => {
        const dbDebts = fetchDebts();
        const dbIncomes = fetchIncomes();

        const debtsPaidState = await AsyncStorage.getItem("debtsPaid");
        const incomesReceivedState = await AsyncStorage.getItem("incomesReceived");

        const debtsPaidMap: Record<string, boolean> = debtsPaidState ? JSON.parse(debtsPaidState) : {};
        const incomesReceivedMap: Record<string, boolean> = incomesReceivedState ? JSON.parse(incomesReceivedState) : {};

        setDebts(dbDebts.map(d => ({ ...d, paid: debtsPaidMap[d.id] ?? d.paid })));
        setIncomes(dbIncomes.map(i => ({ ...i, received: incomesReceivedMap[i.id] ?? i.received })));
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );
    const totalExpenses = debts.reduce((acc, d) => acc + d.value, 0);
    const totalIncome = incomes.reduce((acc, i) => acc + i.value, 0);
    const totalRemaining = totalIncome - totalExpenses;

    const maxExpense = debts.reduce(
        (prev, current) => (current.value > prev.value ? current : prev),
        { id: 0, value: 0, name: "", paid: false }
    );

    const pieData = debts.map((d, index) => ({
        name: d.name,
        value: d.value,
        color: getColor(index),
        legendFontColor: "#fff",
        legendFontSize: 12,
    }));

    const barData = {
        labels: ["Gastos", "Receitas"],
        datasets: [{ data: [totalExpenses, totalIncome] }],
    };

    return (
        <ScrollView style={styles.container}>
            {/* Topo com os 3 totais */}
            <View style={styles.topBoxes}>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Recebido</Text>
                    <Text style={styles.boxValue}>R$ {totalIncome}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Saída</Text>
                    <Text style={styles.boxValue}>R$ {totalExpenses}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Restante</Text>
                    <Text style={styles.boxValue}>R$ {totalRemaining}</Text>
                </View>
            </View>

            {/* Gráfico de pizza */}
            <View style={styles.pieBox}>
                <Text style={styles.boxLabel}>Distribuição de Gastos</Text>
                <PieChart
                    data={pieData}
                    width={screenWidth - 32}
                    height={180}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    chartConfig={{
                        color: () => "#fff",
                        labelColor: () => "#fff",
                        decimalPlaces: 0,
                    }}
                    hasLegend={true}
                />
            </View>

            {/* Maior gasto abaixo do gráfico de pizza */}
            <View style={styles.maxExpenseBox}>
                <Ionicons name="alert-circle-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                <View>
                    <Text style={styles.maxExpenseValue}>{maxExpense.name}</Text>
                    <Text style={styles.maxExpenseAmount}>R$ {maxExpense.value}</Text>
                </View>
            </View>

            {/* Comparativo Ganhos x Gastos */}
            <View style={styles.barChartSection}>
                <Text style={styles.boxLabel}>Comparativo Ganhos x Gastos</Text>
                <BarChart
                    data={barData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                        backgroundGradientFrom: colors.bg_secondary,
                        backgroundGradientTo: colors.bg_secondary,
                        color: (opacity = 1) => `rgba(0, 255, 170, ${opacity})`,
                        labelColor: () => "#fff",
                        decimalPlaces: 0,
                    }}
                    style={{ borderRadius: 10, marginTop: 16 }}
                    fromZero
                    showValuesOnTopOfBars
                    yAxisLabel=""
                    yAxisSuffix=""
                />
            </View>
        </ScrollView>
    );
}

export default Home;

