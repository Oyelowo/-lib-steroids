export const getApiActions = (type: string) => ({
  request: `${type}_REQUEST`,
  success: `${type}_SUCCESS`,
  failure: `${type}_FAILURE`,
  clearData: `${type}_DELETE`,
})

export type ApiActions = ReturnType<typeof getApiActions>
