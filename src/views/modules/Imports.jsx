import React, { useState } from "react";
import * as XLSX from "xlsx";
import { bulk } from "../../controllers";
import {
  ImportTypes,
  getExtension,
  convertToJson,
} from "../../services/helpers";
import Alert from "../../services/utils/alert";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import DataTables from "../../template/components/tables/DataTables";

const Imports = () => {
  const [cols, setCols] = useState([]);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState("");

  const importData = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      type: dataType,
      data,
    };

    try {
      bulk("imports", body)
        .then((res) => {
          const result = res.data;
          console.log(result.data);
          setIsLoading(false);
          Alert.success("Imported", result.message);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err.message);
          Alert.error("Oops!!", "Something must have f=gone wrong");
        });
    } catch (error) {
      console.log(error);
    }

    setCols([]);
    setDataType("");
    setData([]);
  };

  const importExcel = (e) => {
    const file = e.target.files[0];

    setFileUpload(e.target.value);

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      // get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];

      // convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const heads = headers.map((head) => ({ Header: head, accessor: head }));
      setCols(heads);

      fileData.splice(0, 1);
      setData(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExtension(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert("Invalid file input, Select Excel or CSV file");
      }
    } else {
      setData([]);
      setCols([]);
    }
  };

  //   console.log(cols, data, cols?.length > 0, data?.length > 0);

  return (
    <>
      <div className="custom__card mb-4">
        <form onSubmit={importData}>
          <div className="row">
            <div className="col-md-8">
              <TextInput
                type="file"
                label="Upload File"
                value={fileUpload}
                onChange={importExcel}
              />
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Type"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                <CustomSelectOptions
                  value=""
                  label="Select Upload Type"
                  disabled
                />

                {ImportTypes.map((typ, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={typ?.label}
                    value={typ?.value}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12 mt-3">
              <Button
                type="submit"
                text="Import Data"
                isLoading={isLoading}
                icon="upload"
                disabled={dataType === "" || isLoading || data?.length < 1}
              />
            </div>
          </div>
        </form>
      </div>

      {cols?.length > 0 && data?.length > 0 && (
        <div className="custom__card">
          <DataTables pillars={cols} rows={data} />
        </div>
      )}
    </>
  );
};

export default Imports;
