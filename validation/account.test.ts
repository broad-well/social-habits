import { isEmailHandleValid } from "./account";

it('accepts email handles in the first initial + last name format', () => {
  const validHandles = [
    'esmith',
    'parmaarma',
    'a4hrbqnw',
    'vioenbqed',
    'b9rnqjajehqbrpfohdj',
  ];
  for (const handle of validHandles) {
    expect(isEmailHandleValid(handle)).toBe(true);
  }
});

it('accepts email handles in the initials + 3 digits format', () => {
  const validHandles = [
    'aaa000',
    'juw098',
    'qzq999',
    'aeq814',
  ];
  for (const handle of validHandles) {
    expect(isEmailHandleValid(handle)).toBe(true);
  }
});

it('rejects email handles with non-alphanumerical characters', () => {
  for (const handle of [
    'armman49!',
    'armman rules',
    'armman...',
    'armman_',
    'arm-man',
    'arm=2',
    'arm?',
    '@',
  ]) {
    expect(isEmailHandleValid(handle)).toBe(false);
  }
});

it('rejects email handles that are too short', () => {
  for (const handle of [
    'ar',
    '22',
    'go',
    'z',
    '0a',
  ]) {
    expect(isEmailHandleValid(handle)).toBe(false);
  }
});