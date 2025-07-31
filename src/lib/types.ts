export interface BloodCount {
  id: string;
  date: string;
  wbc: number; // White Blood Cells (×10³/μL)
  rbc: number; // Red Blood Cells (×10⁶/μL)
  hemoglobin: number; // g/dL
  hematocrit: number; // %
  platelets: number; // ×10³/μL
  neutrophils: number; // %
  lymphocytes: number; // %
  monocytes: number; // %
  eosinophils: number; // %
  basophils: number; // %
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  lastVisit: string;
  riskLevel: RiskLevel;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskAssessment {
  id: string;
  patientId: string;
  date: string;
  riskLevel: RiskLevel;
  score: number; // 0-100
  factors: RiskFactor[];
  recommendations: string[];
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  impact: number; // 0-100
  description: string;
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 1 | 2 | 3 | 4 | 5;
  duration: string; // e.g., "2 weeks", "1 month"
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
}

export interface SymptomReport {
  id: string;
  patientId: string;
  date: string;
  symptoms: Symptom[];
  riskScore: number;
  suggestedActions: string[];
}

export interface MedicalReport {
  id: string;
  patientId: string;
  type: 'cbc' | 'biopsy' | 'imaging' | 'genetic' | 'other';
  title: string;
  date: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  results?: PredictionResult;
  uploadedAt: string;
}

export interface PredictionResult {
  id: string;
  reportId: string;
  confidence: number; // 0-100
  diagnosis: string[];
  probability: { [condition: string]: number };
  severity: RiskLevel;
  recommendations: string[];
  additionalTests: string[];
  processedAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'report' | 'visit' | 'test' | 'medication' | 'symptom';
  title: string;
  description: string;
  severity?: RiskLevel;
  status: 'completed' | 'pending' | 'cancelled';
  attachments?: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  context?: {
    patientId?: string;
    reportId?: string;
    relatedData?: unknown;
  };
}

export interface DashboardStats {
  totalReports: number;
  pendingAnalysis: number;
  highRiskAlerts: number;
  lastUpdate: string;
  recentActivity: TimelineEvent[];
  bloodCountTrends: BloodCount[];
}

// Disease-specific types
export interface AplasticAnemiaMarkers {
  reticulocyteCount: number; // %
  ironLevel: number; // μg/dL
  ferritin: number; // ng/mL
  b12Level: number; // pg/mL
  folateLevel: number; // ng/mL
  bonemarrowCellularity: number; // %
}

export interface BoneMarrowBiopsy {
  id: string;
  patientId: string;
  date: string;
  cellularity: number; // %
  blasts: number; // %
  dysplasia: boolean;
  fibrosis: number; // grade 0-3
  cytogenetics: string[];
  molecularMarkers: string[];
  diagnosis: string;
  prognosis: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  estimatedProcessingTime?: number; // minutes
}

// Form Types
export interface SymptomFormData {
  symptoms: string[];
  severity: { [symptom: string]: number };
  duration: { [symptom: string]: string };
  additionalNotes: string;
}

export interface PatientFormData {
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
  };
  medicalHistory: string[];
  currentSymptoms: SymptomFormData;
  medications: string[];
  allergies: string[];
}
