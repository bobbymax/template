/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { collection, destroy, fetch } from "../../../controllers";
import { columns } from "../../../controllers/columns";
import { currency } from "../../../services/helpers";
import Alert from "../../../services/utils/alert";
import { Button, TextInput } from "../../../template/components/forms/Inputs";

import DataTables from "../../../template/components/tables/DataTables";
import MakeReversalRequest from "../../modals/MakeReversalRequest";

const ReversePayments = () => {
  const [batchNo, setBatchNo] = useState("");
  const [demands, setDemands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [batch, setBatch] = useState(null);
  const [exps, setExps] = useState([]);
  const [canReverse, setCanReverse] = useState(false);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState(null);

  const { auth } = useStateContext();

  const reversePayment = () => {
    const batchId = batch?.id;

    Alert.flash(
      "Are you sure?",
      "warning",
      "This action is not reversible!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          destroy("batches", batchId)
            .then((res) => {
              setCanReverse(false);
              setExps([]);
              setBatch(null);
              setIsLoading(false);
              Alert.success("Reversed!!", res.data.message);
            })
            .catch((err) => {
              Alert.error("Oops!!", err.response.data.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });

    // console.log(batchId);
  };

  const makeReversalRequest = (response) => {
    setDemands([response.data, ...demands]);
    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setExps([]);
    setBatch(null);
    setIsLoading(false);
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
              (exp) => exp?.status === "paid"
            );

            if (batch?.status === "paid" || expenditures?.length > 0) {
              Alert.warning(
                "Forbidden",
                "You cannot reverse a batch that has been marked as paid already!!"
              );
            } else if (batch?.demand) {
              Alert.warning(
                "Forbidden",
                "A reversal request has already been generated for this batch!!"
              );
            } else {
              setBatch(response.data);
              setExps(response.data?.expenditures);
            }

            setIsLoading(false);
            setBatchNo("");
          })
          .catch((err) => {
            setIsLoading(false);
            setBatchNo("");
            Alert.error("Oops!!", err.response.data.message);
            // console.log(err.response.data.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRequestModal = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  const destroyRequest = (dmd) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You are about to delete this Reversal Request"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          destroy("demands", dmd?.id)
            .then((res) => {
              const response = res.data;
              setDemands(demands.filter((dmd) => dmd?.id != response.data?.id));
              setCanReverse(false);
              setExps([]);
              setBatch(null);
              setIsLoading(false);
              Alert.success("Deleted!!", response.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    if (batch !== null) {
      const now = moment({});
      const created_at = moment(batch?.created_at);

      const duration = moment.duration(now.diff(created_at));
      const hours = duration.asHours();

      if (hours <= 24) {
        setCanReverse(true);
      } else {
        setCanReverse(false);
      }
    }
  }, [batch]);

  useEffect(() => {
    try {
      collection("demands")
        .then((res) => {
          const response = res.data.data;

          setDemands(
            response.filter(
              (demand) => demand.department_id == auth?.department_id
            )
          );
        })
        .catch((err) => {
          Alert.error("Oops!!", err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <MakeReversalRequest
        title="Make Reversal Request"
        show={show}
        isUpdating={isUpdating}
        handleClose={handleClose}
        handleSubmit={makeReversalRequest}
        dependencies={{ auth, batch }}
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
      {batch !== null ? (
        <>
          <div className="row mt-3">
            <div className="col-md-8">
              <div className="batch__card">
                <div className="top___section">
                  <h1>{batch?.code}</h1>
                </div>
                <div className="mid___section mt-3 mb-3">
                  <h3>Funded by {batch?.sub_budget_head_code}</h3>
                  <p>{batch?.sub_budget_head_name}</p>
                </div>
                <div className="exp__section">
                  {exps?.length > 0 &&
                    exps?.map((exp, i) => (
                      <div className="exps__card" key={i}>
                        <small>{exp?.beneficiary}</small>
                        <h3>{exp?.description}</h3>
                        <h2 className="mt-2 mb-3">{currency(exp?.amount)}</h2>
                        <small>
                          Created on {moment(exp?.created_at).format("LL")} and
                          was batched on {moment(exp?.updated_at).format("LL")}
                        </small>
                      </div>
                    ))}
                </div>
                <div className="footer___section mt-3">
                  <div className="row">
                    <div className="col-md-6">
                      <Button
                        text="Reverse Payment"
                        handleClick={reversePayment}
                        variant="danger"
                        isLoading={isLoading}
                        disabled={!canReverse}
                      />
                    </div>
                    <div className="col-md-6">
                      <Button
                        text="Make Reversal Request"
                        handleClick={handleRequestModal}
                        variant="secondary"
                        isLoading={isLoading}
                        disabled={canReverse || batch?.demand}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="batch__details">
                <small>Department</small>
                <h3>{batch?.department_name}</h3>
                <small>Directorate</small>
                <h3>{batch?.directorate}</h3>
                <small>Created On</small>
                <h3>{moment(batch?.created_at).format("LL")}</h3>
                <small>Budget Controller</small>
                <h3>{batch?.controller}</h3>
                <small>No. of Payments</small>
                <h3>{exps?.length}</h3>
                <small>Total Amount</small>
                <h3>{currency(batch?.amount)}</h3>
                <small>Status</small>
                <h3 className="status__badge">{batch?.status}</h3>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="custom__card">
            <DataTables
              pillars={columns.demands}
              rows={demands}
              manageRow={destroyRequest}
              canManage
            />
          </div>
        </>
      )}
    </>
  );
};

export default ReversePayments;
