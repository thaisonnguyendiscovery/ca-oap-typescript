import { isAllPromisesSuccess, safely } from 'src/utils/ErrorHandlingUtils';

describe('ErrorHandlingUtils Test', () => {
  const getError = async () => {
    throw new Error();
  };
  const getSuccess = async () => null;

  it('should safely catch the rejected promise', async () => {
    const result = await safely(getError());
    expect(result).toBe(null);
  });

  it('should handle a list of prmise result', async () => {
    const withErrors = await Promise.allSettled([getSuccess(), getError(), getSuccess()]);
    const withErrorResult = isAllPromisesSuccess(withErrors);
    expect(withErrorResult).toBe(false);

    const allSuccess = await Promise.allSettled([getSuccess(), getSuccess(), getSuccess()]);
    const allSuccessResult = isAllPromisesSuccess(allSuccess);
    expect(allSuccessResult).toBe(true);
  });
});
