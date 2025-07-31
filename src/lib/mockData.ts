import { 
  BloodCount, 
  PatientData, 
  TimelineEvent, 
  MedicalReport, 
  DashboardStats,
  RiskAssessment,
  ChatMessage,
  PredictionResult
} from './types';

// Mock Blood Count Data
export const mockBloodCounts: BloodCount[] = [
  {
    id: '1',
    date: '2024-01-15',
    wbc: 3.2,
    rbc: 3.8,
    hemoglobin: 8.5,
    hematocrit: 25.2,
    platelets: 89,
    neutrophils: 45.2,
    lymphocytes: 35.8,
    monocytes: 8.5,
    eosinophils: 2.1,
    basophils: 0.4
  },
  {
    id: '2',
    date: '2024-02-01',
    wbc: 2.9,
    rbc: 3.5,
    hemoglobin: 7.8,
    hematocrit: 23.1,
    platelets: 76,
    neutrophils: 42.1,
    lymphocytes: 38.2,
    monocytes: 9.1,
    eosinophils: 1.8,
    basophils: 0.3
  },
  {
    id: '3',
    date: '2024-02-15',
    wbc: 2.6,
    rbc: 3.2,
    hemoglobin: 7.2,
    hematocrit: 21.8,
    platelets: 68,
    neutrophils: 39.5,
    lymphocytes: 40.1,
    monocytes: 9.8,
    eosinophils: 1.5,
    basophils: 0.2
  }
];

// Mock Patient Data
export const mockPatient: PatientData = {
  id: 'patient-001',
  name: 'Sarah Johnson',
  age: 34,
  gender: 'female',
  bloodType: 'A+',
  medicalHistory: [
    'Autoimmune thyroiditis',
    'Vitamin B12 deficiency',
    'Family history of hematologic malignancy'
  ],
  currentMedications: [
    'Levothyroxine 50mcg',
    'Vitamin B12 1000mcg',
    'Iron supplement'
  ],
  allergies: ['Penicillin', 'Shellfish'],
  lastVisit: '2024-02-15',
  riskLevel: 'high'
};

// Mock Timeline Events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-02-15',
    type: 'test',
    title: 'Complete Blood Count',
    description: 'Routine CBC showing continued pancytopenia. WBC: 2.6, RBC: 3.2, Platelets: 68',
    severity: 'high',
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-02-10',
    type: 'visit',
    title: 'Hematology Consultation',
    description: 'Follow-up appointment with Dr. Smith. Discussed treatment options and bone marrow biopsy scheduling.',
    status: 'completed'
  },
  {
    id: '3',
    date: '2024-02-01',
    type: 'test',
    title: 'Flow Cytometry',
    description: 'Flow cytometry analysis completed. No evidence of acute leukemia or MDS.',
    severity: 'medium',
    status: 'completed'
  },
  {
    id: '4',
    date: '2024-01-28',
    type: 'report',
    title: 'Bone Marrow Biopsy',
    description: 'Bone marrow biopsy shows hypocellular marrow (15% cellularity) consistent with aplastic anemia.',
    severity: 'high',
    status: 'completed'
  },
  {
    id: '5',
    date: '2024-01-15',
    type: 'symptom',
    title: 'Symptom Report',
    description: 'Patient reported severe fatigue, easy bruising, and shortness of breath.',
    severity: 'medium',
    status: 'completed'
  }
];

