import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("finance.db");

db.execSync(
  `CREATE TABLE IF NOT EXISTS debts (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        value REAL NOT NULL,
        paid INTEGER NOT NULL
      );`,
);

db.execSync(
  `CREATE TABLE IF NOT EXISTS incomes (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        value REAL NOT NULL,
        received INTEGER NOT NULL
      );`,
);

export const insertDebt = (name: string, value: number, paid: boolean) => {
  db.runSync("INSERT INTO debts (name, value, paid) VALUES (?, ?, ?)", [
    name,
    value,
    paid ? 1 : 0,
  ]);
};

export const insertIncome = (
  name: string,
  value: number,
  received: boolean,
) => {
  db.runSync("INSERT INTO incomes (name, value, received) VALUES (?, ?, ?)", [
    name,
    value,
    received ? 1 : 0,
  ]);
};

export const fetchDebts = (): any[] => {
  return db.getAllSync("SELECT * FROM debts", []);
};

export const fetchIncomes = (): any[] => {
  return db.getAllSync("SELECT * FROM incomes", []);
};

export const updateDebtPaid = (id: number, paid: boolean) => {
  db.runSync("UPDATE debts SET paid = ? WHERE id = ?", [paid ? 1 : 0, id]);
};

export const updateIncomeReceived = (id: number, received: boolean) => {
  db.runSync("UPDATE incomes SET received = ? WHERE id = ?", [
    received ? 1 : 0,
    id,
  ]);
};

export const updateIncome = (
  id: number,
  name: string,
  value: number,
  received: boolean,
) => {
  db.runSync(
    "UPDATE incomes SET name = ?, value = ?, received = ? WHERE id = ?",
    [name, value, received ? 1 : 0, id],
  );
};

export const updateDebt = (
  id: number,
  name: string,
  value: number,
  paid: boolean,
) => {
  db.runSync("UPDATE debts SET name = ?, value = ?, paid = ? WHERE id = ?", [
    name,
    value,
    paid ? 1 : 0,
    id,
  ]);
};

export const deleteDebt = (id: number) => {
  db.runSync("DELETE FROM debts WHERE id = ?", [id]);
};

export const deleteIncome = (id: number) => {
  db.runSync("DELETE FROM incomes WHERE id = ?", [id]);
};
