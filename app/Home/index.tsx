import React, { useCallback, useState } from "react";
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

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };


    const totalExpenses = debts.reduce((acc, d) => acc + d.value, 0);
    const totalIncome = incomes.reduce((acc, i) => acc + i.value, 0);
    const totalRemaining = totalIncome - totalExpenses;

    const maxExpense = debts.reduce(
        (prev, current) => (current.value > prev.value ? current : prev),
        { id: 0, value: 0, name: "", paid: false }
    );

    const pieData = [
        {
            name: "Gastos",
            value: totalExpenses,
            color: colors.primary,
            legendFontColor: "#fff",
            legendFontSize: 12,
        },
        {
            name: "Receitas",
            value: totalIncome,
            color: colors.bg_secondary,
            legendFontColor: "#fff",
            legendFontSize: 12,
        },
    ];

    const barData = {
        labels: debts.map(d => d.name),
        datasets: [{ data: debts.map(d => d.value) }],
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 50 }} // evita navbar cobrir último gráfico
        >
            {/* Topo com os 3 totais */}
            <View style={styles.topBoxes}>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Recebido</Text>
                    <Text style={styles.boxValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >{formatCurrency(totalIncome)}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Saída</Text>
                    <Text style={styles.boxValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >{formatCurrency(totalExpenses)}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Restante</Text>
                    <Text style={styles.boxValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >{formatCurrency(totalRemaining)}</Text>
                </View>
            </View>

            {/* Gráfico de Barras - Gastos detalhados */}
            <View style={styles.barChartSection}>
                <Text style={styles.boxLabel}>Distribuição dos Gastos</Text>
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

            {/* Maior gasto */}
            <Text style={styles.boxLabel}>Maior Gasto</Text>
            <View style={styles.maxExpenseBox}>
                <Ionicons name="alert-circle-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                <View>
                    <Text style={styles.maxExpenseValue}>{maxExpense.name}</Text>
                    <Text style={styles.maxExpenseAmount}>{formatCurrency(maxExpense.value)}</Text>
                </View>
            </View>

            {/* Gráfico de Pizza - Comparativo Gastos x Receitas */}
            <View style={styles.pieBox}>
                <Text style={styles.boxLabel}>Comparativo Ganhos x Gastos</Text>
                <PieChart
                    data={pieData}
                    width={screenWidth - 32}
                    height={220}
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
        </ScrollView>
    );
}

export default Home;

