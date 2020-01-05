import { getActionsTypes } from "./redux-fetch";

type ApiCallActionsTypes = ReturnType<typeof getActionsTypes>;

type ApiCallState = "idle" | "attempt" | "success" | "failure";

interface State<DataType> {
    apiCallState: ApiCallState;
    data: DataType | undefined;
}

const oldState: State<any> = {
    apiCallState: "idle",
    data: undefined
};



type MRF = (
    apiCallActions: ApiCallActionsTypes
) => <DataType>(
        intialState?: State<DataType>
    ) => Reducer<State<DataType>, AnyAction>;



  type callApi =  (axiosCall: any, dispatch: Dispatch<AnyAction>, apiCallActions: any) => () => Promise<void>


  type MUR = (
    apiCallActions: ApiCallActionsTypes
) => (axiosCall: AxiosPromise<any>) => () => Promise<void>;

type MUDR = (apiCallActions: ApiCallActionsTypes) => () => () => AnyAction;

type reduxApiCallHelper: <ApiActionType extends string>(type: ApiActionType) = {
    useResource: (axiosCall: any) => () => Promise<void>;
    useDeleteResource: () => () => any;
    createReducer: (initialState?: State<any>) => (state?: State<any>, action: any) => {

    };
}
