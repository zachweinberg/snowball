"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstatePropertyType = exports.AssetType = exports.InvestingExperienceLevel = void 0;
var InvestingExperienceLevel;
(function (InvestingExperienceLevel) {
    InvestingExperienceLevel["LessThanOneYear"] = "Less than a year";
    InvestingExperienceLevel["TwoToFiveYears"] = "Two to five years";
    InvestingExperienceLevel["OverFiveYears"] = "Over five years";
})(InvestingExperienceLevel = exports.InvestingExperienceLevel || (exports.InvestingExperienceLevel = {}));
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
