/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import logo from "../../template/assets/images/batch_logo.png";
import mainLogo from "../../template/assets/images/ncdmb-logo.png";
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import ExpenditureTable from "./batches/ExpenditureTable";
import { currency, unique } from "../../services/helpers";
import { alter, fetch } from "../../controllers";
import { useStateContext } from "../../context/ContextProvider";
import Alert from "../../services/utils/alert";

const bgColor = "#028910";
const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: 680,
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  section: {
    padding: "10px 20px",
  },
  gridView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  gridViewL: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridElements: {
    width: "50%",
    fontSize: 11,
    letterSpacing: 1,
  },
  gridElementsL: {
    width: "50%",
    fontSize: 11,
    letterSpacing: 1,
    textAlign: "right",
  },
  signings: {
    marginTop: 20,
  },
  topLogo: {
    width: "100%",
  },
  pymt: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#e74c3c",
    letterSpacing: 2,
    fontWeight: 700,
  },
  detailWrapper: {
    padding: "0 20px",
  },
  btchC: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(0,0,0,0.6)",
  },
  btchL: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(0,0,0,0.7)",
    width: "40%",
    padding: "5px 0",
  },
  btch: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(0,0,0,0.7)",
  },
  corner: {
    border: "0.55px solid #000",
    width: "60%",
    padding: "5px 8px",
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
  approval: {
    padding: "8px 12px",
    backgroundColor: bgColor,
    textTransform: "uppercase",
    color: "#fff",
    letterSpacing: 3,
    fontSize: 12,
  },
  signatories: {
    padding: "5px 10px",
    flexDirection: "row",
    justifyContent: "space-between",
    textTransform: "uppercase",
    fontSize: 11,
    marginBottom: 15,
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
  totalAmount: {
    padding: 8,
    border: "1px solid #555",
    fontSize: 14,
    textAlign: "center",
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
    padding: "10px 20px",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
});

const BatchExport = () => {
  const { state } = useLocation();
  const { auth } = useStateContext();

  const [batch, setBatch] = useState(null);
  const [expenditures, setExpenditures] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [subBudgetHead, setSubBudgetHead] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [purpose, setPurpose] = useState("");
  const [stage, setStage] = useState(null);

  const startProcess = () => {
    const requests = {
      department_id: auth?.department_id,
      stage_id: stage?.id,
      user_id: auth?.id,
      code: auth?.department_code + unique() + "TRCK",
      type: "inflow",
    };

    try {
      alter("process/batches", batch?.id, requests)
        .then((res) => {
          const response = res.data;
          setBatch(response.data);
          setExpenditures(response.data?.expenditures);

          Alert.success("Process Started!!", response.message);

          console.log(response.data);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state !== null && state?.batch !== null) {
      const { batch } = state;

      const exp = batch?.expenditures[0];

      setBatch(batch);
      setExpenditures(batch?.expenditures);
      setPaymentType(
        exp?.payment_type === "third-party" ? "Third Party" : "Staff"
      );
      setSubBudgetHead(exp?.sub_budget_head_name);
      setPurpose(exp?.description);
      setBeneficiary(exp?.beneficiary);
      setTotalAmount(parseFloat(batch?.amount)?.toFixed(2));
    }
  }, [state]);

  useEffect(() => {
    try {
      fetch("harvest/processes", "payment")
        .then((res) => {
          const response = res.data.data;
          const stages = response?.stages;

          setStage(stages?.filter((stg) => stg.order == 1)[0]);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(batch);

  return (
    <>
      <div className="content">
        <div className="row mb-4">
          <div className="col-md-5">
            <button
              type="button"
              className={`custom__btn ${
                batch?.tracks?.length > 0
                  ? "custom__btn-info"
                  : "custom__btn-primary"
              }`}
              onClick={() => startProcess()}
              disabled={batch?.track !== 0}
            >
              <span className="material-icons-sharp">account_tree</span>
              {`${batch?.track !== null ? "In Progress" : "Start Process"}`}
            </button>
          </div>
        </div>
        <PDFViewer style={styles.viewer}>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Image src={logo} style={styles.topLogo} />
              </View>
              <View style={styles.section}>
                <View style={styles.gridView}>
                  <Text
                    style={styles.pymt}
                  >{`NCDF ${paymentType} Payment Approval Form`}</Text>
                  <Text
                    style={styles.btchC}
                  >{`Batch No.: ${batch?.code}`}</Text>
                </View>
              </View>
              <View style={styles.detailWrapper}>
                <View style={styles.gridView}>
                  <Text style={styles.btchL}>Originating Department:</Text>
                  <View style={styles.corner}>
                    <Text style={styles.btch}>{batch?.department_name}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.detailWrapper}>
                <View style={styles.gridView}>
                  <Text style={styles.btchL}>Directorate:</Text>
                  <View style={styles.corner}>
                    <Text style={styles.btch}>{batch?.directorate}</Text>
                  </View>
                </View>
              </View>
              {paymentType === "Third Party" && (
                <>
                  <View style={styles.detailWrapper}>
                    <View style={styles.gridView}>
                      <Text style={styles.btchL}>Purpose:</Text>
                      <View style={styles.corner}>
                        <Text style={styles.btch}>{purpose}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.detailWrapper}>
                    <View style={styles.gridView}>
                      <Text style={styles.btchL}>Payment Type:</Text>
                      <View style={styles.corner}>
                        <Text style={styles.btch}>
                          {paymentType + " Payment"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
              <View style={styles.detailWrapper}>
                <View style={styles.gridView}>
                  <Text style={styles.btchL}>Budget Head:</Text>
                  <View style={styles.corner}>
                    <Text style={styles.btch}>{subBudgetHead}</Text>
                  </View>
                </View>
              </View>
              {paymentType === "Third Party" && (
                <>
                  <View style={styles.detailWrapper}>
                    <View style={styles.gridView}>
                      <Text style={styles.btchL}>Budget Code:</Text>
                      <View style={styles.corner}>
                        <Text style={styles.btch}>
                          {batch?.sub_budget_head_code}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.detailWrapper}>
                    <View style={styles.gridView}>
                      <Text style={styles.btchL}>Amount:</Text>
                      <View style={styles.corner}>
                        <Text style={styles.btch}>
                          {currency(totalAmount, true)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.detailWrapper}>
                    <View style={styles.gridView}>
                      <Text style={styles.btchL}>Beneficiary:</Text>
                      <View style={styles.corner}>
                        <Text style={styles.btch}>{beneficiary}</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
              {paymentType === "Staff" && (
                <View style={styles.detailWrapper}>
                  <View style={styles.gridView}>
                    <Text style={styles.btchL}>No. of Claims:</Text>
                    <View style={styles.corner}>
                      <Text style={styles.btch}>{expenditures?.length}</Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.detailWrapper}>
                <View style={styles.gridView}>
                  <Text style={styles.btchL}>Budget Period:</Text>
                  <View style={styles.corner}>
                    <Text style={styles.btch}>2022</Text>
                  </View>
                </View>
              </View>
              {/* Expenditures Breakdown */}
              {paymentType === "Staff" && (
                <>
                  <ExpenditureTable expenditures={expenditures} />
                  {/* Total Amount Section */}
                  <View style={styles.section}>
                    <Text style={styles.totalAmount}>
                      {currency(totalAmount)}
                    </Text>
                  </View>
                </>
              )}

              <Image src={mainLogo} style={styles.bgImage} />
              {/* Approvals Section */}
              <View style={styles.footer} fixed>
                <Text style={styles.approval}>Approvals</Text>
                <View style={styles.signings}>
                  <View style={styles.gridViewL}>
                    <Text style={styles.gridElements}>
                      Head of Originating Division: ...........................
                    </Text>
                    <Text style={styles.gridElementsL}>
                      Date: ...............................................
                    </Text>
                  </View>
                  <View style={styles.gridViewL}>
                    <Text style={styles.gridElements}>
                      DFPM:
                      ..........................................................
                    </Text>
                    <Text style={styles.gridElementsL}>
                      Date: ...............................................
                    </Text>
                  </View>
                  <View style={styles.gridViewL}>
                    <Text style={styles.gridElements}>
                      Executive Secretary:
                      ......................................
                    </Text>
                    <Text style={styles.gridElementsL}>
                      Date: ...............................................
                    </Text>
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

export default BatchExport;
