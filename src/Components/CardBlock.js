import React, { useEffect, useState } from "react";

// get the params from home page by franklin
const CardBlock = ({ params }) => {
  const [cardDetails, setcardDetails] = useState({});
  useEffect(() => {
    setcardDetails(params);
  }, [params]);

  return (
    <>
      <div
        style={{
          marginRight: "10px",
          borderRadius: "8px",
          opacity: "1",
          marginTop: "8%",
          borderRadius: "10px",
          // display: "flex",
          // flexDirection: "column",
          alignItems: "flex-start",
          border: `${cardDetails?.cardThickness || 0}px solid ${
            cardDetails?.borderTickColor || ""
          }`,
          backgroundColor: cardDetails?.cardBGColor,
          padding: "25px 20px 37px",
          boxShadow: `0px 6px 20px ${cardDetails?.cardBGColor}`,
          height: "20%",
          width: params.CardFont || params.CardValueFont === "Courier" ? "30%" : "28%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            className="CardTitle"
            style={{
              fontFamily: cardDetails["CardFont"],
              fontSize: cardDetails["CardFontSize"] + "px",
              color: cardDetails["cardColor"],
              wordWrap: "break-word",
              lineHeight: "normal",
            }}
          >
            {cardDetails?.CardTitle || ""}
          </span>
        </div>
        <div
          style={{
            padding: params.CardValue.length < 20 &&  params.CardValue.length < 15 ? "10% 20%": "10% 0%",
          }}
        >
          <span
            style={{
              fontFamily: cardDetails["CardValueFont"],
              fontSize: cardDetails["CardValueSize"] + "px",
              color: cardDetails["CardValueColor"],
              wordWrap: "break-word",
              lineHeight: "normal",
            }}
          >
            {cardDetails?.CardValue}
          </span>
        </div>
      </div>
    </>
  );
};

export default CardBlock;
