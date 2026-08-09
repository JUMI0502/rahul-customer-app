// Pure utility functions extracted from MainApp.js for testability.
// No React Native imports here - keeps this file testable with plain
// Jest, no native module mocking required.

export const getPartLabel = (sku) => {
  if (!sku) return { label: 'PART', color: '#4F6EF7', bg: 'rgba(79,110,247,0.15)' };
  if (sku.includes('BRK')) return { label: 'BRAKE', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
  if (sku.includes('AIR')) return { label: 'AIR', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' };
  if (sku.includes('CHN')) return { label: 'CHAIN', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
  if (sku.includes('SPK')) return { label: 'SPARK', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' };
  if (sku.includes('CLT')) return { label: 'CLUTCH', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
  if (sku.includes('CAM')) return { label: 'CAM', color: '#F97316', bg: 'rgba(249,115,22,0.12)' };
  if (sku.includes('SUS')) return { label: 'SUSP', color: '#6366F1', bg: 'rgba(99,102,241,0.12)' };
  if (sku.includes('MTR')) return { label: 'METER', color: '#14B8A6', bg: 'rgba(20,184,166,0.12)' };
  if (sku.includes('LCK')) return { label: 'LOCK', color: '#EC4899', bg: 'rgba(236,72,153,0.12)' };
  if (sku.startsWith('OIL')) return { label: 'OIL', color: '#D97706', bg: 'rgba(217,119,6,0.12)' };
  if (sku.includes('HRO')) return { label: 'HERO', color: '#E31837', bg: 'rgba(227,24,55,0.12)' };
  if (sku.includes('HND')) return { label: 'HONDA', color: '#CC0000', bg: 'rgba(204,0,0,0.12)' };
  if (sku.includes('TVS')) return { label: 'TVS', color: '#0050A0', bg: 'rgba(0,80,160,0.12)' };
  if (sku.includes('BAJ')) return { label: 'BAJAJ', color: '#1A237E', bg: 'rgba(26,35,126,0.12)' };
  return { label: 'PART', color: '#4F6EF7', bg: 'rgba(79,110,247,0.12)' };
};

export const getIcon = (sku) => getPartLabel(sku).label;

export const getSkuForVehicle = (v) => {
  if (!v) return null;
  const m = v.model?.toLowerCase();
  const b = v.brand?.toLowerCase();
  // Honda models
  if (m?.includes('shine') || m?.includes('cb shine')) return 'HND-CBS';
  if (m?.includes('activa')) return 'HND-ACT';
  if (m?.includes('dream yuga')) return 'HND-DYG';
  if (m?.includes('sp 125')) return 'HND-SP1';
  if (m?.includes('unicorn')) return 'HND-UNI';
  if (m?.includes('livo')) return 'HND-LIV';
  if (m?.includes('hornet')) return 'HND-HRN';
  if (m?.includes('dio')) return 'HND-DIO';
  if (m?.includes('cb350')) return 'HND-CB3';
  // Hero models
  if (m?.includes('splendor+') || m?.includes('splendor plus')) return 'HRO-SPL';
  if (m?.includes('splendor pro')) return 'HRO-SPP';
  if (m?.includes('splendor')) return 'HRO-SPL';
  if (m?.includes('passion')) return 'HRO-PAS';
  if (m?.includes('glamour')) return 'HRO-GLA';
  if (m?.includes('hf deluxe')) return 'HRO-HFD';
  if (m?.includes('xtreme')) return 'HRO-XTR';
  if (m?.includes('super splendor')) return 'HRO-SSP';
  if (m?.includes('maestro')) return 'HRO-MAE';
  if (m?.includes('destini')) return 'HRO-DES';
  // TVS models
  if (m?.includes('apache')) return 'TVS-APR';
  if (m?.includes('jupiter')) return 'TVS-JPT';
  // Bajaj models
  if (m?.includes('pulsar 150')) return 'BAJ-P15';
  if (m?.includes('platina')) return 'BAJ-PLT';
  // fallback to vehicle SKU from VehicleSelectScreen
  return v.sku || null;
};
