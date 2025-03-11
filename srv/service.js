const cds = require('@sap/cds');
module.exports = async function (srv) {

    srv.on("submitOrderData", async (req) => {
        try {

            // connecting to Service
            const orderextract = await cds.connect.to('orderextract');

            //Get Data
            const Data = req.data.Orderdata;
            console.log(req.data.Orderdata);

            const result = await orderextract.run(INSERT.into('Orderdata').entries(Data));
            // return { message: `${result.length} records successfully inserted.` };

            if (result){
                return {
                    "status": "OK",
                    "code": "200",
                    "message": "Data Submitted Successfully"
                }
            }
        } catch (e) {
            req.error(500, e.toString());
        }

    });

};