import { createContext, useContext, useReducer, useState } from "react";

const RecommendContextAPI = createContext();

// State reducer
const initialState = JSON.parse(localStorage.getItem("optionRecommend")) || {
  age_group: "",
  gender: "",
  travel_interests: [],
  income: "",
  location: "",
};

function reducer(state, action) {
  return { ...state, [action.field]: action.value };
}

function RecommendContext({ children }) {
  //   const optionRecommend = {
  //     age_group: "18-25",
  //     gender: "Nam",
  //     travel_interests: ["Xem phim", "Giải trí"],
  //     income: "10 triệu - 20 triệu",
  //     location: "Kon Tum",
  //   };
  const [optionRecommend, dispatch] = useReducer(reducer, initialState);
  // console.log(typeof JSON.stringify(option_user));
  const [recommendations, setRecommendations] = useState([]);
  return (
    <RecommendContextAPI.Provider
      value={{
        optionRecommend: optionRecommend,
        recommendations: recommendations,
        setRecommendations: setRecommendations,
        optionRecommend,
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
