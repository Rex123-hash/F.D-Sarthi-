import { describe, it, expect, vi } from 'vitest';
import handler from '../rates.js';

function mockRes() {
  const res = { headers: {}, body: null, statusCode: 200 };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.json = (data) => { res.body = data; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.end = () => {};
  return res;
}

describe('GET /api/rates', () => {
  it('returns rates array and updatedAt timestamp', () => {
    const req = { method: 'GET' };
    const res = mockRes();
    handler(req, res);
    expect(Array.isArray(res.body.rates)).toBe(true);
    expect(res.body.updatedAt).toBeTruthy();
  });

  it('rates array contains 8 banks', () => {
    const req = { method: 'GET' };
    const res = mockRes();
    handler(req, res);
    expect(res.body.rates).toHaveLength(8);
  });

  it('sets CORS header', () => {
    const req = { method: 'GET' };
    const res = mockRes();
    handler(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('*');
  });

  it('each rate entry has id, rate, bank, and tenureMonths', () => {
    const req = { method: 'GET' };
    const res = mockRes();
    handler(req, res);
    res.body.rates.forEach(entry => {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('rate');
      expect(entry).toHaveProperty('bank');
      expect(entry).toHaveProperty('tenureMonths');
    });
  });

  it('top rate is from Suryoday SFB at 9.10%', () => {
    const req = { method: 'GET' };
    const res = mockRes();
    handler(req, res);
    const sorted = [...res.body.rates].sort((a, b) => b.rate - a.rate);
    expect(sorted[0].rate).toBe(9.10);
    expect(sorted[0].bank).toContain('Suryoday');
  });
});
