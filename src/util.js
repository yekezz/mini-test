import chalk from 'chalk';

export const expect = (received) => ({
  toBe: (expected) => {
    if (received !== expected) {
      throw new Error(`Expected: ${chalk.green.bold(`${expected}`)} \n  Received: ${chalk.red.bold(`${received}`)}`);
    }
    return true;
  },
});
