import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const generateResponse = (userMessage: string): string => {
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
      
      return "I'm here to help you understand your condition and navigate your care. You can ask me about your test results, symptoms, treatment options, or general questions about aplastic anemia. How can I assist you today?";
    };

    const botResponse = generateResponse(message);

    return NextResponse.json({
      success: true,
      data: {
        messageId: Math.random().toString(36).substr(2, 9),
        response: botResponse,
        timestamp: new Date().toISOString(),
        context: context || {}
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Chat response failed' },
      { status: 500 }
    );
  }
}
