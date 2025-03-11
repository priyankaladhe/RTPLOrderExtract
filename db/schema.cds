namespace db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Orderdata : cuid, managed {
    Plant               : String(50); //Plant
    MCNo                : String(50); //M/C No.
    OrderNo             : String(50); //Order No.
    OrderDate           : Date; //Order Date
    Material            : String(100); //Material
    MaterialDescription : String(500); //Material Description
    OperNo              : String(50); //Oper. No.
    OperDescription     : String(500); //Oper Description
    DrawingNo           : String(100); //Drawing No.
    RevNo               : String(10); //Rev.No.
    SrNo                : String(10); //Sr.No.
    PlanQty             : String(30); //Plan Qty.
    SetupTimeUnit       : String(50); //Setup Time Unit
    RoutingSetupTimeMin : String(50); //Routing Setup Time (Min)
    MachineTimeUnit     : String(50); //Machine Time Unit
    MachineTimeMin      : String(50); //Machine Time(Min)
    NormsQty            : String(50); //Norms Qty.
    OrderText           : String(500); //Order Text
    ShiftPlan           : String(500); //Shift Plan(I/II/III)
    OperatorName        : String(100); //Operator Name
    OperatorCode        : String(100); //Operator Code
    ManualSetupTimeMin  : String(100); //Manual Setup Time (Min)
    UsedTimeMin         : String(100); //Used Time (Min)
    ProductionQty       : String(100); //Production Qty.
    RejQtyMC            : String(100); //Rej. QTy - M/C
    RejQtyMAT           : String(100); //Rej. Qty - MAT
    DownTimeMin         : String(100); //Down Time (Min)
    DownTimeCode        : String(50); //Down Time Code
    Remarks             : String(500); //Remarks
}
