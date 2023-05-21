import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { currency } from "../../../services/helpers";

const borderColor = "#028910";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    fontStyle: "bold",
    textTransform: "uppercase",
  },
  sn: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "center",
  },
  beneficiary: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  amount: {
    width: "17%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  head: {
    width: "13%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "center",
  },
  purpose: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  pv: {
    width: "10%",
    fontSize: 9,
    padding: 5,
  },
});

const ExpenditureTableRow = ({ items }) => {
  const rows = items.map((item, i) => (
    <View style={styles.row} key={i}>
      <Text style={styles.sn}>{item?.staffId ?? "NULL"}</Text>
      <Text style={styles.beneficiary}>{item?.beneficiary}</Text>
      <Text style={styles.amount}>{currency(item?.amount)}</Text>
      <Text style={styles.head}>{item?.sub_budget_head_code}</Text>
      <Text style={styles.purpose}>{item?.description}</Text>
      <Text style={styles.pv}></Text>
    </View>
  ));

  return <Fragment>{rows}</Fragment>;
};

export default ExpenditureTableRow;
