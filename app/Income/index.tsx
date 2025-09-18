import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Switch, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/colors";
import { IncomeItem } from "./interfaces";
import styles from "./styles";
import { fetchIncomes, insertIncome, deleteIncome } from "../../utils/db";
import { FontAwesome5 } from "@expo/vector-icons";

function Income() {
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newReceived, setNewReceived] = useState(false);

  // AsyncStorage para o received
  const loadReceivedState = async (): Promise<Record<string, boolean>> => {
    const state = await AsyncStorage.getItem("incomesReceived");
    return state ? JSON.parse(state) : {};
  };

  const saveReceivedState = async (id: number, value: boolean) => {
    const state = await loadReceivedState();
    state[id] = value;
    await AsyncStorage.setItem("incomesReceived", JSON.stringify(state));
  };

  const loadIncomes = async () => {
    const dbIncomes = fetchIncomes();
    const receivedMap = await loadReceivedState();

    const incomesWithReceived = dbIncomes.map(i => ({
      ...i,
      received: receivedMap[i.id] ?? false
    }));

    setIncomes(incomesWithReceived);
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  const totalReceived = incomes.filter(i => i.received).reduce((acc, i) => acc + i.value, 0);
  const totalIncome = incomes.reduce((acc, i) => acc + i.value, 0);

  const toggleReceived = async (id: number, value: boolean) => {
    await saveReceivedState(id, value);
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, received: value } : i));
  };

  const addIncome = async () => {
    if (!newName || !newValue) return;

    insertIncome(newName, Number(newValue), newReceived);
    await loadIncomes();

    setNewName('');
    setNewValue('');
    setNewReceived(false);
    setModalVisible(false);
  };

  const handleDelete = async (id: number) => {
    deleteIncome(id);
    await loadIncomes();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBoxes}>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>Total Receita</Text>
          <Text style={styles.boxValue}>R$ {totalIncome}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>Total Recebido</Text>
          <Text style={styles.boxValue}>R$ {totalReceived}</Text>
        </View>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.name}</Text>
            <Text style={styles.listText}>R$ {item.value}</Text>

            <Switch
              value={item.received}
              onValueChange={(value) => toggleReceived(item.id, value)}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={item.received ? colors.primary : "#f4f3f4"}
            />

            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginHorizontal: 12 }}>
              <FontAwesome5 name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fabButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.buttonText, { fontSize: 20 }]}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Receita</Text>
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              placeholder="Valor"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={newValue}
              onChangeText={setNewValue}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: 'white', marginRight: 10 }}>Recebido:</Text>
              <Switch
                value={newReceived}
                onValueChange={setNewReceived}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={newReceived ? colors.primary : "#f4f3f4"}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={addIncome}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'gray', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Income;

