import { Eventer } from './eventer';

// 按键分类： 数字、单目运算符、双目运算符、小数点键、清除键、等于键
type KeyNumber = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type KeyOpBinary = '+' | '-' | '*' | '/';
type KeyOpUnary = '%' | '+/-';
type Events = { change: string };

export type Key = KeyNumber | KeyOpUnary | KeyOpBinary | '.' | 'C' | '=';

export type Stack = [string] | [string, KeyOpBinary] | [string, KeyOpBinary, string];
export const isNumber = (k: Key) => !isNaN(parseInt(k));
export const isOpBinary = (k: Key) => ['+', '-', '*', '/'].includes(k);
export const isOpUnary = (k: Key) => ['%', '+/-'].includes(k);

export class Calculator extends Eventer<Events> {
  protected stack: Stack = ['0'];

  press(k: Key) {
    const { stack, computed } = this;
    const len = stack.length;

    // 数字
    if (isNumber(k)) {
      if (len === 1) {
        this.setStack([stack[0] === '0' ? k : stack[0] + k]);
      } else if (len === 2) {
        this.setStack([stack[0], stack[1], k]);
      } else if (len === 3) {
        this.setStack([stack[0], stack[1], stack[2] + k]);
      }
    } else if (isOpBinary(k)) {
      // 操作符
      if (len === 1) {
        this.setStack([stack[0], k]);
      } else if (len === 2) {
        // 重置操作符
        this.setStack([stack[0], k]);
      } else if (len === 3) {
        const [str, num] = computed(stack);
        this.setStack([str, k]);
      }
    } else if (isOpUnary(k)) {
      const operate = (v: string, k: KeyOpUnary) => {
        switch (k) {
          case '%':
            return parseFloat((parseFloat(v) / 100).toFixed(8)).toString();
          case '+/-':
            if (v.startsWith('-')) {
              return v.substring(1);
            } else {
              return '-' + v;
            }
          default:
            throw k;
        }
      };

      if (len === 1) {
        this.setStack([operate(stack[0], k)]);
      } else if (len === 2) {
        this.setStack([operate(stack[0], k), stack[1]]);
      } else if (len === 3) {
        this.setStack([stack[0], stack[1], operate(stack[2], k)]);
      }
    } else {
      switch (k) {
        case '=':
          if (len === 3) {
            const [str, num] = computed(stack);
            this.setStack([str]);
          }
          break;
        case 'C':
          this.setStack(['0']);
          break;
        case '.':
          const op = (k: string) => (k.includes('.') ? k : k + '.');
          if (len === 1) {
            this.setStack([op(stack[0])]);
          } else if (len === 2) {
            this.setStack([stack[0], stack[1], '0.']);
          } else if (len === 3) {
            this.setStack([stack[0], stack[1], op(stack[2])]);
          }
          break;
        default:
          throw k;
      }
    }
  }

  setStack(stack: Stack) {
    this.stack = stack;
    if (stack.length === 1) {
      this.emit('change', this.stack[0]);
    } else if (stack.length === 2) {
      this.emit('change', this.stack[0]);
    } else if (stack.length === 3) {
      this.emit('change', this.stack[2]);
    } else {
      throw stack;
    }
  }

  computed(stack: [string, KeyOpBinary, string]): [string, number] {
    const [s1, op, s2] = stack;
    const [n1, n2] = [s1, s2].map(parseFloat);
    let res: number = NaN;
    switch (op) {
      case '+':
        res = n1 + n2;
        break;
      case '-':
        res = n1 - n2;
        break;
      case '*':
        res = n1 * n2;
        break;
      case '/':
        res = n1 / n2;
        break;
      default:
        throw op;
    }
    if (!isFinite(res) || isNaN(res)) {
      return ['ERROR', NaN];
    } else {
      return [parseFloat(res.toFixed(8)).toString(), res];
    }
  }
}
