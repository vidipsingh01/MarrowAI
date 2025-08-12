'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    if (!apiKey) {
      return 'Error: API key is missing. Please contact support.';
    }

    const systemPrompt = `
      You are Marrow AI, a medical assistant specialized in aplastic anemia and bone marrow-related diseases. Your role is to provide accurate, empathetic, and concise information to patients about their condition, symptoms, test results, treatments, and risks associated with aplastic anemia and bone marrow disorders. Use the following guidelines to respond:

      - For questions about aplastic anemia or bone marrow, explain that aplastic anemia is a serious condition where the bone marrow fails to produce enough blood cells, leading to low red blood cells, white blood cells, and platelets. Highlight symptoms like fatigue, frequent infections, and easy bruising, and offer to assess symptoms or explain test results.
      - For blood count or CBC queries, note that low white blood cell count, hemoglobin, and platelets are consistent with aplastic anemia, and suggest discussing results with a hematologist. Offer to explain specific values.
      - For symptoms like fatigue, bruising, or infections, describe their relation to low blood counts and advise contacting a healthcare provider for severe symptoms. Recommend precautions like good hygiene for infections.
      - For treatment or therapy questions, mention options like immunosuppressive therapy (e.g., ATG, cyclosporine) or stem cell transplantation, tailored to severity and age. Encourage following medical advice and asking about treatment plans.
      - For risk or prognosis queries, explain that high-risk factors include severe pancytopenia and bone marrow hypocellularity, but good outcomes are possible with treatment. Offer to review specific risk factors.
      - For bleeding or bruising concerns, warn about low platelet counts causing easy bruising or bleeding, and advise avoiding injury and reporting heavy bleeding.
      - For report or result inquiries, offer to interpret reports (e.g., hypocellular marrow in biopsies or low CBC counts) and suggest uploading new reports for analysis.
      - For general queries, provide helpful responses about aplastic anemia, test results, or treatment options, and encourage specific questions.

      Use a supportive and professional tone. If the query is unrelated to aplastic anemia or bone marrow diseases, gently redirect to relevant topics or suggest consulting a healthcare provider. Here are example responses for context:

      - "Aplastic anemia is a rare but serious blood disorder where your bone marrow doesn't make enough new blood cells. This leads to low counts of red blood cells, white blood cells, and platelets. Early symptoms include fatigue, frequent infections, and easy bruising. Would you like me to help you assess your symptoms or explain your recent test results?"
      - "Based on your recent CBC results, your blood counts show some concerning values. Your white blood cell count, hemoglobin, and platelet levels are all below normal ranges. This pattern is consistent with your aplastic anemia diagnosis. I recommend discussing these results with your hematologist. Would you like me to explain what each value means?"
      - "Fatigue is one of the most common symptoms of aplastic anemia, caused by low red blood cell counts (anemia). Other symptoms to watch for include easy bruising, frequent infections, shortness of breath, and pale skin. If you're experiencing severe fatigue or new symptoms, please contact your healthcare provider. Would you like to use our symptom checker tool?"

      Now, respond to the user's message: "${userMessage}"
    `;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request. Please try again.';
      return botResponse.trim();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Sorry, something went wrong while processing your request. Please try again later.';
    }
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

    const botResponseText = await generateBotResponse(newMessage);
    const botResponse: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      type: 'bot',
      message: botResponseText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "What is Aplastic Anemia?",
    "Explain about symptoms of Aplastic Anemia",
    "Explain about different Bone Marrow Diseases",
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
          <span className="absolute top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-1/3 h-[600px]'
        }`}>
          <div className="flex items-center justify-between p-4 border-gray-200 bg-medical-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Marrow AI</h3>
                <p className="text-xs text-gray-600">Your medical assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200"
              >
                <X className="h-4 w-4 " />
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
                          className="block w-full text-left px-3 py-2 text-sm text-medical-600 hover:bg-medical-50 rounded-md transition-colors bg-gray-100 hover:bg-gray-200"
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
                              ? 'bg-gray-200 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap text-black">{message.message}</p>
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
                    className="px-3 hover:bg-gray-400 bg-gray-300"
                  >
                    <Send className="h-4 w-4 text-black hover:bg-g" />
                  </Button>
                </div>
                
                <div className="mt-2 flex gap-2">
                  {quickActions.slice(0, 2).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNewMessage(action);
                        setTimeout(handleSendMessage, 100);
                      }}
                      className="p-2 text-xs bg-gray-200 hover:bg-gray-300 text-medical-600 bg-medical-50 hover:bg-medical-100 rounded-md transition-colors"
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
