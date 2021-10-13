"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Period = exports.Unit = exports.Destination = exports.RealEstatePropertyType = exports.AssetType = exports.AssetColor = void 0;
var AssetColor;
(function (AssetColor) {
    AssetColor["Stocks"] = "#CEF33C";
    AssetColor["Crypto"] = "#6600E8";
    AssetColor["Cash"] = "#4E5B00";
    AssetColor["Custom"] = "#72CB00";
    AssetColor["RealEstate"] = "#00565B";
})(AssetColor = exports.AssetColor || (exports.AssetColor = {}));
var AssetType;
(function (AssetType) {
    AssetType["Stock"] = "Stock";
    AssetType["RealEstate"] = "Real Estate";
    AssetType["Crypto"] = "Crypto";
    AssetType["Cash"] = "Cash";
    AssetType["Custom"] = "Custom";
})(AssetType = exports.AssetType || (exports.AssetType = {}));
var RealEstatePropertyType;
(function (RealEstatePropertyType) {
    RealEstatePropertyType["SingleFamily"] = "Single family home";
    RealEstatePropertyType["MultiFamily"] = "Multi-family home";
    RealEstatePropertyType["Condo"] = "Condo";
    RealEstatePropertyType["Apartment"] = "Apartment";
    RealEstatePropertyType["Commercial"] = "Commercial";
    RealEstatePropertyType["Storage"] = "Storage facility";
    RealEstatePropertyType["Other"] = "Other";
})(RealEstatePropertyType = exports.RealEstatePropertyType || (exports.RealEstatePropertyType = {}));
var Destination;
(function (Destination) {
    Destination["Email"] = "Email";
    Destination["SMS"] = "SMS";
})(Destination = exports.Destination || (exports.Destination = {}));
var Unit;
(function (Unit) {
    Unit["Dollars"] = "Dollars";
    Unit["Percents"] = "Percents";
})(Unit = exports.Unit || (exports.Unit = {}));
var Period;
(function (Period) {
    Period["Daily"] = "Daily";
    Period["Weekly"] = "Weekly";
    Period["Monthly"] = "Monthly";
})(Period = exports.Period || (exports.Period = {}));
