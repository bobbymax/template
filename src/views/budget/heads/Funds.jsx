/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { batchRequests, collection } from "../../../controllers";
import { columns } from "../../../controllers/columns";
import Alert from "../../../services/utils/alert";
import DataTables from "../../../template/components/tables/DataTables";
import AddFund from "../../modals/AddFund";

const Funds = () => {
  const [funds, setFunds] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageFunds = (fund) => {
    setData(fund);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setFunds(
        funds.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setFunds([response?.data, ...funds]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      const fundsData = collection("funds");
      const subBudgetHeadsData = collection("subBudgetHeads");

      batchRequests([subBudgetHeadsData, fundsData])
        .then(
          axios.spread((...res) => {
            setSubBudgetHeads(res[0].data.data);
            setFunds(res[1].data.data);
          })
        )
        .catch();
    } catch (error) {
      console.log(error);
    }
  }, []);

  //   console.log(funds);
  return (
    <>
      <AddFund
        title="Credit Sub-Budget Head"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ subBudgetHeads }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Credit Sub-Budget Head
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.funds}
          rows={funds}
          manageRow={manageFunds}
          canManage
        />
      </div>
    </>
  );
};

export default Funds;
