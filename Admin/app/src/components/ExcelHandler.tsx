import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";

const ExcelHandler = () => {
  const [data, setData] = useState<unknown[]>([]);


  // **Import Excel File**
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData); // Store data in state
      console.log("Imported Data:", jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // **Export Excel File**
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(dataBlob, "exported_data.xlsx");
  };

  return (
    <div>
      {/* Import Button */}
      <input type="file" accept=".xlsx, .xls" onChange={handleImport} />

      {/* Export Button */}
      <Button variant="contained" color="primary" onClick={handleExport} style={{ marginLeft: "10px" }}>
        Export to Excel
      </Button>
    </div>
  );
};

export default ExcelHandler;
