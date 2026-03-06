import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_secondary,
    padding: 16,
    paddingTop: 35,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    marginBottom: 80,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.bg_primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  listText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },

  fabButton: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 150,
    right: 30,
    zIndex: 10,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.bg_secondary,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.bg_primary,
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default styles;
