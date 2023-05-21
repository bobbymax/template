import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";
import { currency } from "../../../services/helpers";

const borderColor = "#028910";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    fontStyle: "bold",
  },
  period: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    padding: 5,
    fontSize: 10,
  },
  description: {
    width: "50%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    padding: 5,
    fontSize: 10,
  },
  amount: {
    width: "20%",
    textAlign: "right",
    padding: 5,
    fontSize: 10,
  },
});

const ClaimTableRow = ({ items }) => {
  const rows = items.map((item, i) => (
    <View style={styles.row} key={i}>
      <Text style={styles.period}>{`${moment(item.from).format(
        "ll"
      )} - ${moment(item.to).format("ll")}`}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.amount}>{currency(item?.amount, true)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default ClaimTableRow;
