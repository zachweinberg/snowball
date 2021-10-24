"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Period = exports.Unit = exports.AlertMode = exports.AlertCondition = exports.AlertDestination = exports.RealEstatePropertyType = exports.AssetType = exports.AssetColor = void 0;
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
var AlertDestination;
(function (AlertDestination) {
    AlertDestination["Email"] = "Email";
    AlertDestination["SMS"] = "SMS";
})(AlertDestination = exports.AlertDestination || (exports.AlertDestination = {}));
var AlertCondition;
(function (AlertCondition) {
    AlertCondition["Above"] = "Above";
    AlertCondition["Below"] = "Below";
})(AlertCondition = exports.AlertCondition || (exports.AlertCondition = {}));
var AlertMode;
(function (AlertMode) {
    AlertMode["FireAndDelete"] = "FireAndDelete";
    AlertMode["Repeat"] = "Repeat";
})(AlertMode = exports.AlertMode || (exports.AlertMode = {}));
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
