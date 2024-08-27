import React, { createContext, useState } from 'react';

export const TotalResponsesContext = createContext();

export const TotalResponsesProvider = ({ children }) => {
  const [totalResponses, setTotalResponses,totalLeaveRequest,settotalLeaveRequest] = useState(0);
  const [role , setRole] = useState(3);

  return (
    <TotalResponsesContext.Provider value={{ totalResponses, setTotalResponses, role , setRole }}>
      {children}
    </TotalResponsesContext.Provider>
  );
};
