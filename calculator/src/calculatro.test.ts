import { Calculator } from './calculator';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('calculator', () => {
  const calculator = new Calculator();
  let r: string = '';
  let off: () => void = () => {};

  beforeAll(() => {
    off = calculator.on('change', (v) => (r = v));
  });

  afterAll(() => {
    off();
  });

  beforeEach(() => {
    calculator.press('C');
  });

  describe('add', () => {
    it('加法测试', () => {
      calculator.press('1');
      expect(r).toBe('1');

      calculator.press('+');
      expect(r).toBe('1');

      calculator.press('2');
      expect(r).toBe('2');

      calculator.press('=');
      expect(r).toBe('3');
    });
  });

  describe('minus', () => {
    it('测试小数点', () => {
      calculator.press('1');
      expect(r).toBe('1');

      calculator.press('2');
      expect(r).toBe('12');

      calculator.press('+');
      expect(r).toBe('12');

      calculator.press('-');
      expect(r).toBe('12');

      calculator.press('0');
      expect(r).toBe('0');

      calculator.press('.');
      expect(r).toBe('0.');

      calculator.press('5');
      expect(r).toBe('0.5');

      calculator.press('=');
      expect(r).toBe('11.5');
    });
  });

  describe('divide', () => {
    it('should result in error when dividing with 0', () => {
      calculator.press('-');
      expect(r).toBe('0');
      calculator.press('5');
      expect(r).toBe('5');
      calculator.press('/');
      expect(r).toBe('-5');
      calculator.press('0');
      expect(r).toBe('0');
      calculator.press('=');
      expect(r).toBe('ERROR');
    });
  });
});
