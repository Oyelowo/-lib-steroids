import { Reducer } from "redux";
import { ApiCallState } from "../index";
import { ApiActions } from "./shared";

type State<Data> = {
  fetchState: ApiCallState;
  data: Data | undefined;
};

type CRF = (
  apiActions: ApiActions
) => <Data>(initialState?: State<Data>) => Reducer<State<Data>>;

const oldState: State<any> = {
  fetchState: "idle",
  data: undefined
};

/** factory for creating function that creates reducer that hanles logic for data fetching */
const createReducerFactory: CRF = apiActions => (initialState = oldState) => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case apiActions.request:
      return { ...state, fetchState: "attempt" };

    case apiActions.success:
      return {
        ...state,
        fetchState: "success",
        data: action.payload.data
      };

    case apiActions.failure:
      return { ...state, fetchState: "failure" };

    case apiActions.clearData:
      return { ...state, data: undefined, fetchState: "idle" };

    default:
      return state;
  }
};

export default createReducerFactory;
