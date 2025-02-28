
const emailHandleRegex = /^[\dA-Za-z]{3,}$/;
export function isEmailHandleValid(handle: string): boolean {
  return emailHandleRegex.test(handle);
}
