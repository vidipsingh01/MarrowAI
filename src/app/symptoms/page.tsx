'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Droplets
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { commonSymptoms } from '@/lib/mockData';
import { calculateRiskScore, getRiskLevel, getRiskBadgeColor } from '@/lib/utils';

interface SymptomSelection {
  symptomId: string;
  severity: number;
  duration: string;
  notes?: string;
}

export default function SymptomsPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomSelection[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [riskAssessment, setRiskAssessment] = useState<{
    score: number;
    level: 'low' | 'medium' | 'high';
    recommendations: string[];
  } | null>(null);

  const symptomCategories = [
    {
      name: 'General Symptoms',
      icon: Activity,
      symptoms: commonSymptoms.filter(s => s.category === 'General')
    },
    {
      name: 'Bleeding & Bruising',
      icon: Droplets,
      symptoms: commonSymptoms.filter(s => s.category === 'Bleeding')
    },
    {
      name: 'Respiratory',
      icon: Heart,
      symptoms: commonSymptoms.filter(s => s.category === 'Respiratory')
    },
    {
      name: 'Immune System',
      icon: Thermometer,
      symptoms: commonSymptoms.filter(s => s.category === 'Immune')
    },
    {
      name: 'Neurological',
      icon: Activity,
      symptoms: commonSymptoms.filter(s => s.category === 'Neurological')
    },
    {
      name: 'Cardiovascular',
      icon: Heart,
      symptoms: commonSymptoms.filter(s => s.category === 'Cardiovascular')
    },
    {
      name: 'Appearance',
      icon: Circle,
      symptoms: commonSymptoms.filter(s => s.category === 'Appearance')
    }
  ];

  const severityLevels = [
    { value: 1, label: 'Mild', description: 'Barely noticeable', color: 'bg-green-100 text-green-800' },
    { value: 2, label: 'Light', description: 'Noticeable but not bothersome', color: 'bg-yellow-100 text-yellow-800' },
    { value: 3, label: 'Moderate', description: 'Somewhat bothersome', color: 'bg-orange-100 text-orange-800' },
    { value: 4, label: 'Severe', description: 'Very bothersome', color: 'bg-red-100 text-red-800' },
    { value: 5, label: 'Extreme', description: 'Unable to function', color: 'bg-red-200 text-red-900' }
  ];

  const durationOptions = [
    'Less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-3 months',
    '3-6 months',
    'More than 6 months'
  ];

  const isSymptomSelected = (symptomId: string) => {
    return selectedSymptoms.some(s => s.symptomId === symptomId);
  };

  const toggleSymptom = (symptomId: string) => {
    if (isSymptomSelected(symptomId)) {
      setSelectedSymptoms(prev => prev.filter(s => s.symptomId !== symptomId));
    } else {
      setSelectedSymptoms(prev => [...prev, {
        symptomId,
        severity: 3,
        duration: '1-2 weeks'
      }]);
    }
  };

  const updateSymptomDetails = (symptomId: string, field: keyof SymptomSelection, value: unknown) => {
    setSelectedSymptoms(prev =>
      prev.map(s =>
        s.symptomId === symptomId ? { ...s, [field]: value } : s
      )
    );
  };

  const generateRiskAssessment = () => {
    const symptomIds = selectedSymptoms.map(s => s.symptomId);
    const score = calculateRiskScore(symptomIds);
    const level = getRiskLevel(score);

    let recommendations: string[] = [];

    if (level === 'high') {
      recommendations = [
        'Seek immediate medical attention from a hematologist',
        'Complete blood count (CBC) with differential urgently needed',
        'Consider emergency department visit if experiencing fever or severe bleeding',
        'Avoid activities that could cause injury or bleeding',
        'Monitor for signs of infection and seek care immediately if fever develops'
      ];
    } else if (level === 'medium') {
      recommendations = [
        'Schedule appointment with your primary care physician within 1-2 weeks',
        'Request complete blood count (CBC) to evaluate blood cell levels',
        'Keep a symptom diary to track changes',
        'Avoid taking aspirin or blood-thinning medications',
        'Practice good hygiene to prevent infections'
      ];
    } else {
      recommendations = [
        'Continue monitoring symptoms and note any changes',
        'Maintain a healthy lifestyle with adequate rest',
        'Consider routine blood work at your next physical exam',
        'Contact healthcare provider if symptoms worsen',
        'Stay up to date with preventive care'
      ];
    }

    setRiskAssessment({ score, level, recommendations });
    setCurrentStep(3);
  };

  const resetAssessment = () => {
    setSelectedSymptoms([]);
    setRiskAssessment(null);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Symptom Checker</h1>
        <p className="text-gray-600 mt-2">
          Check your symptoms and get an AI-powered risk assessment for aplastic anemia and related blood disorders.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-medical-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'border-gray-600 bg-gray-600 text-white' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Symptoms</span>
          </div>
          <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-medical-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-medical-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'border-gray-600 bg-gray-600 text-white' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Provide Details</span>
          </div>
          <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-medical-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-medical-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 3 ? 'border-gray-600 bg-gray-600 text-white' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Risk Assessment</span>
          </div>
        </div>
      </Card>

      {currentStep === 1 && (
        <div className="space-y-6">
          {symptomCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <Card key={categoryIndex} className="p-6 ">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-medical-100 rounded-lg mr-3">
                    <IconComponent className="h-5 w-5 text-medical-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.symptoms.map((symptom) => {
                    const selected = isSymptomSelected(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:bg-gray-100 ${
                          selected
                            ? 'border-medical-500 bg-medical-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {selected ? (
                            <CheckCircle className="h-5 w-5 text-medical-600 mt-0.5" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{symptom.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{symptom.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}

          <div className="flex justify-between">
            <div></div>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={selectedSymptoms.length === 0}
              className="min-w-32 text-white border bg-blue-500 hover:bg-blue-600"
            >
              Next: Add Details
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Provide Details for Selected Symptoms
            </h3>
            <p className="text-gray-600 mb-6">
              Please provide additional information about each symptom to improve the accuracy of your risk assessment.
            </p>

            <div className="space-y-6">
              {selectedSymptoms.map((selection) => {
                const symptom = commonSymptoms.find(s => s.id === selection.symptomId);
                if (!symptom) return null;

                return (
                  <div key={selection.symptomId} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">{symptom.name}</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Severity Level
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {severityLevels.map((level) => (
                          <button
                            key={level.value}
                            onClick={() => updateSymptomDetails(selection.symptomId, 'severity', level.value)}
                            className={`p-2 rounded-md text-xs font-medium transition-colors ${
                              selection.severity === level.value
                                ? level.color
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <div>{level.label}</div>
                            <div className="text-xs opacity-75">{level.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How long have you had this symptom?
                      </label>
                      <select
                        value={selection.duration}
                        onChange={(e) => updateSymptomDetails(selection.symptomId, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                      >
                        {durationOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        value={selection.notes || ''}
                        onChange={(e) => updateSymptomDetails(selection.symptomId, 'notes', e.target.value)}
                        placeholder="Any additional details about this symptom..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                        rows={2}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className='hover:bg-gray-200'
            >
              Back: Edit Symptoms
            </Button>
            <Button
              onClick={generateRiskAssessment}
              className="min-w-32 border bg-blue-500 hover:bg-blue-600"
            >
              Generate Assessment
            </Button>
          </div>
        </div>
      )}

      {currentStep === 3 && riskAssessment && (
        <div className="space-y-6">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                riskAssessment.level === 'high' ? 'bg-danger-100' :
                riskAssessment.level === 'medium' ? 'bg-warning-100' :
                'bg-success-100'
              }`}>
                <AlertTriangle className={`h-10 w-10 ${
                  riskAssessment.level === 'high' ? 'text-danger-600' :
                  riskAssessment.level === 'medium' ? 'text-warning-600' :
                  'text-success-600'
                }`} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Risk Score: {riskAssessment.score}/100
              </h2>
              <Badge 
                className={`${getRiskBadgeColor(riskAssessment.level)} text-lg px-4 py-2`}
              >
                {riskAssessment.level.toUpperCase()} RISK
              </Badge>
            </div>
            
            <Progress 
              value={riskAssessment.score} 
              color={
                riskAssessment.level === 'high' ? 'danger' :
                riskAssessment.level === 'medium' ? 'warning' :
                'success'
              }
              className="mb-6"
              showValue
            />

            <p className="text-gray-600 max-w-2xl mx-auto">
              {riskAssessment.level === 'high' && 
                "Your symptoms suggest a high risk for aplastic anemia or related blood disorders. Immediate medical evaluation is strongly recommended."
              }
              {riskAssessment.level === 'medium' && 
                "Your symptoms indicate a moderate risk that warrants medical evaluation. Please schedule an appointment with your healthcare provider."
              }
              {riskAssessment.level === 'low' && 
                "Your symptoms suggest a low risk for serious blood disorders, but continued monitoring is recommended."
              }
            </p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Symptoms</h3>
              <div className="space-y-3">
                {selectedSymptoms.map((selection) => {
                  const symptom = commonSymptoms.find(s => s.id === selection.symptomId);
                  if (!symptom) return null;

                  const severityLevel = severityLevels.find(l => l.value === selection.severity);
                  
                  return (
                    <div key={selection.symptomId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{symptom.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="default" size="sm">
                            {severityLevel?.label}
                          </Badge>
                          <span className="text-sm text-gray-600">{selection.duration}</span>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        selection.severity >= 4 ? 'bg-danger-500' :
                        selection.severity >= 3 ? 'bg-warning-500' :
                        'bg-success-500'
                      }`}></div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Risk Factors</h3>
              <div className="space-y-3">
                {riskAssessment.level === 'high' && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-danger-50 rounded-lg">
                      <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                      <span className="text-sm text-danger-800">Multiple severe symptoms present</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-danger-50 rounded-lg">
                      <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                      <span className="text-sm text-danger-800">Pattern consistent with bone marrow failure</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-danger-50 rounded-lg">
                      <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                      <span className="text-sm text-danger-800">Symptoms duration suggests progressive condition</span>
                    </div>
                  </>
                )}
                {riskAssessment.level === 'medium' && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span className="text-sm text-warning-800">Some concerning symptoms present</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span className="text-sm text-warning-800">Blood work evaluation recommended</span>
                    </div>
                  </>
                )}
                {riskAssessment.level === 'low' && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm text-success-800">Mild symptoms with low concern</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm text-success-800">Continue routine monitoring</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {riskAssessment.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-medical-50 rounded-lg">
                  <div className="w-2 h-2 bg-medical-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-900">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>

          {riskAssessment.level === 'high' && (
            <Card className="p-6 border-l-4 border-danger-500 bg-danger-50">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-danger-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-danger-900 mb-2">
                    Seek Immediate Medical Attention
                  </h3>
                  <p className="text-danger-800 mb-4">
                    Your symptom pattern suggests a potentially serious blood disorder. Contact your healthcare 
                    provider immediately or visit the emergency department if you experience:
                  </p>
                  <ul className="text-danger-800 text-sm space-y-1 ml-4">
                    <li>• Fever over 100.4°F (38°C)</li>
                    <li>• Heavy or uncontrolled bleeding</li>
                    <li>• Severe shortness of breath</li>
                    <li>• Chest pain or rapid heartbeat</li>
                    <li>• Severe fatigue or weakness</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={resetAssessment}
              variant="outline"
              className="min-w-40 hover:bg-gray-200"
            >
              Start New Assessment
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="outline"
              className="min-w-40 hover:bg-gray-200"
            >
              Print Results
            </Button>
          </div>
        </div>
      )}

      <Card className="p-6 bg-gradient-to-r from-medical-50 to-blue-50 border-medical-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Aplastic Anemia Symptoms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="p-3 bg-medical-100 rounded-lg inline-block mb-3">
              <Droplets className="h-6 w-6 text-medical-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Bleeding & Bruising</h4>
            <p className="text-sm text-gray-600">
              Low platelet counts lead to easy bruising, nosebleeds, and prolonged bleeding 
              from minor cuts. Watch for small red spots (petechiae) on your skin.
            </p>
          </div>
          <div>
            <div className="p-3 bg-medical-100 rounded-lg inline-block mb-3">
              <Activity className="h-6 w-6 text-medical-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Fatigue & Weakness</h4>
            <p className="text-sm text-gray-600">
              Low red blood cell counts cause anemia, leading to persistent fatigue, 
              weakness, and shortness of breath, especially with physical activity.
            </p>
          </div>
          <div>
            <div className="p-3 bg-medical-100 rounded-lg inline-block mb-3">
              <Thermometer className="h-6 w-6 text-medical-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Infections</h4>
            <p className="text-sm text-gray-600">
              Low white blood cell counts increase infection risk. Fever, frequent infections, 
              or slow healing wounds may indicate compromised immunity.
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white rounded-lg border border-medical-200">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> This symptom checker is for educational purposes only and 
            should not replace professional medical advice. Always consult with qualified healthcare 
            providers for proper diagnosis and treatment.
          </p>
        </div>
      </Card>
    </div>
  );
}
