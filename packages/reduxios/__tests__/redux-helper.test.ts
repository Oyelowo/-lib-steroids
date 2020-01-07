import "jest";
import { reduxios } from "../lib/reduxios";
import { getApiActions } from "../lib/shared";


const actionBaseName = "FETCH_USER";
const apiAction = getApiActions(actionBaseName);

interface FakeUser {
  userName: string;
  userId: number;
}

describe("CreateReducer helper method", () => {
  const userStoreHelper = reduxios<FakeUser>(actionBaseName);
  const userReducer = userStoreHelper.createReducer();

  test("should return undefined data when idle", () => {
    const initialState = userReducer(undefined, {} as any);
    expect(initialState).toStrictEqual({
      data: undefined,
      fetchState: "idle"
    });
  });

  test("should return undefined data when making attempting request", () => {
    const initialState = userReducer(undefined, { type: apiAction.request });
    expect(initialState).toStrictEqual({
      data: undefined,
      fetchState: "attempt"
    });
  });

  test("should return payload data when success", () => {
    const fakeData = {
      userName: "Sonja",
      userId: 2
    };

    const stateWhenApiCallSucceeds = userReducer(undefined, {
      type: apiAction.success,
      payload: {
        data: fakeData
      }
    });

    expect(stateWhenApiCallSucceeds).toStrictEqual({
      data: fakeData,
      fetchState: "success"
    });
  });

  test("should return undefined and failure fetchState when failure", () => {
    const stateWhenApiCallFails = userReducer(undefined, {
      type: apiAction.failure,
      payload: {
        axiosError: {
          response: {
            data: "fake error"
          }
        }
      }
    });

    expect(stateWhenApiCallFails).toStrictEqual({
      data: undefined,
      fetchState: "failure",
      axiosError: {
        response: {
          data: "fake error"
        }
      }
    });
  });

  test("should return no data and revert fetchState to idle when deleted", () => {
    const stateWhenDataDeleted = userReducer(undefined, {
      type: apiAction.resetState
    });

    expect(stateWhenDataDeleted).toStrictEqual({
      data: undefined,
      fetchState: "idle"
    });
  });
});
