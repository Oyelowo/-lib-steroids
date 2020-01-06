import { AxiosError } from "axios";
import { AnyAction, Reducer } from "redux";
import { ApiCallState } from "../index";
import { ApiActions } from "./shared";

type State<Data, ErrorType = any> = {
  fetchState: ApiCallState;
  data: Data | undefined;
  axiosError: AxiosError<ErrorType> | null;
};

export interface CustomReduxActions<TData, ErrorInfo> extends AnyAction {
  payload: {
    data: TData;
    axiosError: AxiosError<ErrorInfo>;
  };
}

type CRF = (
  apiActions: ApiActions
) => <Data, ErrorInfo>(
  initialState?: State<Data>
) => Reducer<State<Data>, CustomReduxActions<Data, ErrorInfo>>;

const oldState: State<any> = {
  fetchState: "idle",
  data: undefined,
  axiosError: null
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
      return {
        ...state,
        fetchState: "failure",
        axiosError: action.payload.axiosError
      };

    case apiActions.clearData:
      return { ...state, data: undefined, fetchState: "idle" };

    default:
      return state;
  }
};

export default createReducerFactory;
