'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { mockChatMessages } from '@/lib/mockData';
import { ChatMessage } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('aplastic anemia') || lowerMessage.includes('bone marrow')) {
      return "Aplastic anemia is a rare but serious blood disorder where your bone marrow doesn't make enough new blood cells. This leads to low counts of red blood cells, white blood cells, and platelets. Early symptoms include fatigue, frequent infections, and easy bruising. Would you like me to help you assess your symptoms or explain your recent test results?";
    }
    
    if (lowerMessage.includes('blood count') || lowerMessage.includes('cbc')) {
      return "Based on your recent CBC results, your blood counts show some concerning values. Your white blood cell count, hemoglobin, and platelet levels are all below normal ranges. This pattern is consistent with your aplastic anemia diagnosis. I recommend discussing these results with your hematologist. Would you like me to explain what each value means?";
    }
    
    if (lowerMessage.includes('symptoms') || lowerMessage.includes('tired') || lowerMessage.includes('fatigue')) {
      return "Fatigue is one of the most common symptoms of aplastic anemia, caused by low red blood cell counts (anemia). Other symptoms to watch for include easy bruising, frequent infections, shortness of breath, and pale skin. If you're experiencing severe fatigue or new symptoms, please contact your healthcare provider. Would you like to use our symptom checker tool?";
    }
    
    if (lowerMessage.includes('treatment') || lowerMessage.includes('therapy')) {
      return "Treatment for aplastic anemia depends on the severity and your age. Options include immunosuppressive therapy (like ATG and cyclosporine) or stem cell transplantation. Your medical team will consider factors like your blood counts, age, and availability of donors. It's important to follow all treatment recommendations and report any side effects. Do you have specific questions about your treatment plan?";
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('prognosis')) {
      return "Your current risk assessment shows high-risk factors due to severe pancytopenia and bone marrow hypocellularity. However, with proper treatment, many patients with aplastic anemia can achieve good outcomes. Factors that affect prognosis include age, severity of blood counts, and response to treatment. Would you like me to review your specific risk factors?";
    }
    
    if (lowerMessage.includes('infection') || lowerMessage.includes('fever')) {
      return "With aplastic anemia, your immune system is compromised due to low white blood cell counts. Any fever over 100.4°F (38°C) should be treated as a medical emergency. Call your healthcare provider immediately if you develop fever, chills, or signs of infection. Prevention is key - practice good hand hygiene and avoid crowds when possible.";
    }
    
    if (lowerMessage.includes('bleeding') || lowerMessage.includes('bruising')) {
      return "Easy bruising and bleeding are common with aplastic anemia due to low platelet counts. Watch for unusual bruising, nosebleeds, bleeding gums, or small red spots on your skin (petechiae). Avoid activities that could cause injury, and contact your healthcare provider if you experience heavy bleeding or notice new bruising patterns.";
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('results')) {
      return "I can help you understand your medical reports and test results. Your most recent bone marrow biopsy showed hypocellular marrow consistent with severe aplastic anemia. Your CBC trends show continued low counts across all cell lines. Would you like me to walk you through specific values or upload a new report for analysis?";
    }
    
    const defaultResponses = [
      "I'm here to help you understand your condition and navigate your care. You can ask me about your test results, symptoms, treatment options, or general questions about aplastic anemia.",
      "As your AI health assistant, I can provide information about your condition, help interpret test results, and guide you to appropriate resources. What would you like to know?",
      "I have access to your medical information and can help explain your diagnosis, treatment plan, and monitoring schedule. How can I assist you today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'bot',
        message: generateBotResponse(newMessage),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "What are my latest blood count results?",
    "Explain my treatment options",
    "Check my symptom assessment",
    "What should I watch for?",
    "Schedule next appointment"
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-medical-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-medical-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Marrow AI</h3>
                <p className="text-xs text-gray-600">Your medical assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-medical-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Hi! I&apos;m your AI medical assistant. I can help you understand your condition, 
                      interpret test results, and answer questions about aplastic anemia.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Quick actions:</p>
                      {quickActions.slice(0, 3).map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setNewMessage(action);
                            handleSendMessage();
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-medical-600 hover:bg-medical-50 rounded-md transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-medical-100 ml-2' 
                            : 'bg-gray-100 mr-2'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4 text-medical-600" />
                          ) : (
                            <Bot className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className={`px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-medical-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your condition, symptoms, or results..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-sm"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {quickActions.slice(0, 2).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNewMessage(action);
                        setTimeout(handleSendMessage, 100);
                      }}
                      className="px-2 py-1 text-xs text-medical-600 bg-medical-50 hover:bg-medical-100 rounded-md transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
