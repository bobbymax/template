/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import {
  batchRequests,
  collection,
  destroy,
  fetch,
} from "../../../controllers";
import axios from "axios";
import moment from "moment";
import { columns } from "../../../controllers/columns";
import { currency, formatSelectOptions } from "../../../services/helpers";
import Alert from "../../../services/utils/alert";
import { Button, TextInput } from "../../../template/components/forms/Inputs";

import DataTables from "../../../template/components/tables/DataTables";
import AddRefundRequest from "../../modals/AddRefundRequest";

const RequestRefund = () => {
  const [batchNo, setBatchNo] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [exp, setExp] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const { auth } = useStateContext();

  const manageRefund = (refund) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("refunds", refund?.id)
            .then((res) => {
              const deleted = res.data.data;
              setRefunds(refunds.filter((rf) => rf.id != deleted.id));
              setIsLoading(false);
              Alert.success("Deleted!!", res.data.message);
            })
            .catch((err) => {
              setIsLoading(false);
              Alert.error("Oops!!", err.response.data.message);
              console.log(err.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const fetchBatch = () => {
    if (batchNo?.length > 6) {
      try {
        setIsLoading(true);
        fetch("collect/batches", batchNo)
          .then((res) => {
            const response = res.data;
            const batch = response.data;
            const expenditures = batch?.expenditures?.filter(
              (exp) => exp?.status !== "refunded"
            );

            setExpenditures(expenditures);

            setIsLoading(false);
            setBatchNo("");
          })
          .catch((err) => {
            setIsLoading(false);
            setBatchNo("");
            //   Alert.error("Oops!!", err.response.data.message);
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const makeRefundRequest = (exp) => {
    setShow(true);
    setExp(exp);
    setIsUpdating(false);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setRefunds(
        refunds.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setRefunds([response?.data, ...refunds]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setExpenditures([]);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      const departmentsData = collection("departments");
      const refundsData = collection("refunds");

      batchRequests([departmentsData, refundsData])
        .then(
          axios.spread((...res) => {
            const depts = res[0].data.data;
            const departments = depts.filter((dept) => dept?.fund !== null);
            setRefunds(res[1].data.data);
            setDepartments(formatSelectOptions(departments, "id", "code"));
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //   console.log(refunds);

  return (
    <>
      <AddRefundRequest
        title="Make Refund Request"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ auth, departments, exp }}
        data={data}
      />
      <div className="row">
        <div className="col-md-10">
          <TextInput
            placeholder="ENTER BATCH NUMBER HERE"
            value={batchNo}
            onChange={(e) => setBatchNo(e.target.value)}
            size="lg"
          />
        </div>
        <div className="col-md-2">
          <Button
            text="Fetch Batch"
            isLoading={isLoading}
            icon="add_circle"
            disabled={isLoading || batchNo === ""}
            handleClick={fetchBatch}
          />
        </div>
      </div>
      <div className="row mt-3">
        {expenditures?.length > 0 ? (
          expenditures?.map((exp, i) => (
            <div className="col-md-4" key={i}>
              <div className="exps__card">
                <small>{exp?.beneficiary}</small>
                <h3>{exp?.description}</h3>
                <h2 className="mt-2 mb-3">{currency(exp?.amount)}</h2>
                <small>
                  Balance:{" "}
                  {currency(parseFloat(exp?.amount) - parseFloat(exp?.paid))}
                </small>
                <p className="mt-2">
                  Created on {moment(exp?.created_at).format("LL")} and was
                  batched on {moment(exp?.updated_at).format("LL")}
                </p>
                <button
                  type="button"
                  className="exp___bttn mt-4"
                  onClick={() => makeRefundRequest(exp)}
                  disabled={exp?.refunds}
                >
                  {`${
                    exp?.refunds ? "Request Completed" : "Make Refund Request"
                  }`}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="custom__card">
            <DataTables
              pillars={columns.refunds}
              rows={refunds}
              destroy={manageRefund}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default RequestRefund;
