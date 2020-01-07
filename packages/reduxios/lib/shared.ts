export const getApiActions = (type: string) => ({
  request: `${type}_REQUEST`,
  success: `${type}_SUCCESS`,
  failure: `${type}_FAILURE`,
  resetState: `${type}_RESET`,
})

export type ApiActions = ReturnType<typeof getApiActions>
