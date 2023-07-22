import React from "react";
import CardLineChart from "../Charts/CardLineChart";

const Cards = ({ params }) => {
  return (
    <>
      {(() => {
        let count = params.Custom === undefined ? 0 : params.Custom.CardRows;
        let Item = [];
        for (let i = 0; i < count; i++) {
          Item.push(
            <div className="div-card">
              <CardLineChart Data={params.Custom.Data} />
            </div>
          );
        }
        return Item;
      })()}
    </>
  );
};
export default Cards;
