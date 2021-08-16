import { throttle } from 'min-dash';

/**
 * A factory to create a configurable throttler.
 *
 * @param {number|boolean} [config=true]
 */
export default function ThrottleFactory(config=true) {

  const timeout = typeof config === 'number' ? config : config ? 300 : 0;

  if (timeout) {
    return fn => throttle(fn, timeout);
  } else {
    return fn => fn;
  }
}

ThrottleFactory.$inject = [ 'config.throttle' ];