using {db as my} from '../db/schema';

service orderextract {
    entity Orderdata as projection on my.Orderdata;

    action submitOrderData(Orderdata: array of Orderdata) returns String;
}
