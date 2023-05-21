import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import ClaimTableHeader from "./ClaimTableHeader";
import ClaimTableRow from "./ClaimTableRow";
import ClaimTableBlankSpace from "./ClaimTableBlankSpace";
import ClaimTableFooter from "./ClaimTableFooter";

const tableRowsCount = 1;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 18,
    borderWidth: 1,
    borderColor: "#028910",
  },
});

const ClaimExpensesTable = ({ expenses }) => {
  return (
    <>
      <View style={styles.tableContainer}>
        <ClaimTableHeader />
        <ClaimTableRow items={expenses} />
        <ClaimTableBlankSpace rowsCount={tableRowsCount} />
        <ClaimTableFooter items={expenses} />
      </View>
      ;
    </>
  );
};

export default ClaimExpensesTable;
