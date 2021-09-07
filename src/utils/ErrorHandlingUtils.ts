import { PromiseStatus } from 'src/utils/Enums';
import LOG from 'src/utils/Logger';

/**
 * Safely trigger an asynchronous call with generic error handling, to make sure that the main thread is not termincated if any error occur
 *
 * @param promise
 *    The promise returned from the function
 * @returns
 *    the safely error handled promise
 */
export const safely = <T>(promise: Promise<T>): Promise<T | null> => {
  return promise.catch((e) => {
    // TODO: generic error handling goes here
    LOG.error('Safely catched the following error:', e);

    // safely return a null value instead of dangerously throwing exception
    return Promise.resolve(null);
  });
};

/**
 * Check and handle any error occured when calling asynchronous APIs with Promise.allSettled
 *
 * @param promiseSettledResults
 *    response returned from Promise.allSettled
 * @return
 *    boolean of any error occurred
 */
export const isAllPromisesSuccess = (promiseSettledResults: Array<globalThis.PromiseSettledResult<any>>): boolean => {
  const rejectedCalls: Array<globalThis.PromiseSettledResult<any>> = promiseSettledResults.filter((result: globalThis.PromiseSettledResult<any>) => result.status === PromiseStatus.REJECTED);

  if (rejectedCalls.length) {
    LOG.error('isAllPromisesSuccess - found rejected call(s): ', rejectedCalls);
    return false;
  }
  return true;
};
