import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PricingMonthly from "./PricingMonthly";
import PricingYearly from "./PricingYearly";

const Pricing = () => {
  return (
    <div>
      <Tabs>
        <TabList className="nav nav-tabs justify-content-center pricing-nav-three">
          <Tab>Monthly</Tab>
          <Tab>Yearly</Tab>
        </TabList>

        <div className="pricing-table-area-four">
          <TabPanel>
            <PricingMonthly />
          </TabPanel>
          <TabPanel>
            <PricingYearly />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default Pricing;
