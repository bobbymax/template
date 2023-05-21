import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#028910";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#27ae60",
    backgroundColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    textAlign: "center",
    flexGrow: 1,
    textTransform: "uppercase",
    color: "#fff",
  },
  period: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 11,
    padding: 5,
  },
  description: {
    width: "50%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 11,
    padding: 5,
  },
  amount: {
    width: "20%",
    fontSize: 11,
    padding: 5,
  },
});

const ClaimTableHeader = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.period}>Period</Text>
        <Text style={styles.description}>Description</Text>
        <Text style={styles.amount}>Amount</Text>
      </View>
    </>
  );
};

export default ClaimTableHeader;
