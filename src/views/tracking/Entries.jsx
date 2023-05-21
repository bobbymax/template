/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { alter, batchRequests, collection, fetch } from "../../controllers";
import { currency } from "../../services/helpers";
import Alert from "../../services/utils/alert";

import TrackingDocument from "../modals/TrackingDocument";

const Entries = () => {
  const { state } = useLocation();
  const { auth } = useStateContext();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [track, setTrack] = useState(null);
  const [batch, setBatch] = useState(null);
  const [expenditures, setExpenditures] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [nextStage, setNextStage] = useState(null);
  const [stage, setStage] = useState(null);
  const [entry, setEntry] = useState(null);

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = (response) => {
    setTrack(response?.data);
    Alert.success(response?.status, response?.message);
    setShow(false);
  };

  const receiveDocument = () => {
    const requests = {
      user_id: auth?.id,
      department_id: auth?.department_id,
      entry_id: entry?.id,
      stage_id: track.state === "inflow" ? nextStage.id : stage.id,
      type: track.state === "inflow" ? "outflow" : "inflow",
    };

    try {
      alter("tracks", track?.id, requests)
        .then((res) => {
          const response = res.data;
          setTrack(track);
          Alert.success("Received", response.message);
          navigate("/tracking/disbursements");
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state !== null && state?.track) {
      const { track } = state;

      try {
        fetch("batches", track?.parent)
          .then((res) => {
            const response = res.data.data;
            setBatch(response);
            setExpenditures(response?.expenditures);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
      setEntry(track?.entries[track?.entries?.length - 1]);
      setTrack(track);
    }
  }, [state]);

  useEffect(() => {
    if (track !== null) {
      try {
        fetch("stages", track?.stage_id)
          .then((res) => {
            setStage(res.data.data);
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [track]);

  useEffect(() => {
    if (stage !== null) {
      const order = parseInt(stage?.order) + 1;
      try {
        const stagesData = collection("stages");
        const departmentsData = collection("departments");
        batchRequests([stagesData, departmentsData])
          .then(
            axios.spread((...res) => {
              const stages = res[0].data.data;
              const departments = res[1].data.data;
              const next = stages?.filter(
                (stg) =>
                  stg?.process_id == stage?.process_id && stg?.order == order
              );
              const nxt = next?.length > 0 ? next[0] : null;
              setNextStage(nxt);
              setDepartments(departments);
            })
          )
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [stage]);

  // console.log(nextStage);

  return (
    <>
      <TrackingDocument
        title="Send out Payment"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        dependencies={{ departments, nextStage, track, auth, entry }}
      />
      <div className="row">
        <div className="tracking__details">
          <div className="col-md-12 mb-5">
            <div className="row">
              <div className="col-md-4">
                <div className="tracking__content">
                  <small>Tracking Number</small>
                  <h2>{batch?.track?.code}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tracking__content">
                  <small>Payment Type</small>
                  <h2>
                    {batch?.payment_type === "staff-payment"
                      ? "Staff"
                      : "Third Party"}
                  </h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tracking__content">
                  <small>raised</small>
                  <h2>{batch?.created_at}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-5">
            <div className="row">
              <div className="col-md-3">
                <div className="tracking__content">
                  <small>Batch No.</small>
                  <h2>{batch?.code}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="tracking__content">
                  <small>Budget Code</small>
                  <h2>{batch?.sub_budget_head_code}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="tracking__content">
                  <small>Amount</small>
                  <h2>{currency(batch?.amount, true)}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="tracking__content">
                  <small>originator</small>
                  <h2>{batch?.department_code}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-5">
            <table>
              <thead>
                <tr>
                  <th>Beneficiary</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {expenditures?.map((exp, i) => (
                  <tr key={i}>
                    <td>{exp?.beneficiary}</td>
                    <td>{currency(exp?.amount, true)}</td>
                    <td>{exp?.description}</td>
                    <td>{exp?.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-12">
            {track?.state === "inflow" ? (
              <button
                type="button"
                className="tracking__button"
                disabled={stage === null || departments?.length < 1}
                onClick={() => setShow(true)}
              >
                Send Out
              </button>
            ) : (
              <button
                type="button"
                className="tracking__button"
                disabled={stage === null || departments?.length < 1}
                onClick={() => receiveDocument()}
              >
                Receive
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Entries;
