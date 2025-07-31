import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel, BloodCount } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'text-success-600 bg-success-50';
    case 'medium':
      return 'text-warning-600 bg-warning-50';
    case 'high':
      return 'text-danger-600 bg-danger-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getRiskBadgeColor(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'bg-success-100 text-success-800 border-success-200';
    case 'medium':
      return 'bg-warning-100 text-warning-800 border-warning-200';
    case 'high':
      return 'bg-danger-100 text-danger-800 border-danger-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateRiskScore(symptoms: string[], bloodCount?: BloodCount): number {
  let score = 0;
  
  // Symptom-based scoring
  const highRiskSymptoms = ['severe_fatigue', 'unexplained_bruising', 'frequent_infections', 'shortness_of_breath'];
  const mediumRiskSymptoms = ['mild_fatigue', 'nosebleeds', 'pale_skin', 'dizziness'];
  
  symptoms.forEach(symptom => {
    if (highRiskSymptoms.includes(symptom)) {
      score += 25;
    } else if (mediumRiskSymptoms.includes(symptom)) {
      score += 15;
    } else {
      score += 5;
    }
  });
  
  // Blood count-based scoring (if available)
  if (bloodCount) {
    // Normal ranges for reference
    const normalRanges = {
      wbc: { min: 4.0, max: 11.0 },
      rbc: { min: 4.2, max: 5.4 },
      hemoglobin: { min: 12.0, max: 16.0 },
      platelets: { min: 150, max: 450 }
    };
    
    // Check for abnormal values
    if (bloodCount.wbc < normalRanges.wbc.min) score += 20;
    if (bloodCount.rbc < normalRanges.rbc.min) score += 20;
    if (bloodCount.hemoglobin < normalRanges.hemoglobin.min) score += 25;
    if (bloodCount.platelets < normalRanges.platelets.min) score += 30;
  }
  
  return Math.min(score, 100); // Cap at 100
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

export function isBloodCountAbnormal(bloodCount: BloodCount): boolean {
  const normalRanges = {
    wbc: { min: 4.0, max: 11.0 },
    rbc: { min: 4.2, max: 5.4 },
    hemoglobin: { min: 12.0, max: 16.0 },
    hematocrit: { min: 36.0, max: 48.0 },
    platelets: { min: 150, max: 450 }
  };
  
  return (
    bloodCount.wbc < normalRanges.wbc.min || bloodCount.wbc > normalRanges.wbc.max ||
    bloodCount.rbc < normalRanges.rbc.min || bloodCount.rbc > normalRanges.rbc.max ||
    bloodCount.hemoglobin < normalRanges.hemoglobin.min || bloodCount.hemoglobin > normalRanges.hemoglobin.max ||
    bloodCount.hematocrit < normalRanges.hematocrit.min || bloodCount.hematocrit > normalRanges.hematocrit.max ||
    bloodCount.platelets < normalRanges.platelets.min || bloodCount.platelets > normalRanges.platelets.max
  );
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF Document';
    case 'jpg':
    case 'jpeg':
      return 'JPEG Image';
    case 'png':
      return 'PNG Image';
    case 'dcm':
      return 'DICOM Image';
    case 'doc':
    case 'docx':
      return 'Word Document';
    default:
      return 'Unknown';
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
