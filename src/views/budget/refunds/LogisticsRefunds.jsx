/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { batchRequests, collection } from "../../../controllers";
import { columns } from "../../../controllers/columns";
import Alert from "../../../services/utils/alert";

import DataTables from "../../../template/components/tables/DataTables";
import RefundResponse from "../../modals/RefundResponse";

const LogisticsRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);

  const { auth } = useStateContext();

  const manageRefund = (refund) => {
    if (refund?.status === "approved") {
      Alert.warning("Forbidden!!", "This request has been treated already!!!");
    } else {
      setData(refund);
      setShow(true);
    }
  };

  const handleSubmit = (response) => {
    setRefunds(
      refunds.map((mod) => {
        if (mod.id == response?.data?.id) {
          return response?.data;
        }

        return mod;
      })
    );

    Alert.success(response?.status, response?.message);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setShow(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      const refundsData = collection("refunds");
      const subBudgetHeadsData = collection("subBudgetHeads");

      batchRequests([refundsData, subBudgetHeadsData])
        .then(
          axios.spread((...res) => {
            const refs = res[0].data.data;
            const subs = res[1].data.data;

            setRefunds(
              refs.filter(
                (refund) => refund?.department_id == auth?.department_id
              )
            );

            setSubBudgetHeads(
              subs.filter((sub) => sub?.department_id == auth?.department_id)
            );
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <RefundResponse
        title="Refund Request Response"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        dependencies={{ subBudgetHeads, auth }}
        data={data}
      />
      <div className="custom__card">
        <DataTables
          pillars={columns.refunds}
          rows={refunds}
          manageRow={manageRefund}
          canManage
        />
      </div>
    </>
  );
};

export default LogisticsRefunds;
