import { describe, it, expect } from 'vitest';
import { toLocalNumeral, formatDualNumber, formatDualRate, t, LANGUAGES } from '../utils/language.js';

describe('toLocalNumeral', () => {
  it('converts digits to Hindi (Devanagari)', () => {
    expect(toLocalNumeral('123', 'hi')).toBe('१२३');
  });

  it('converts digits to Bengali', () => {
    expect(toLocalNumeral('456', 'bn')).toBe('৪৫৬');
  });

  it('returns unchanged for English', () => {
    expect(toLocalNumeral('789', 'en')).toBe('789');
  });

  it('returns unchanged for Tamil (uses Arabic numerals)', () => {
    expect(toLocalNumeral('100', 'ta')).toBe('100');
  });

  it('handles zero correctly in Hindi', () => {
    expect(toLocalNumeral('0', 'hi')).toBe('०');
  });
});

describe('formatDualRate', () => {
  it('returns Arabic percentage for English', () => {
    expect(formatDualRate(9.10, 'en')).toBe('9.10%');
  });

  it('returns dual format for Hindi', () => {
    const result = formatDualRate(9.10, 'hi');
    expect(result).toContain('९');
    expect(result).toContain('9.10%');
  });

  it('returns N/A for null rate', () => {
    expect(formatDualRate(null, 'en')).toBe('N/A');
  });

  it('returns N/A for NaN', () => {
    expect(formatDualRate(NaN, 'en')).toBe('N/A');
  });
});

describe('formatDualNumber', () => {
  it('formats in Indian numbering for English', () => {
    expect(formatDualNumber(100000, 'en')).toBe('1,00,000');
  });

  it('includes local and Arabic for Hindi', () => {
    const result = formatDualNumber(50000, 'hi');
    expect(result).toContain('५०,०००');
    expect(result).toContain('50,000');
  });
});

describe('t (translation)', () => {
  it('returns Hindi translation for known key', () => {
    expect(t('bank', 'hi')).toBe('बैंक');
  });

  it('returns English translation for English', () => {
    expect(t('bank', 'en')).toBe('Bank');
  });

  it('falls back to English for unknown language', () => {
    expect(t('bank', 'xx')).toBe('Bank');
  });

  it('returns the key itself when key is missing', () => {
    expect(t('nonExistentKey', 'en')).toBe('nonExistentKey');
  });
});

describe('LANGUAGES config', () => {
  it('has exactly 6 languages', () => {
    expect(LANGUAGES).toHaveLength(6);
  });

  it('all languages have a code, nativeName, and numerals array of length 10', () => {
    LANGUAGES.forEach(lang => {
      expect(lang.code).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
      expect(lang.numerals).toHaveLength(10);
    });
  });

  it('includes Hindi, Marathi, Tamil, Telugu, Bengali, English', () => {
    const codes = LANGUAGES.map(l => l.code);
    ['hi', 'mr', 'ta', 'te', 'bn', 'en'].forEach(code => {
      expect(codes).toContain(code);
    });
  });
});
