import { describe, it, expect } from 'vitest';
import { calcMaturity, calcInterestEarned, FD_DATA } from '../data/fdData.js';

describe('calcMaturity', () => {
  it('returns principal when rate is 0', () => {
    expect(calcMaturity(100000, 0, 12)).toBe(100000);
  });

  it('correctly compounds ₹1,00,000 at 9.10% for 12 months', () => {
    // 100000 * (1 + 0.091)^1 = 109100
    expect(calcMaturity(100000, 9.10, 12)).toBe(109100);
  });

  it('correctly compounds for 24 months', () => {
    // 100000 * (1.0875)^2 = 118,266 (rounded)
    expect(calcMaturity(100000, 8.75, 24)).toBe(118266);
  });

  it('correctly compounds for fractional years (18 months)', () => {
    const result = calcMaturity(100000, 8.50, 18);
    expect(result).toBeGreaterThan(100000);
    expect(result).toBeLessThan(120000);
  });

  it('scales linearly with principal', () => {
    const single = calcMaturity(100000, 9.10, 12);
    const double = calcMaturity(200000, 9.10, 12);
    expect(double).toBe(single * 2);
  });
});

describe('calcInterestEarned', () => {
  it('returns 0 when principal is 0', () => {
    expect(calcInterestEarned(0, 9.10, 12)).toBe(0);
  });

  it('equals maturity minus principal', () => {
    const principal = 50000;
    const rate = 9.10;
    const months = 12;
    expect(calcInterestEarned(principal, rate, months)).toBe(
      calcMaturity(principal, rate, months) - principal
    );
  });

  it('higher rate yields more interest', () => {
    const low = calcInterestEarned(100000, 6.80, 12);
    const high = calcInterestEarned(100000, 9.10, 12);
    expect(high).toBeGreaterThan(low);
  });

  it('longer tenure yields more interest at same rate', () => {
    const short = calcInterestEarned(100000, 8.75, 12);
    const long = calcInterestEarned(100000, 8.75, 24);
    expect(long).toBeGreaterThan(short);
  });
});

describe('FD_DATA integrity', () => {
  it('all entries have required fields', () => {
    FD_DATA.forEach(fd => {
      expect(fd).toHaveProperty('id');
      expect(fd).toHaveProperty('bank');
      expect(fd).toHaveProperty('rate');
      expect(fd).toHaveProperty('tenureMonths');
      expect(fd).toHaveProperty('insured');
      expect(fd).toHaveProperty('seniorRate');
    });
  });

  it('senior rate is always higher than general rate', () => {
    FD_DATA.forEach(fd => {
      expect(fd.seniorRate).toBeGreaterThan(fd.rate);
    });
  });

  it('NBFCs are not DICGC insured', () => {
    const nbfcs = FD_DATA.filter(fd => fd.type === 'NBFC');
    nbfcs.forEach(fd => {
      expect(fd.insured).toBe(false);
    });
  });

  it('banks (SFB and PSU) are DICGC insured', () => {
    const banks = FD_DATA.filter(fd => fd.type !== 'NBFC');
    banks.forEach(fd => {
      expect(fd.insured).toBe(true);
    });
  });

  it('all rates are positive and realistic (between 1% and 15%)', () => {
    FD_DATA.forEach(fd => {
      expect(fd.rate).toBeGreaterThan(1);
      expect(fd.rate).toBeLessThan(15);
    });
  });

  it('exactly one entry is highlighted', () => {
    const highlighted = FD_DATA.filter(fd => fd.highlight);
    expect(highlighted).toHaveLength(1);
  });
});
