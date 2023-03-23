export default class Meth {
  /**
   * Returns a pseudorandom number between min and max, both inclusive.
   */
  static random(min: number, max: number): number {
    const maxRange = max - min + 1;
    const subOne = Math.random();
    return Math.floor(subOne * maxRange + min);
  }

  static sequence(from: number, to: number): number[] {
    if (to >= from) {
      const range = to - from + 1;
      return [ ...Array(range) ].map((_, index) => index + from);
    } else {
      return [];
    }
  }
}