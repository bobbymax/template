import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { currency } from "../../../services/helpers";
import MontserratRegular from "../../../template/assets/fonts/Montserrat/static/Montserrat-Regular.ttf";
import MontserratBold from "../../../template/assets/fonts/Montserrat/static/Montserrat-Bold.ttf";

const borderColor = "#028910";
Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: MontserratRegular,
    },
    {
      src: MontserratBold,
      fontWeight: 700,
    },
  ],
});
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    fontSize: 10,
    fontStyle: "bold",
  },
  description: {
    width: "80%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    padding: 5,
  },
  total: {
    width: "20%",
    textAlign: "right",
    padding: 5,
  },
});

const ClaimTableFooter = ({ items }) => {
  const total = items
    .map((item) => Number.parseFloat(item?.amount))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={styles.row}>
      <Text style={styles.description}>TOTAL</Text>
      <Text style={styles.total}>{currency(total)}</Text>
    </View>
  );
};

export default ClaimTableFooter;
