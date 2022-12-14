"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = exports.Period = exports.Unit = exports.AlertMode = exports.AlertCondition = exports.AlertDestination = exports.RealEstatePropertyType = exports.AssetType = exports.AssetColor = exports.PlanType = exports.DailyBalancesPeriod = void 0;
var DailyBalancesPeriod;
(function (DailyBalancesPeriod) {
    DailyBalancesPeriod["OneDay"] = "OneDay";
    DailyBalancesPeriod["OneWeek"] = "OneWeek";
    DailyBalancesPeriod["OneMonth"] = "OneMonth";
    DailyBalancesPeriod["SixMonths"] = "SixMonths";
    DailyBalancesPeriod["OneYear"] = "OneYear";
    DailyBalancesPeriod["AllTime"] = "AllTime";
})(DailyBalancesPeriod = exports.DailyBalancesPeriod || (exports.DailyBalancesPeriod = {}));
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "FREE";
    PlanType["PREMIUM"] = "PREMIUM";
})(PlanType = exports.PlanType || (exports.PlanType = {}));
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
    Period["Never"] = "Never";
})(Period = exports.Period || (exports.Period = {}));
exports.PLAN_LIMITS = {
    portfolios: {
        free: 1,
        premium: 4,
    },
    watchlist: {
        free: 6,
        premium: 30,
    },
    alerts: {
        free: 3,
        premium: 20,
    },
    stocks: {
        free: 4,
        premium: 30,
    },
    crypto: {
        free: 4,
        premium: 30,
    },
    realEstate: {
        free: 2,
        premium: 20,
    },
    cash: {
        free: 4,
        premium: 30,
    },
    custom: {
        free: 4,
        premium: 30,
    },
};
