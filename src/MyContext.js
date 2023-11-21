// MyContext.js
import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export function MyProvider({ children }) {
  const [message, setMessage] = useState("No message from ComponentB");
  const [manageFilter, setManageFilter] = useState(false);

  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };

  const updateManageFilter = (newState) => {
    setManageFilter(newState);
  };

  return (
    <MyContext.Provider
      value={{ message, updateMessage, manageFilter, updateManageFilter }}
    >
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
