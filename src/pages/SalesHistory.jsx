import React from "react";
import SalesHistoryHero from "../components/saleshistory/SalesHistioryHero";
import TabHistory from "./../components/saleshistory/TabHistory";

const SalesHistory = () => {
  return (
    <div className="App relative scroll-smooth p-4">
      <SalesHistoryHero />
      <TabHistory />
    </div>
  );
};

export default SalesHistory;
