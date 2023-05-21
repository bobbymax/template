import React from "react";
import moment from "moment";
import { currency } from "../../services/helpers";

const ExpenseCard = ({
  expenditure,
  addToBatch = undefined,
  removeFromBatch = undefined,
  disabled = false,
  batched = false,
}) => {
  const { sub_budget_head_code, description, amount, beneficiary, created_at } =
    expenditure;

  return (
    <div className="expenses__card">
      <div className="expense__card-header">
        <p className="exp-sub__custom">{sub_budget_head_code}</p>
        <h3 className="exp-title__custom">{description}</h3>
        <p className="exp-text__custom">{currency(amount)}</p>
        <div className="row">
          <div className="col-md-9">
            <div className="beneficiary__text">
              <p>Beneficiary:</p>
              <p>{beneficiary}</p>
              <p>{moment(created_at).format("LL")}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="btn-container">
              {batched ? (
                <button
                  type="button"
                  className="custom__remove-btn-exp"
                  onClick={() => removeFromBatch(expenditure)}
                  disabled={disabled}
                >
                  <span className="material-icons-sharp">close</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="custom__btn-exp"
                  onClick={() => addToBatch(expenditure)}
                  disabled={disabled}
                >
                  <span className="material-icons-sharp">add</span>
                  <span className="material-icons-sharp">
                    arrow_forward_ios
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