// Mock Medical Reports
export const mockReports: MedicalReport[] = [
  {
    id: 'report-001',
    patientId: 'patient-001',
    type: 'cbc',
    title: 'Complete Blood Count - February 2024',
    date: '2024-02-15',
    fileName: 'cbc_feb_2024.pdf',
    fileSize: 245760,
    status: 'completed',
    uploadedAt: '2024-02-15T09:30:00Z',
    results: {
      id: 'pred-001',
      reportId: 'report-001',
      confidence: 92.5,
      diagnosis: ['Severe Aplastic Anemia', 'Pancytopenia'],
      probability: {
        'Severe Aplastic Anemia': 92.5,
        'Moderate Aplastic Anemia': 7.2,
        'MDS': 0.3
      },
      severity: 'high',
      recommendations: [
        'Immediate hematology referral',
        'Bone marrow biopsy if not already performed',
        'Consider immunosuppressive therapy',
        'Monitor for bleeding and infection'
      ],
      additionalTests: [
        'Bone marrow cytogenetics',
        'PNH flow cytometry',
        'Viral studies (EBV, CMV, Parvovirus B19)',
        'Vitamin B12 and folate levels'
      ],
      processedAt: '2024-02-15T10:15:00Z'
    }
  },
  {
    id: 'report-002',
    patientId: 'patient-001',
    type: 'biopsy',
    title: 'Bone Marrow Biopsy Report',
    date: '2024-01-28',
    fileName: 'bone_marrow_biopsy_jan_2024.pdf',
    fileSize: 1024000,
    status: 'completed',
    uploadedAt: '2024-01-28T14:20:00Z',
    results: {
      id: 'pred-002',
      reportId: 'report-002',
      confidence: 96.8,
      diagnosis: ['Severe Aplastic Anemia'],
      probability: {
        'Severe Aplastic Anemia': 96.8,
        'Hypoplastic MDS': 2.8,
        'Drug-induced aplasia': 0.4
      },
      severity: 'high',
      recommendations: [
        'Immediate treatment initiation required',
        'Consider ATG/Cyclosporine therapy',
        'Evaluate for stem cell transplant candidacy',
        'Supportive care with transfusions as needed'
      ],
      additionalTests: [
        'HLA typing for patient and siblings',
        'Cardiac and pulmonary function tests',
        'Infectious disease screening'
      ],
      processedAt: '2024-01-28T16:45:00Z'
    }
  },
  {
    id: 'report-003',
    patientId: 'patient-001',
    type: 'imaging',
    title: 'CT Chest/Abdomen/Pelvis',
    date: '2024-02-05',
    fileName: 'ct_scan_feb_2024.dcm',
    fileSize: 52428800,
    status: 'processing',
    uploadedAt: '2024-02-05T11:00:00Z'
  }
];

// Mock Risk Assessment
export const mockRiskAssessment: RiskAssessment = {
  id: 'risk-001',
  patientId: 'patient-001',
  date: '2024-02-15',
  riskLevel: 'high',
  score: 87,
  factors: [
    {
      factor: 'Severe Pancytopenia',
      severity: 'high',
      impact: 35,
      description: 'All blood cell lines significantly below normal ranges'
    },
    {
      factor: 'Bone Marrow Hypocellularity',
      severity: 'high',
      impact: 30,
      description: 'Bone marrow cellularity <20% indicates severe aplastic anemia'
    },
    {
      factor: 'Transfusion Dependency',
      severity: 'medium',
      impact: 15,
      description: 'Requiring regular blood and platelet transfusions'
    },
    {
      factor: 'Age Factor',
      severity: 'low',
      impact: 7,
      description: 'Patient age (34) is favorable for treatment response'
    }
  ],
  recommendations: [
    'Urgent hematology consultation',
    'Consider immunosuppressive therapy vs. stem cell transplant',
    'Implement strict infection precautions',
    'Monitor for bleeding complications',
    'Family HLA typing for potential donors'
  ]
};

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalReports: 12,
  pendingAnalysis: 2,
  highRiskAlerts: 3,
  lastUpdate: '2024-02-15T10:30:00Z',
  recentActivity: mockTimelineEvents.slice(0, 3),
  bloodCountTrends: mockBloodCounts
};

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    type: 'user',
    message: 'What are the latest results from my blood work?',
    timestamp: '2024-02-15T09:45:00Z'
  },
  {
    id: 'msg-002',
    type: 'bot',
    message: 'Based on your most recent CBC from February 15th, your blood counts show continued low values. Your white blood cell count is 2.6 (normal: 4.0-11.0), hemoglobin is 7.2 (normal: 12.0-16.0), and platelets are 68 (normal: 150-450). These results are consistent with your aplastic anemia diagnosis. Would you like me to explain what these numbers mean?',
    timestamp: '2024-02-15T09:45:15Z',
    context: {
      patientId: 'patient-001',
      reportId: 'report-001'
    }
  },
  {
    id: 'msg-003',
    type: 'user',
    message: 'Yes, please explain what this means for my treatment.',
    timestamp: '2024-02-15T09:46:00Z'
  },
  {
    id: 'msg-004',
    type: 'bot',
    message: 'Your blood counts indicate severe aplastic anemia, which means your bone marrow is not producing enough blood cells. This puts you at high risk for infections, bleeding, and severe anemia. Based on your recent bone marrow biopsy and current counts, your medical team will likely discuss immunosuppressive therapy or evaluate you for a stem cell transplant. It\'s important to follow all infection precautions and report any fever, unusual bleeding, or worsening fatigue immediately.',
    timestamp: '2024-02-15T09:46:30Z'
  }
];

