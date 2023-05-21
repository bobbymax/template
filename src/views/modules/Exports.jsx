/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import {
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";

import DataTables from "../../template/components/tables/DataTables";
import { CSVLink } from "react-csv";
import { headers } from "../../controllers/headers";

const Exports = () => {
  const dropdown = [
    {
      value: "modules",
      label: "Modules",
      column: columns.modules,
      headers: headers.modules,
    },
    {
      value: "roles",
      label: "Roles",
      column: columns.roles,
      headers: headers.roles,
    },
    {
      value: "users",
      label: "Staff",
      column: columns.staff,
      headers: headers.users,
    },
  ];

  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  const [xslHeaders, setXslHeaders] = useState([]);

  const csvReport = {
    data,
    headers: xslHeaders,
    filename: `${url}-tabular.csv`,
  };

  useEffect(() => {
    if (url !== "") {
      try {
        collection(url)
          .then((res) => {
            setData(res.data.data);
            const selected = dropdown.filter((drp) => drp.value === url)[0];
            setHeader(selected?.column);
            setXslHeaders(selected?.headers);
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [url]);

  // console.log(header);

  return (
    <>
      <div className="row">
        <div className="col-md-5">
          <div className="custom__card mb-4">
            <div className="row">
              <div className="col-md-12">
                <CustomSelect
                  label="Exportable"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                >
                  <CustomSelectOptions
                    label="Select Exportable"
                    value=""
                    disabled
                  />

                  {dropdown?.map((drp, i) => (
                    <CustomSelectOptions
                      key={i}
                      value={drp.value}
                      label={drp.label}
                    />
                  ))}
                </CustomSelect>
              </div>
              <div className="col-md-12">
                <CSVLink
                  {...csvReport}
                  className={`export__btn ${
                    (data?.length < 1 || xslHeaders?.length < 1) &&
                    "export__btn__disbaled"
                  }`}
                >
                  Export to CSV
                </CSVLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      {data?.length > 0 && header?.length > 0 && (
        <div className="custom__card">
          <DataTables pillars={header} rows={data} />
        </div>
      )}
    </>
  );
};

export default Exports;
