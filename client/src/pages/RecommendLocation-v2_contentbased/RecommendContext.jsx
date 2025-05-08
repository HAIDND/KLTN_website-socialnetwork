import { createContext, useContext, useReducer, useState } from "react";

const RecommendContextAPI = createContext();

// State reducer
const initialState = {
  currentRecommendId: null,
  currentPlace: null,
  listRecommend: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "recommend/getTop5":
      return { ...state, listRecommend: action.payload };
    case "recommend/clickLocation":
      console.log("action", action.payload);
      return {
        ...state,
        currentPlace: action.payload.place,
        currentRecommendId: action.payload.place.id,
        listRecommend: [...action.payload.data],
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function RecommendContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(typeof JSON.stringify(option_user));
  return (
    <RecommendContextAPI.Provider
      value={{
        state,

        dispatch,
      }}
    >
      {children}
    </RecommendContextAPI.Provider>
  );
}

function useRecommend() {
  //   if (RecommendContextAPI === undefined)
  //     return new Error("used context recommend outside ");
  return useContext(RecommendContextAPI);
}
export { RecommendContext, useRecommend };
