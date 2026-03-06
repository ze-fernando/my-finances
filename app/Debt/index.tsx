import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/colors";
import { DebtItem } from "./interfaces";
import styles from "./styles";
import { deleteDebt, fetchDebts, insertDebt, updateDebt } from "../../utils/db";
import { FontAwesome5 } from "@expo/vector-icons";

function Debt() {
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newPaid, setNewPaid] = useState(false);

  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editReceived, setEditReceived] = useState(false);

  const loadDebts = async () => {
    const dbDebts = fetchDebts();
    const paidState = await AsyncStorage.getItem("debtsPaid");
    const paidMap: Record<string, boolean> = paidState
      ? JSON.parse(paidState)
      : {};

    const debtsWithPaid = dbDebts.map((d) => ({
      ...d,
      paid: paidMap[d.id] ?? d.paid,
    }));

    setDebts(debtsWithPaid);
    return debtsWithPaid;
  };

  useEffect(() => {
    loadDebts();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalPaid = debts
    .filter((d) => d.paid)
    .reduce((acc, d) => acc + d.value, 0);
  const totalValue = debts.reduce((acc, d) => acc + d.value, 0);
  const totalPending = totalValue - totalPaid;

  const savePaidState = async (id: number, value: boolean) => {
    const paidState = await AsyncStorage.getItem("debtsPaid");
    const paidMap: Record<string, boolean> = paidState
      ? JSON.parse(paidState)
      : {};
    paidMap[id] = value;
    await AsyncStorage.setItem("debtsPaid", JSON.stringify(paidMap));
  };

  const addDebt = async () => {
    if (!newName || !newValue) return;

    const valueNumber = parseFloat(newValue.replace(",", "."));
    if (isNaN(valueNumber)) return;

    insertDebt(newName, valueNumber, newPaid);
    await loadDebts();

    setNewName("");
    setNewValue("");
    setNewPaid(false);
    setModalVisible(false);
  };

  const editDebt = (id: number) => {
    const debt = debts.find((d) => d.id === id);
    if (debt) {
      setEditId(id);
      setEditName(debt.name);
      setEditValue(
        debt.value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
      setEditReceived(debt.paid);
      setModalVisibleEdit(true);
    }
  };

  const saveDebt = async () => {
    if (!editName || !editValue) return;
    const valueNumber = parseFloat(editValue.replace(",", "."));
    if (isNaN(valueNumber)) return;
    updateDebt(editId, editName, valueNumber, editReceived);
    await loadDebts();
    setModalVisibleEdit(false);
  };

  const togglePaid = async (id: number, value: boolean) => {
    await savePaidState(id, value);
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, paid: value } : d)),
    );
  };

  const handleDelete = (id: number) => {
    deleteDebt(id);
    loadDebts();
    setModalVisibleEdit(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBoxes}>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>Total Saída</Text>
          <Text style={styles.boxValue}>R$ {formatCurrency(totalValue)}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>Pagamento Pendente</Text>
          <Text style={styles.boxValue}>R$ {formatCurrency(totalPending)}</Text>
        </View>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.name}</Text>
            <Text style={styles.listText}>R$ {formatCurrency(item.value)}</Text>
            <Switch
              value={item.paid}
              onValueChange={(value) => togglePaid(item.id, value)}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={item.paid ? colors.primary : "#f4f3f4"}
            />

            <TouchableOpacity
              onPress={() => editDebt(item.id)}
              style={{ marginHorizontal: 12 }}
            >
              <FontAwesome5 name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { fontSize: 20 }]}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Débito</Text>
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
              keyboardType="decimal-pad"
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", marginRight: 10 }}>Pago:</Text>
              <Switch
                value={newPaid}
                onValueChange={setNewPaid}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={newPaid ? colors.primary : "#f4f3f4"}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={addDebt}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "gray", marginTop: 10 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisibleEdit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Debito</Text>
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              placeholder="Valor"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="decimal-pad" // permite ponto flutuante
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", marginRight: 10 }}>Recebido:</Text>
              <Switch
                value={editReceived}
                onValueChange={setEditReceived}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={editReceived ? colors.primary : "#f4f3f4"}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={saveDebt}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#FF5B5B", marginTop: 10 },
              ]}
              onPress={() => handleDelete(editId)}
            >
              <Text style={styles.buttonText}>Apagar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "gray", marginTop: 10 },
              ]}
              onPress={() => setModalVisibleEdit(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Debt;
