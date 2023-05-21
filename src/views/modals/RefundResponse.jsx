/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter } from "../../controllers";
import Alert from "../../services/utils/alert";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const RefundResponse = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    sub_budget_head_id: 0,
    status: "",
    remark: "",
    description: "",
    amount: 0,
    booked_balance: 0,
    new_balance: 0,
  };

  const [state, setState] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [error, setError] = useState("");

  const handleModalClose = () => {
    setState(initialState);
    setSubs([]);
    setLoading(false);
    handleClose();
    setError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      user_id: controller?.id,
      sub_budget_head_id: state.sub_budget_head_id,
      status: state.status,
      remark: state.remark,
    };

    try {
      setLoading(true);
      alter("fulfill/refunds", state.id, requests)
        .then((res) => {
          const response = res.data;
          handleSubmit({
            status: "Updated!!",
            data: response.data,
            message: response.message,
            action: "alter",
          });
          setState(initialState);
          setLoading(false);
        })
        .catch((err) => {
          Alert.error("Oops!!", err.response.data.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        description: data?.description,
        amount: parseFloat(data?.requested_amount),
      });
    }
  }, [data]);

  useEffect(() => {
    if (state.sub_budget_head_id > 0) {
      const subHead = subs.filter(
        (sub) => sub?.id == state.sub_budget_head_id
      )[0];
      const newBal = parseFloat(subHead?.booked_balance) - state.amount;

      if (newBal < 1) {
        setError("Insufficient Funds!!!");
        setState({
          ...state,
          sub_budget_head_id: 0,
        });
      } else {
        setState({
          ...state,
          booked_balance: parseFloat(subHead?.booked_balance),
          new_balance: newBal,
        });
        setError("");
      }
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.subBudgetHeads?.length > 0 &&
      dependencies?.auth !== null
    ) {
      const { subBudgetHeads, auth } = dependencies;

      setSubs(subBudgetHeads);
      setController(auth);
    }
  }, [dependencies]);

  // console.log(subs);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            {error !== "" && (
              <div className="col-md-12">
                <div className="alert alert-danger">{error}</div>
              </div>
            )}

            <div className="col-md-12">
              <TextInput
                label="Refund Amount"
                value={state.amount}
                onChange={(e) =>
                  setState({
                    ...state,
                    amount: e.target.value,
                  })
                }
                disabled
              />
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Status"
                value={state.status}
                onChange={(e) => setState({ ...state, status: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Response Action"
                  value=""
                  disabled
                />

                {[
                  { key: "approved", label: "Approve" },
                  { key: "denied", label: "Deny" },
                ].map((stat, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={stat.key}
                    label={stat.label}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <TextInput
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({
                    ...state,
                    description: e.target.value,
                  })
                }
                multiline={4}
                disabled
              />
            </div>
            {state.status === "approved" && (
              <>
                <div className="col-md-12">
                  <CustomSelect
                    label="Sub-Budget Head"
                    value={state.sub_budget_head_id}
                    onChange={(e) =>
                      setState({ ...state, sub_budget_head_id: e.target.value })
                    }
                  >
                    <CustomSelectOptions
                      label="Select Sub-Budget Head"
                      value={0}
                      disabled
                    />

                    {subs.map((sub) => (
                      <CustomSelectOptions
                        key={sub?.id}
                        value={sub?.id}
                        label={sub?.name}
                      />
                    ))}
                  </CustomSelect>
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Booked Balance"
                    value={state.booked_balance}
                    onChange={(e) =>
                      setState({
                        ...state,
                        booked_balance: parseFloat(e.target.value),
                      })
                    }
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="New Balance"
                    value={state.new_balance}
                    onChange={(e) =>
                      setState({
                        ...state,
                        new_balance: parseFloat(e.target.value),
                      })
                    }
                    disabled
                  />
                </div>
              </>
            )}

            {state.status === "denied" && (
              <div className="col-md-12">
                <TextInput
                  label="Remark"
                  value={state.remark}
                  onChange={(e) =>
                    setState({ ...state, remark: e.target.value })
                  }
                  placeholder="Enter Remark here"
                  multiline={4}
                />
              </div>
            )}

            <div className="col-md-12">
              <Button
                type="submit"
                text="Complete Request"
                isLoading={loading}
                icon="add_circle"
                disabled={
                  state.status === "" ||
                  (state.status === "denied" && state.remark === "")
                }
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default RefundResponse;
