/**
 * Notación matemática del contenido: subconjunto mínimo tipo LaTeX.
 *
 *   \frac{a}{b}   \sqrt{x}   x^{2} (o x^2)   \cdot   \div   \le   \ge
 *
 * En los textos de las lecciones la matemática va entre `$…$`; un signo peso literal se escribe `\$`
 * (ej.: "cuesta \$1.500"). Cualquier cosa fuera del subconjunto es un error: el validador de
 * contenido lo rechaza antes de que llegue a un estudiante.
 */

/** Rol tipográfico: decide el espaciado alrededor del símbolo, igual que en LaTeX. */
export type SymRole = 'ord' | 'bin' | 'rel' | 'open' | 'close' | 'punct';

export type MathNode =
  | { readonly type: 'sym'; readonly value: string; readonly role: SymRole }
  | { readonly type: 'frac'; readonly num: MathNode[]; readonly den: MathNode[] }
  | { readonly type: 'sqrt'; readonly body: MathNode[] }
  | { readonly type: 'sup'; readonly base: MathNode; readonly exp: MathNode[] };

export type RichSegment =
  { readonly kind: 'text'; readonly value: string } | { readonly kind: 'math'; readonly nodes: MathNode[] };

export class MathParseError extends Error {
  constructor(
    message: string,
    readonly index: number,
  ) {
    super(message);
    this.name = 'MathParseError';
  }
}

const SYMBOL_COMMANDS: Record<string, string> = { cdot: '·', div: '÷', le: '≤', ge: '≥' };
export const SUPPORTED_COMMANDS = ['frac', 'sqrt', ...Object.keys(SYMBOL_COMMANDS)] as const;

const BIN = new Set(['+', '−', '·', '÷', '±']);
const REL = new Set(['=', '<', '>', '≤', '≥']);
const OPEN = new Set(['(', '[']);
const CLOSE = new Set([')', ']']);
const PUNCT = new Set([',', ';']);

function sym(value: string): MathNode {
  const role: SymRole = BIN.has(value)
    ? 'bin'
    : REL.has(value)
      ? 'rel'
      : OPEN.has(value)
        ? 'open'
        : CLOSE.has(value)
          ? 'close'
          : PUNCT.has(value)
            ? 'punct'
            : 'ord';
  return { type: 'sym', value, role };
}

class Parser {
  private i = 0;

  constructor(private readonly src: string) {}

  parse(): MathNode[] {
    const nodes = this.sequence(false);
    if (this.i < this.src.length) throw this.error('Hay una llave "}" que no se abrió');
    return nodes;
  }

  private error(message: string): MathParseError {
    return new MathParseError(`${message} (posición ${this.i} en "${this.src}")`, this.i);
  }

  private skipSpaces(): void {
    while (this.i < this.src.length && /\s/.test(this.src[this.i]!)) this.i++;
  }

  private sequence(insideGroup: boolean): MathNode[] {
    const nodes: MathNode[] = [];
    while (this.i < this.src.length) {
      const ch = this.src[this.i]!;
      if (ch === '}') {
        if (insideGroup) return nodes;
        throw this.error('Hay una llave "}" que no se abrió');
      }
      if (/\s/.test(ch)) {
        this.i++;
      } else if (ch === '{') {
        nodes.push(...this.group());
      } else if (ch === '\\') {
        nodes.push(this.command());
      } else if (ch === '^') {
        this.i++;
        const base = nodes.pop();
        if (!base) throw this.error('El exponente "^" no tiene base');
        nodes.push({ type: 'sup', base, exp: this.argument(true) });
      } else if (ch === '_' || ch === '$') {
        throw this.error(`El símbolo "${ch}" no está permitido`);
      } else {
        this.i++;
        nodes.push(sym(ch === '-' ? '−' : ch));
      }
    }
    if (insideGroup) throw this.error('Falta cerrar una llave "}"');
    return nodes;
  }

  private group(): MathNode[] {
    this.i++; // {
    const nodes = this.sequence(true);
    this.i++; // }
    return nodes;
  }

  /** `{…}`; si `allowSingle`, también un solo carácter (como en `x^2`). */
  private argument(allowSingle = false): MathNode[] {
    this.skipSpaces();
    const ch = this.src[this.i];
    if (ch === '{') return this.group();
    if (allowSingle && ch !== undefined && /[0-9A-Za-z]/.test(ch)) {
      this.i++;
      return [sym(ch)];
    }
    throw this.error('Se esperaba un argumento entre llaves "{…}"');
  }

  private command(): MathNode {
    const start = ++this.i; // salta "\"
    while (this.i < this.src.length && /[A-Za-z]/.test(this.src[this.i]!)) this.i++;
    const name = this.src.slice(start, this.i);
    if (name === 'frac') return { type: 'frac', num: this.argument(), den: this.argument() };
    if (name === 'sqrt') return { type: 'sqrt', body: this.argument() };
    const symbol = SYMBOL_COMMANDS[name];
    if (symbol) return sym(symbol);
    this.i = start - 1;
    throw this.error(`El comando "\\${name}" no está permitido`);
  }
}

export function parseMath(src: string): MathNode[] {
  return new Parser(src).parse();
}

/** Separa un texto de lección en tramos de prosa y de matemática (`$…$`). */
export function parseRich(src: string): RichSegment[] {
  const segments: RichSegment[] = [];
  let text = '';
  let i = 0;
  while (i < src.length) {
    const ch = src[i]!;
    if (ch === '\\' && src[i + 1] === '$') {
      text += '$';
      i += 2;
    } else if (ch === '$') {
      const end = src.indexOf('$', i + 1);
      if (end === -1) throw new MathParseError(`Falta cerrar "$" (posición ${i} en "${src}")`, i);
      if (text) segments.push({ kind: 'text', value: text });
      text = '';
      segments.push({ kind: 'math', nodes: parseMath(src.slice(i + 1, end)) });
      i = end + 1;
    } else {
      text += ch;
      i++;
    }
  }
  if (text) segments.push({ kind: 'text', value: text });
  return segments;
}
