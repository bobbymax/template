import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#028910";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    fontStyle: "bold",
    color: "white",
  },
  period: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    padding: 2,
  },
  description: {
    width: "50%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    padding: 2,
  },
  amount: {
    width: "20%",
    padding: 2,
  },
});

const ClaimTableBlankSpace = ({ rowsCount }) => {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={styles.row} key={`BR${i}`}>
      <Text style={styles.period}>-</Text>
      <Text style={styles.description}>-</Text>
      <Text style={styles.amount}>-</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default ClaimTableBlankSpace;
