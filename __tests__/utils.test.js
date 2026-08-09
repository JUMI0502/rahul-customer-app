import { getPartLabel, getIcon, getSkuForVehicle } from '../utils';

describe('getPartLabel', () => {
  test('returns default PART label for null/undefined sku', () => {
    expect(getPartLabel(null).label).toBe('PART');
    expect(getPartLabel(undefined).label).toBe('PART');
  });

  test('identifies brake parts', () => {
    expect(getPartLabel('HRO-SPL-BRK').label).toBe('BRAKE');
  });

  test('identifies oil products by prefix', () => {
    expect(getPartLabel('OIL-101').label).toBe('OIL');
  });

  test('does not misidentify oil as a suffix match', () => {
    // OIL check uses startsWith, so a SKU merely containing "OIL"
    // partway through should NOT match - guards against a regression
    // if someone later changes startsWith to includes.
    expect(getPartLabel('HRO-COIL-01').label).not.toBe('OIL');
  });

  test('identifies brand for Hero parts', () => {
    expect(getPartLabel('HRO-SPL-AIR').label).toBe('AIR');
  });

  test('falls back to brand label when no part-type match', () => {
    expect(getPartLabel('HRO-UNKNOWN-CODE').label).toBe('HERO');
  });

  test('falls back to generic PART for totally unknown sku', () => {
    expect(getPartLabel('ZZZ-999').label).toBe('PART');
  });
});

describe('getIcon', () => {
  test('returns the same label as getPartLabel', () => {
    expect(getIcon('OIL-101')).toBe('OIL');
    expect(getIcon(null)).toBe('PART');
  });
});

describe('getSkuForVehicle', () => {
  test('returns null for no vehicle', () => {
    expect(getSkuForVehicle(null)).toBeNull();
    expect(getSkuForVehicle(undefined)).toBeNull();
  });

  test('matches Honda Activa', () => {
    expect(getSkuForVehicle({ brand: 'Honda', model: 'Activa' })).toBe('HND-ACT');
  });

  test('matches Hero Splendor+ specifically, not generic Splendor', () => {
    expect(getSkuForVehicle({ brand: 'Hero', model: 'Splendor+' })).toBe('HRO-SPL');
    expect(getSkuForVehicle({ brand: 'Hero', model: 'Splendor Pro' })).toBe('HRO-SPP');
  });

  test('is case-insensitive on model name', () => {
    expect(getSkuForVehicle({ brand: 'Honda', model: 'ACTIVA' })).toBe('HND-ACT');
  });

  test('matches Bajaj Pulsar 150 specifically', () => {
    expect(getSkuForVehicle({ brand: 'Bajaj', model: 'Pulsar 150' })).toBe('BAJ-P15');
  });

  test('falls back to vehicle.sku when model is unrecognized', () => {
    expect(getSkuForVehicle({ brand: 'Yamaha', model: 'FZ', sku: 'YAM-FZ' })).toBe('YAM-FZ');
  });

  test('falls back to null when model unrecognized and no sku provided', () => {
    expect(getSkuForVehicle({ brand: 'Yamaha', model: 'FZ' })).toBeNull();
  });
});
