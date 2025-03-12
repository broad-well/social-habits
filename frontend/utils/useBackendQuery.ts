// Convenience hook for sending a query to the backend and handling errors

import React from "react";

/**
 * @param query An async function that performs the query and returns the result if successful.
 * If the query fails, it should throw an Error.
 * @returns Utilities for interacting with this query hook.
 */
export default function useBackendQuery<R>(query: () => Promise<R>) {
  const [result, setResult] = React.useState<R | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  return {
    /**
     * Send the query and populate the state variables according to the outcome
     * (success or failure)
     */
    async send() {
      setResult(undefined);
      setError(undefined);
      try {
        setLoading(true);
        setResult(await query());
        setError(undefined);
      } catch (e) {
        console.trace("useBackendQuery detected error", e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    /**
     * Clear both the query and the error state variables
     */
    clear() {
      setLoading(false);
      setResult(undefined);
      setError(undefined);
    },
    loading,
    result,
    error,
  };
}
