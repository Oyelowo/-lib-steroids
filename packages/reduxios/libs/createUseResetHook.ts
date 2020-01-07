import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { ApiActions } from './shared'

type CUDRH = (apiActions: ApiActions) => () => () => Action

/** Factory that creates function hook for resetting state to initialState */
const createUseResetStateHook: CUDRH = (apiActions) => () => {
  const dispatch = useDispatch()
  return () => dispatch({ type: apiActions.resetState })
}

export default createUseResetStateHook