// Common Symptoms for Aplastic Anemia and Bone Marrow Disorders
export const commonSymptoms = [
  {
    id: 'fatigue',
    name: 'Fatigue and Weakness',
    category: 'General',
    description: 'Persistent tiredness and lack of energy'
  },
  {
    id: 'shortness_of_breath',
    name: 'Shortness of Breath',
    category: 'Respiratory',
    description: 'Difficulty breathing, especially with exertion'
  },
  {
    id: 'pale_skin',
    name: 'Pale Skin and Mucous Membranes',
    category: 'Appearance',
    description: 'Paleness of skin, gums, or inner eyelids'
  },
  {
    id: 'easy_bruising',
    name: 'Easy Bruising',
    category: 'Bleeding',
    description: 'Bruising easily or with minimal trauma'
  },
  {
    id: 'nosebleeds',
    name: 'Nosebleeds',
    category: 'Bleeding',
    description: 'Frequent or prolonged nosebleeds'
  },
  {
    id: 'bleeding_gums',
    name: 'Bleeding Gums',
    category: 'Bleeding',
    description: 'Gums that bleed easily when brushing teeth'
  },
  {
    id: 'petechiae',
    name: 'Small Red Spots (Petechiae)',
    category: 'Bleeding',
    description: 'Small red or purple spots on the skin'
  },
  {
    id: 'frequent_infections',
    name: 'Frequent Infections',
    category: 'Immune',
    description: 'Getting sick more often than usual'
  },
  {
    id: 'prolonged_fever',
    name: 'Prolonged Fever',
    category: 'Immune',
    description: 'Fever that lasts longer than expected'
  },
  {
    id: 'slow_healing',
    name: 'Slow Wound Healing',
    category: 'Immune',
    description: 'Cuts and wounds take longer to heal'
  },
  {
    id: 'dizziness',
    name: 'Dizziness or Lightheadedness',
    category: 'Neurological',
    description: 'Feeling dizzy or faint, especially when standing'
  },
  {
    id: 'headaches',
    name: 'Headaches',
    category: 'Neurological',
    description: 'More frequent or severe headaches than usual'
  },
  {
    id: 'rapid_heartbeat',
    name: 'Rapid Heartbeat',
    category: 'Cardiovascular',
    description: 'Heart beating faster than normal'
  },
  {
    id: 'chest_pain',
    name: 'Chest Pain',
    category: 'Cardiovascular',
    description: 'Pain or discomfort in the chest area'
  }
];

// Mock prediction results for different conditions
export const mockPredictionResults = {
  'severe_aplastic_anemia': {
    confidence: 92.5,
    probability: 0.925,
    description: 'High likelihood of severe aplastic anemia based on clinical presentation and laboratory findings.',
    recommendations: [
      'Immediate hematology consultation required',
      'Consider immunosuppressive therapy or stem cell transplant evaluation',
      'Implement strict infection precautions',
      'Monitor for bleeding complications'
    ]
  },
  'moderate_aplastic_anemia': {
    confidence: 78.3,
    probability: 0.783,
    description: 'Moderate aplastic anemia likely based on blood counts and bone marrow findings.',
    recommendations: [
      'Hematology referral within 1-2 weeks',
      'Consider supportive care and monitoring',
      'Evaluate for underlying causes',
      'Regular blood count monitoring'
    ]
  },
  'mds': {
    confidence: 15.2,
    probability: 0.152,
    description: 'Low probability of myelodysplastic syndrome based on current findings.',
    recommendations: [
      'Continue monitoring with serial CBCs',
      'Consider flow cytometry if counts worsen',
      'Bone marrow biopsy may be warranted'
    ]
  }
};

// Export all mock data
export const mockData = {
  bloodCounts: mockBloodCounts,
  patient: mockPatient,
  timelineEvents: mockTimelineEvents,
  reports: mockReports,
  riskAssessment: mockRiskAssessment,
  dashboardStats: mockDashboardStats,
  chatMessages: mockChatMessages,
  symptoms: commonSymptoms,
  predictions: mockPredictionResults
};
