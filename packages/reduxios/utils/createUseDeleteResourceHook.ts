import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { ApiActions } from './shared'

type CUDRH = (apiActions: ApiActions) => () => () => Action

/** Factory that creates function hook for deleting data that has been fetched by the redux helper's useResource function */
const createUseDeleteResourceHook: CUDRH = (apiActions) => () => {
  const dispatch = useDispatch()
  return () => dispatch({ type: apiActions.clearData })
}

export default createUseDeleteResourceHook
