// /Users/macbookair/Documents/IllusionTech-Development/app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Message, { IMessage, IMessageDocument } from '@/lib/models/Message';
import { getPusherServer } from '@/lib/pusher';
import { CoreMessage, streamText, Message as VercelAIMessage } from 'ai';
import { services } from '@/lib/data/services';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * GET /api/chat
 * Fetches all messages for a given session ID.
 */
export async function GET(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const messagesFromDb: IMessageDocument[] = await Message.find({ sessionId }).sort({ timestamp: 1 }).lean();

    const vercelMessages: VercelAIMessage[] = messagesFromDb.map((msg) => ({
      id: msg._id.toString(),
      content: msg.text,
      role: msg.sender === 'user' ? 'user' : 'assistant',
    }));

    return NextResponse.json(vercelMessages);
  } catch (error) {
    console.error('GET /api/chat error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

const generateServicesForPrompt = () => {
  const webDevPackages = services.filter((s) => s.type === 'web-development');
  const supportService = services.find((s) => s.id === 'support-basic'); // Use one as representative

  let servicesPrompt = '# Service Packages (All prices are in Trinidad and Tobago Dollars - TTD)\n\n';
  webDevPackages.forEach((service, index) => {
    // Use a more descriptive name for the pro package in the prompt
    const serviceName = service.id === 'pro' ? 'Pro Website / Custom Application' : service.name;
    servicesPrompt += `## ${index + 1}. ${serviceName} Package\n`;
    servicesPrompt += `- **Price:** ${service.price}\n`;
    servicesPrompt += `- **Ideal For:** ${service.audience}\n`;
    servicesPrompt += `- **Description:** ${service.longDescription}\n`;
    servicesPrompt += `- **Key Features:** ${service.keyFeatures.map((f) => f.title).join(', ')}.\n`;
    servicesPrompt += `- **Timeline:** ${service.timeline}.\n\n`;
  });

  servicesPrompt += '# Other Services\n\n';
  if (supportService) {
    servicesPrompt += `## Support & Maintenance Plans\n`;
    servicesPrompt += `- **Description:** Keep your website secure, fast, and up-to-date with our flexible monthly maintenance plans. We handle the technical details so you can focus on your business.\n`;
    servicesPrompt += `- **Call to Action:** If a user asks about maintenance or ongoing support, guide them by saying "We offer flexible monthly maintenance plans to keep your site running smoothly. You can learn more about them on our Support & Maintenance page."\n\n`;
  }

  return servicesPrompt;
};

/**
 * POST /api/chat
 * Receives a user message and streams back a bot response.
 */
let google: ReturnType<typeof createGoogleGenerativeAI> | undefined;

function getGoogleAI() {
  if (google) return google;
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (apiKey) {
    return (google = createGoogleGenerativeAI({
      apiKey,
      // This is a crucial fix: Force the SDK to use the stable v1 API endpoint.
      baseURL: 'https://generativelanguage.googleapis.com/v1/models',
    }));
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const googleAI = getGoogleAI();
    if (!googleAI) {
      console.error('Server configuration error: GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not found in process.env.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing Google API Key.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }



    const {
      messages,
      sessionId,
      timezone,
      socket_id,
    }: { messages: CoreMessage[]; sessionId: string; timezone: string; socket_id: string } = await request.json();

    if (!sessionId || messages.length === 0) {
      return NextResponse.json({ error: 'Session ID and messages are required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    let userMessageContent = '';
    if (typeof lastMessage.content === 'string') {
      userMessageContent = lastMessage.content;
    } else {
      const textPart = lastMessage.content.find(part => part.type === 'text');
      userMessageContent = textPart?.text ?? '';
    }

    // Save the user's message to the database immediately
    try {
      await connectToDB();
      const userMessage = await new Message({
        sessionId,
        text: userMessageContent,
        sender: 'user',
        timestamp: new Date(),
        timezone,
      }).save();

      // Trigger Pusher to update other clients
      await getPusherServer().trigger(
        `chat-${sessionId}`,
        'new-message',
        { ...userMessage.toObject(), _id: userMessage._id.toString() },
        { socket_id }
      );
    } catch (dbError) {
      console.error('Warning: Error saving user message or triggering Pusher:', dbError);
    }

    // Get AI response from Gemini
    const result = await streamText({
          // Reverting to 'gemini-1.5-flash'. It's more cost-effective and has a
      // more generous free-tier rate limit, which helps avoid quota errors.
      model: googleAI('gemini-1.5-flash', {
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }), system: `You are a friendly, professional, and highly knowledgeable sales and support assistant for IllusionTech. Your primary goal is to engage potential clients, answer their questions accurately, and guide them towards a consultation or a custom quote. You must act as an expert on IllusionTech's services.

      # Core Identity: IllusionTech
      - **Founder:** Narendra Ramnath, a passionate full-stack developer.
      - **Location:** Based in Trinidad and Tobago.
      - **Mission:** To craft bespoke, high-performance digital experiences. We don't use templates; every project is a unique, handcrafted solution.
      - **Core Values:** Commitment to Quality, a Client-Centric Approach, and Innovation.
      - **Technology Stack:** We specialize in modern, powerful technologies like Next.js, React, TypeScript, and Tailwind CSS to build fast, secure, and scalable websites and applications.

      ${generateServicesForPrompt()}
      # Conversation Strategy & Your Role
      - **Tone:** Be professional, but also approachable and encouraging. Use clear, simple language. Avoid overly technical jargon unless the user asks for it.
      - **Answering Questions:** Use the information provided above as your single source of truth.
        - **General Questions:** If a user asks a general web development question (e.g., 'what is SEO?'), answer it clearly and then smoothly transition to how IllusionTech's services can help them with it.
        - **Service Questions:** When asked about a service, provide the description and key features.
        - **Pricing Questions:** When asked for a price, ALWAYS state the price range and currency (e.g., "$500 - $700 TTD"). Immediately follow up by explaining that it's an estimate and guide them toward a custom quote. For example: "The Starter Website package ranges from $800 to $1,300 TTD. The final price depends on your specific requirements. Would you like to get a precise quote?"
        - **Technical Questions:** If you don't know the answer to a specific technical question, be honest. Say: "That's a great, detailed question that would be best answered by our lead developer. Would you like to schedule a free consultation to dive into the technical specifics?"
      - **Primary Goal & Calls to Action (CTAs):** Your main objective is to convert interest into a lead. Always look for opportunities to guide the user to the next step.
        - "We can definitely help with that. The best next step would be to get a custom quote. You can do that through our contact page."
        - "It sounds like you have a clear vision. Would you be interested in a free 15-minute consultation to discuss how we can bring it to life?"

      # Strict Boundaries
      - **NEVER** make up services, features, or pricing. Stick strictly to the information provided here.
      - **NEVER** promise specific delivery dates outside the estimated timelines.
      - **NEVER** provide technical advice or code snippets. Defer to the development team.
      - **NEVER** discuss competitors.`,
      messages: messages,
            maxTokens: 2048,
    });

    // The version of the `ai` package being used has a `StreamTextResult` type
    // where the method is named `toAIStreamResponse`. This is a workaround for
    // the underlying dependency conflict in the project.
    return result.toAIStreamResponse();
  } catch (error) {
    console.error('FATAL ERROR in POST /api/chat:', error);
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
