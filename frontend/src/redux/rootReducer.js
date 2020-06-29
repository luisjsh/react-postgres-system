import { combineReducers } from "redux";

import userReducer from "./user/userReducer";
import itemReducer from "./item/itemReducer";

export default combineReducers({
  user: userReducer,
  item: itemReducer,
});
