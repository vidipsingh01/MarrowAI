'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const faqs = [
  {
    question: 'How do I upload a new medical report?',
    answer: 'Navigate to the Reports page and click on the Upload New Report button. You can upload files like PDFs or DICOM images. The AI will then process your report and provide an analysis.',
  },
  {
    question: 'What do the risk scores mean?',
    answer: 'The risk score is a value from 0 to 100, calculated by our AI based on your medical data. A higher score indicates a greater likelihood of a serious condition. We use a three-tier system: Low, Medium, and High risk, with High risk requiring immediate medical attention.',
  },
  {
    question: 'How is my data kept private and secure?',
    answer: 'We use industry-standard encryption and security protocols to protect your data. All reports and personal information are stored securely and are only accessible by you and authorized healthcare providers. We do not share your data without your explicit consent.',
  },
  {
    question: 'What is Aplastic Anemia?',
    answer: 'Aplastic Anemia is a rare and serious blood disorder where the body stops producing enough new blood cells. This can lead to a range of symptoms, including fatigue (due to a low red blood cell count), frequent infections (due to a low white blood cell count), and easy bruising or bleeding (due to a low platelet count).',
  },
  {
    question: 'How does the platform help me manage Aplastic Anemia?',
    answer: 'Our platform helps you manage your condition by centralizing your medical data. It provides AI-powered analysis of your blood counts and other reports, identifies high-risk trends, and offers personalized recommendations. This gives you and your doctor a clearer picture of your health status over time.',
  },
  {
    question: 'What should I do if my risk score is "High"?',
    answer: 'A "High" risk score indicates a critical finding that needs immediate attention. You should contact your hematologist or healthcare provider as soon as possible. If you are experiencing severe symptoms like a high fever or uncontrolled bleeding, please seek emergency medical care immediately.',
  },
  {
    question: 'How accurate are the AI predictions?',
    answer: 'Our AI is trained on a vast dataset of medical literature and patient data to provide a highly accurate analysis. However, it is a clinical support tool, not a diagnostic one. The predictions should always be reviewed and confirmed by a qualified healthcare professional who can consider your complete medical history and physical examination.',
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600 mt-2">
            Find answers to common questions and get support.
          </p>
        </div>
      </div>
      
      
      {/* FAQ Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFaq === index && (
                <div className="mt-2 text-gray-600 pr-8">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}