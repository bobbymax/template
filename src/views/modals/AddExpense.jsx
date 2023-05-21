/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { currency, verifyNumOfDays } from "../../services/helpers";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddExpense = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    remuneration_id: 0,
    from: "",
    to: "",
    remuneration_child_id: 0,
    numOfDays: 0,
    description: "",
    amount: 0,
    baseAmount: 0,
    daysRequired: false,
    blockAmountInput: false,
  };

  const [state, setState] = useState(initialState);
  const [remuneration, setRemuneration] = useState(null);
  const [child, setChild] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      remuneration_id: state.remuneration_id,
      remuneration_child_id: state.remuneration_child_id,
      remuneration_name: remuneration?.name,
      from: state.from,
      to: state.to,
      numOfDays: state.numOfDays,
      amount: state.amount,
      description: state.description,
      baseAmount: state.baseAmount,
      daysRequired: state.daysRequired,
      blockAmountInput: state.blockAmountInput,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        handleSubmit({
          status: "Updated!!",
          id: state.id,
          data: requests,
          message: "Expense has been updated successfully!!",
          action: "alter",
        });
        setState(initialState);
        setLoading(false);
      } else {
        handleSubmit({
          status: "Created!!",
          id: Date.now(),
          data: requests,
          message: "Expense created successfully!!",
          action: "store",
        });
        setState(initialState);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setState(initialState);
    setChild(null);
    setRemuneration(null);
    setSettlement(null);
    setChildren([]);
    setLoading(false);
    handleClose();
  };

  const staging = (remId) => {
    let rem, sibs, settlement;
    rem = dependencies?.remunerations?.filter((remu) => remu?.id == remId)[0];

    if (!rem) {
      return null;
    }

    sibs = rem?.children ?? [];

    if (sibs?.length < 1) {
      settlement =
        dependencies?.settlements?.filter(
          (sett) => sett?.remuneration_id == rem?.id
        )[0] ?? null;
    }

    return { rem, sibs, settlement };
  };

  useEffect(() => {
    if (remuneration?.no_of_days && state.from !== "" && state.to !== "") {
      const daysDiff = verifyNumOfDays(
        state.from,
        state.to,
        parseInt(remuneration?.days_off)
      );

      setState({
        ...state,
        numOfDays: daysDiff,
        amount: daysDiff * state.baseAmount,
      });
    }
  }, [remuneration, state.from, state.to]);

  useEffect(() => {
    if (state.remuneration_id > 0) {
      const benefit = staging(state.remuneration_id);
      setRemuneration(benefit?.rem);
      setSettlement(benefit?.settlement);
      setChildren(benefit?.sibs);
      setState({
        ...state,
        daysRequired: benefit?.rem?.no_of_days,
        baseAmount:
          benefit?.settlement !== null
            ? parseFloat(benefit?.settlement?.amount)
            : 0,
        amount:
          !benefit?.rem?.no_of_days && benefit?.settlement !== null
            ? parseFloat(benefit?.settlement?.amount)
            : 0,
        blockAmountInput: benefit?.settlement !== null,
      });
    }
  }, [state.remuneration_id]);

  useEffect(() => {
    if (state.remuneration_child_id > 0) {
      const child = staging(state.remuneration_child_id);
      setChild(child?.rem);
      setSettlement(child?.settlement);
      setState({
        ...state,
        baseAmount: parseFloat(child?.settlement?.amount) ?? 0,
        amount: !child?.rem?.no_of_days
          ? parseFloat(child?.settlement?.amount)
          : 0,
        blockAmountInput: child?.settlement !== null,
      });
    }
  }, [state.remuneration_child_id]);

  useEffect(() => {
    if (
      remuneration !== null &&
      remuneration?.label === "per-diem" &&
      state.numOfDays > 0 &&
      settlement !== null
    ) {
      setState({
        ...state,
        description: `PER DIEM FOR ${state.numOfDays} NIGHTS AT ${currency(
          state.baseAmount
        )} PER NIGHT`,
      });
    }
  }, [remuneration, state.numOfDays, settlement]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        remuneration_id: data?.remuneration_id,
        from: data?.from,
        to: data?.to,
        remuneration_child_id: data?.remuneration_child_id,
        description: data?.description,
        amount: parseFloat(data?.amount),
        daysRequired: data?.daysRequired,
        baseAmount: data?.baseAmount,
        numOfDays: data?.numOfDays,
      });
    }
  }, [data]);

  console.log(child);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Type"
                value={state.remuneration_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    remuneration_id: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions value={0} label="Select Type" disabled />

                {dependencies?.remunerations
                  ?.filter((rem) => rem?.parentId == 0)
                  ?.map((rem, i) => (
                    <CustomSelectOptions
                      key={i}
                      value={rem.id}
                      label={rem.name}
                    />
                  ))}
              </CustomSelect>
            </div>
            {state.daysRequired && children?.length > 0 && (
              <div className="col-md-12">
                <CustomSelect
                  label="Category"
                  value={state.remuneration_child_id}
                  onChange={(e) =>
                    setState({
                      ...state,
                      remuneration_child_id: parseInt(e.target.value),
                    })
                  }
                >
                  <CustomSelectOptions
                    value={0}
                    label="Select Category"
                    disabled
                  />

                  {children?.map((child, i) => (
                    <CustomSelectOptions
                      key={i}
                      value={child.id}
                      label={child.name}
                    />
                  ))}
                </CustomSelect>
              </div>
            )}

            <div className="col-md-6">
              <TextInput
                label="From"
                type="date"
                value={state.from}
                onChange={(e) => setState({ ...state, from: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="To"
                type="date"
                value={state.to}
                onChange={(e) => setState({ ...state, to: e.target.value })}
              />
            </div>
            {state.daysRequired && (
              <div className="col-md-12">
                <TextInput
                  label="Number of Days"
                  value={state.numOfDays}
                  onChange={(e) =>
                    setState({ ...state, numOfDays: e.target.value })
                  }
                  disabled
                />
              </div>
            )}
            <div className="col-md-12">
              <TextInput
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                placeholder="Enter Description"
                multiline={3}
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Amount"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
                placeholder="Enter Description"
                disabled={state.blockAmountInput}
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Expense`}
                isLoading={loading}
                icon="add_circle"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddExpense;
