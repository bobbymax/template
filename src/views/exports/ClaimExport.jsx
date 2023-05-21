import React, { useEffect, useState } from "react";

import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../template/assets/images/exports/claim_logo.png";
import mainLogo from "../../template/assets/images/ncdmb-logo.png";
import ClaimExpensesTable from "./claims/ClaimExpensesTable";
import { useLocation } from "react-router-dom";
import { amountToWords } from "../../services/helpers";
import MontserratBold from "../../template/assets/fonts/Montserrat/static/Montserrat-Bold.ttf";
import MontserratLight from "../../template/assets/fonts/Montserrat/static/Montserrat-Light.ttf";
import MontserratRegular from "../../template/assets/fonts/Montserrat/static/Montserrat-Regular.ttf";
import MontserratMedium from "../../template/assets/fonts/Montserrat/static/Montserrat-Medium.ttf";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: MontserratRegular,
    },
    {
      src: MontserratLight,
      fontWeight: 300,
    },
    {
      src: MontserratMedium,
      fontWeight: 500,
    },
    {
      src: MontserratBold,
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: 680,
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  wrapper: {
    // fontFamily: "Montserrat",
  },
  section: {
    margin: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2px solid #028910",
    height: 120,
  },
  topLogo: {
    width: "68%",
  },
  claimId: {
    fontSize: 12,
    marginTop: 40,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat",
    fontWeight: 500,
  },
  titleBlock: {
    padding: "5px 10px",
    margin: "0 10px",
    fontFamily: "Montserrat",
  },
  subTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 5,
    color: "#028910",
  },
  claimHeader: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  toWords: {
    padding: "5px 10px",
    margin: 10,
  },
  toWordsText: {
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "bold",
    borderBottom: "1px solid #028910",
    paddingBottom: 5,
    marginBottom: 50,
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  signatories: {
    padding: "5px 10px",
    flexDirection: "row",
    justifyContent: "space-between",
    textTransform: "uppercase",
    fontSize: 11,
    marginBottom: 15,
    fontFamily: "Montserrat",
  },
  signs: {
    textAlign: "center",
    margin: "0 auto",
    width: "30%",
    fontWeight: 500,
  },
  textAbove: {
    padding: 7,
    fontWeight: 700,
  },
  emptyset: {
    padding: 13,
  },
  textBelow: {
    padding: 7,
    borderTop: "1px solid #1d1d1d",
  },
  bgImage: {
    position: "absolute",
    minWidth: "100%",
    display: "block",
    width: "100%",
    opacity: 0.09,
    top: 90,
  },
  footer: {
    position: "absolute",
    bottom: 55,
    left: 0,
    right: 0,
  },
});

const ClaimExport = () => {
  const { state } = useLocation();

  const [claim, setClaim] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if (state !== null && state?.claim !== null) {
      const { claim } = state;

      setClaim(claim);
      setExpenses(claim?.expenses ?? []);
      setOwner(claim?.owner);
    }
  }, [state]);

  return (
    <>
      <div className="content">
        <PDFViewer style={styles.viewer}>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Image src={logo} style={styles.topLogo} />
                <Text style={styles.claimId}>
                  Claim ID: {claim?.reference_no}
                </Text>
              </View>
              <View style={styles.titleBlock}>
                <Text style={styles.subTitle}>Purpose of Expenditure:</Text>
                <Text style={styles.claimHeader}>{claim?.title}</Text>
              </View>
              <ClaimExpensesTable expenses={expenses} />
              <View style={styles.toWords}>
                <Text style={styles.toWordsText}>
                  {amountToWords(claim?.spent_amount ?? 0)}
                </Text>
              </View>
              <Image src={mainLogo} style={styles.bgImage} />
              <View style={styles.footer} fixed>
                <View style={styles.signatories}>
                  <View style={styles.signs}>
                    <Text style={styles.emptyset}></Text>
                    <Text style={styles.textBelow}>Signature of Claimant</Text>
                  </View>
                  <View style={styles.signs}>
                    <Text style={styles.textAbove}>{owner?.gradeLevel}</Text>
                    <Text style={styles.textBelow}>Grade Level</Text>
                  </View>
                  <View style={styles.signs}>
                    <Text style={styles.emptyset}></Text>
                    <Text style={styles.textBelow}>Approved</Text>
                  </View>
                </View>
                <View style={styles.signatories}>
                  <View style={styles.signs}>
                    <Text style={styles.textAbove}>{owner?.name}</Text>
                    <Text style={styles.textBelow}>Name in Blocks</Text>
                  </View>
                  <View style={styles.signs}>
                    <Text style={styles.textAbove}>{owner?.staff_no}</Text>
                    <Text style={styles.textBelow}>Staff Number</Text>
                  </View>
                  <View style={styles.signs}>
                    <Text style={styles.emptyset}></Text>
                    <Text style={styles.textBelow}>Name in Blocks</Text>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </>
  );
};

export default ClaimExport;
