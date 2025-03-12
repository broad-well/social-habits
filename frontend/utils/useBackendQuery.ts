// Convenience hook for sending a query to the backend and handling errors

import React from "react";

/**
 * @param query An async function that performs the query and returns the result if successful.
 * If the query fails, it should throw an Error.
 * @returns Utilities for interacting with this query hook.
 */
export default function useBackendQuery<R>(query: () => Promise<R>) {
  const [result, setResult] = React.useState<R | undefined>(undefined);
  const [sent, markSent] = React.useState<boolean>(false);
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
        markSent(true);
        setResult(await query());
        setError(undefined);
      } catch (e) {
        setError(e as Error);
      }
    },
    /**
     * Clear both the query and the error state variables
     */
    clear() {
      markSent(false);
      setResult(undefined);
      setError(undefined);
    },
    sent,
    result,
    error,
  };
}
