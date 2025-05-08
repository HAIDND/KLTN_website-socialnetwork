import { createContext, useContext, useReducer, useState } from "react";

const RecommendContextAPI = createContext();

// State reducer
const initialState = {
  currentRecommendId: null,
  currentPlace: null,
  listRecommend: [],
  listPlace: [],
  hasMore: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "recommend/getTop5":
      return { ...state, listRecommend: action.payload };
    case "recommend/getAll":
      return { ...state, listRecommend: action.payload };
    case "recommend/getMore":
      return {
        ...state,
        listPlace: [...state.listPlace, ...action.payload.data],
        hasMore: action.payload.data.length < action.payload.limit,
      };
    case "recommend/clickLocation":
      console.log("action", action.payload);
      return {
        ...state,
        currentPlace: action.payload,
        // currentRecommendId: action.payload.place.id,
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
