import React, { createContext, useState } from 'react';

export const TotalResponsesContext = createContext();

export const TotalResponsesProvider = ({ children }) => {
  const [totalResponses, setTotalResponses,totalLeaveRequest,settotalLeaveRequest] = useState(0);

  return (
    <TotalResponsesContext.Provider value={{ totalResponses, setTotalResponses }}>
      {children}
    </TotalResponsesContext.Provider>
  );
};
