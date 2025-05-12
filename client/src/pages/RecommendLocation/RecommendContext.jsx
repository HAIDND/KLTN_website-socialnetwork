import { createContext, useContext, useReducer, useState } from "react";

const RecommendContextAPI = createContext();

// State reducer
const initialState = {
  currentRecommendId: null,
  currentPlace: null,
  listRecommendPlace: [], // list recommend place
  listAllPlace: [], // list all place
  currentlistRating: [], // list rating in location
  myListRating: [], // list rating in location
  myRating: [], // list rating in location
  hasMore: true, // check if has more data
  isLoading: false, // check if loading
};
const userId = JSON.parse(sessionStorage.getItem("jwt"))?.userId || "null";
console.log("userId", userId);
function reducer(state, action) {
  switch (action.type) {
    case "recommend/loading":
      return { ...state, isLoading: true };
    case "recommend/getTop5":
      return { ...state, listRecommend: action.payload, isLoading: false };
    case "recommend/getAll":
      return { ...state, listRecommend: action.payload, isLoading: false };
    case "recommend/getMore":
      return {
        ...state,
        listAllPlace: [...state.listAllPlace, ...action.payload.data],
        hasMore: action.payload.data.length < action.payload.limit,
        isLoading: false,
      };
    case "recommend/clickLocation":
      console.log("action", action.payload);
      return {
        ...state,
        currentPlace: action.payload,
        currentlistRating: [],
        myRating: [],
        isLoading: false,
        // currentRecommendId: action.payload.place.id,
      };
    case "recommend/getRatingInLocation":
      console.log("action", action.payload);
      return {
        ...state,
        isLoading: false,
        currentlistRating: [...state.currentlistRating, ...action.payload],
      };
    case "recommend/getMyRatingInLocation":
      console.log("action", action.payload);
      return {
        ...state,
        myRating: action.payload,
        isLoading: false,
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
