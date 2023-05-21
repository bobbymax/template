/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter } from "../../controllers";
import { currency } from "../../services/helpers";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const QueryExpenditure = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    remark: "",
    beneficiary: "",
    amount: 0,
    purpose: "",
    stage: "",
    status: "queried",
  };

  const [queryState, setQueryState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      remark: queryState.remark,
      status: queryState.status,
      approval_statue: queryState.status,
      stage: queryState.stage,
    };

    try {
      alter("query/expenditures", queryState.id, requests)
        .then((res) => {
          const response = res.data;

          handleSubmit({
            status: "Updated!!",
            data: response.data,
            message: response.message,
            action: "alter",
          });
          setQueryState(initialState);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setQueryState(initialState);
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setQueryState({
        ...queryState,
        id: data?.id,
        beneficiary: data?.beneficiary,
        amount: parseFloat(data?.amount),
        purpose: data?.description,
        stage: data?.stage,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="col-md-12">
            <TextInput
              label="Beneficiary"
              value={queryState.beneficiary}
              onChange={(e) =>
                setQueryState({
                  ...queryState,
                  beneficiary: e.target.value,
                })
              }
              disabled
            />
            <TextInput
              label="Purpose"
              value={queryState.purpose}
              onChange={(e) =>
                setQueryState({
                  ...queryState,
                  purpose: e.target.value,
                })
              }
              multiline={3}
              disabled
            />
            <TextInput
              label="Amount"
              value={currency(queryState.amount)}
              onChange={(e) =>
                setQueryState({
                  ...queryState,
                  amount: e.target.value,
                })
              }
              disabled
            />
            <TextInput
              label="Message"
              value={queryState.remark}
              onChange={(e) =>
                setQueryState({
                  ...queryState,
                  remark: e.target.value,
                })
              }
              multiline={3}
            />
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text="Query Payment"
              isLoading={loading}
              icon="send"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default QueryExpenditure;
