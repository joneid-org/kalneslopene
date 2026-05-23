declare global {
  interface Array<T> {
    partition(
      predicate: (value: T, index: number, array: T[]) => boolean,
    ): [T[], T[]];
  }
}

if (!Array.prototype.partition) {
  Object.defineProperty(Array.prototype, "partition", {
    value: function partition<T>(
      this: T[],
      predicate: (value: T, index: number, array: T[]) => boolean,
    ): [T[], T[]] {
      const pass: T[] = [];
      const fail: T[] = [];
      for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
          pass.push(this[i]);
        } else {
          fail.push(this[i]);
        }
      }
      return [pass, fail];
    },
    writable: true,
    configurable: true,
  });
}

export {};
