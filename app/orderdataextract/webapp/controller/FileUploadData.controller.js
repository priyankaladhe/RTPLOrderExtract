sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], (Controller , MessageBox , JSONModel) => {
    "use strict";

    return Controller.extend("orderdataextract.controller.FileUploadData", {
        onInit() {
            const oModel = new sap.ui.model.json.JSONModel({

                "OrderData": []

            });

            this.getView().setModel(oModel, "oModel");

        },
        mapUIFieldsToCDS: function (uiData) {
            function formatDateForDB(dateStr) {
                if (!dateStr) return null;
                var parts = dateStr.split("-");
                return `${parts[2]}-${parts[0]}-${parts[1]}`; // Convert MM-DD-YYYY to YYYY-MM-DD
            }
            return {
                Plant: uiData["Plant"],
                MCNo: uiData["MC No"],
                OrderNo: uiData["Order No."],
                OrderDate: formatDateForDB(uiData["Order Date"]),
                Material: uiData["Material"],
                MaterialDescription: uiData["Material Description"],
                OperNo: String(uiData["Oper. No."]),
                OperDescription: uiData["Oper Description"],
                DrawingNo: uiData["Drawing No."],
                RevNo: String(uiData["Rev.No."]),
                SrNo: String(uiData["Sr.No."]),
                PlanQty: String(uiData["Plan Qty."]),
                SetupTimeUnit: uiData["Setup Time Unit"],
                RoutingSetupTimeMin: String(uiData["Routing Setup Time (Min)"]),
                MachineTimeUnit: String(uiData["Machine Time Unit"]),
                MachineTimeMin: String(uiData["Machine Time(Min)"]),
                NormsQty: String(uiData["Norms Qty."]),
                OrderText: uiData["Order Text"],
                ShiftPlan: uiData["Shift Plan(I/II/III)"],
                OperatorName: uiData["Operator Name"],
                OperatorCode: uiData["Operator Code"],
                ManualSetupTimeMin: String(uiData["Manual Setup Time (Min)"]),
                UsedTimeMin: String(uiData["Used Time (Min)"]),
                ProductionQty: String(uiData["Production Qty."]),
                RejQtyMC: String(uiData["Rej. QTy - M/C"]),
                RejQtyMAT: String(uiData["Rej. Qty - MAT"]),
                DownTimeMin: uiData["Down Time (Min)"],
                DownTimeCode: uiData["Down Time Code"],
                Remarks: uiData["Remarks"]
            };
        },
        handleFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var aFiles = oFileUploader.oFileUpload.files; // Get selected files

            if (aFiles.length === 0) {
                sap.m.MessageToast.show("Please select a file.");
                return;
            }

            this.selectedFile = aFiles[0]; // Store the selected file
        },
        handleUploadPress: function () {
            if (!this.selectedFile) {
                sap.m.MessageToast.show("No file selected. Please choose a file first.");
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);

                // Parse Excel file using SheetJS
                var workbook = XLSX.read(data, { type: "array" });
                var sheetName = workbook.SheetNames[0]; // Read the first sheet
                var sheet = workbook.Sheets[sheetName];

                // Convert sheet data to JSON format
                var jsonData = XLSX.utils.sheet_to_json(sheet);

                // ✅ Format date column (Assume "Order Date" is the column name)
                jsonData = jsonData.map(row => {
                    if (row["Order Date"]) {
                        row["Order Date"] = this.formatExcelDate(row["Order Date"]);
                    }
                    return row;
                });
                console.log("Parsed JSON Data:", jsonData); // Debugging

                var columnKeys = Object.keys(jsonData[0]); // Extract column names
                var oTable = this.getView().byId("dataTable");

                columnKeys.forEach(column => {
                    let oColumn = new sap.ui.table.Column({
                        label: new sap.m.Text({ text: column }),
                        template: new sap.m.Input({ value: `{oModel>${column}}`, liveChange: "onDataChange" }),
                        width: "11rem"
                    });
                    oTable.addColumn(oColumn);
                });

                // Get the existing model
                var oModel = this.getView().getModel("oModel");

                // Update model with new data
                oModel.setProperty("/OrderData", jsonData);

                sap.m.MessageToast.show("File uploaded successfully!");
            }.bind(this);

            reader.readAsArrayBuffer(this.selectedFile); // ✅ Use readAsArrayBuffer
        },
        formatExcelDate: function (excelDate) {
            if (typeof excelDate === "number") {
                // Excel date starts from 1899-12-30
                var excelEpoch = new Date(1899, 11, 30);
                var newDate = new Date(excelEpoch.setDate(excelEpoch.getDate() + excelDate));

                var month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // MM
                var day = newDate.getDate().toString().padStart(2, '0'); // DD
                var year = newDate.getFullYear(); // YYYY

                return `${month}-${day}-${year}`; // MM-DD-YYYY format
            }
            return excelDate; // If not a number, return as is
        },
        onDataChange: function (oEvent) {
            var oModel = this.getView().getModel("oModel");
            oModel.refresh(); // Ensures UI updates instantly
        },
        onSaveChanges: function () {
            const that =this;
            var oModel = this.getView().getModel("oModel"); // Get your JSON model
            var aOrderData = oModel.getProperty("/OrderData"); // Get the entire table data
            const serviceUrl = this.getOwnerComponent().getModel().getServiceUrl();

            let ID = this.getView().getModel("oModel").oData.OrderData.ID;

            // Map UI Data to CDS Entity Fields
            var formattedData = aOrderData.map(this.mapUIFieldsToCDS);

            // Prepare Payload
            var payload = {
                Orderdata: formattedData
            };

            $.ajax({
                url: serviceUrl + `submitOrderData`,
                method: "POST",
                data: JSON.stringify(payload),
                contentType: "application/json",
                success: function (data) {

                    // // Update the model with the returned data after PATCH request
                    // oModel.setProperty("/originalrole", []);

                    // oModel.setProperty("/TempRoles", []);

                    //oModel.updateBindings(true);


                    MessageBox.success("Submitted Successfully.", {
                        actions: ["Ok"],
                        emphasizedAction: "Ok",
                        dependentOn: that.getView()
                    });

                },
                error: function (errMsg) {
                    MessageBox.error("Something Went Wrong.");
                }
            });

        }
    });
});