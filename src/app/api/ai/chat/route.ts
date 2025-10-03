import { NextRequest, NextResponse } from "next/server";

// OpenAI integration for AI Assistant
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type BotMode = "knowledge" | "procurement" | "expert" | "dispute" | "general";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  mode?: BotMode;
  language?: string;
  history?: ChatMessage[];
}

// System prompts for different bot modes
const systemPrompts: Record<BotMode, string> = {
  knowledge: `You are HubAI Knowledge Bot, an expert in Indian real estate laws, regulations, and procedures. 
You help users understand:
- Property registration processes
- Land conversion procedures (agricultural to residential, etc.)
- RERA regulations and compliance
- FSI/FAR rules
- Tax rebates and benefits
- Government schemes
- Municipal planning and approvals

Always provide:
1. Step-by-step guidance
2. Required documents
3. Approximate fees/costs
4. Relevant government contacts
5. Legal considerations
6. Timeline estimates

Cite sources when possible and add disclaimers for legal advice.`,

  procurement: `You are HubAI Procurement Bot, helping users find and compare building materials and services.
You assist with:
- Finding specific products (tiles, cement, fixtures, etc.)
- Comparing prices and specifications
- Broadcasting RFQ (Request for Quote) to verified vendors
- Suggesting alternatives and substitutes
- Checking availability and delivery options
- Negotiating bulk discounts

Always ask for:
1. Specific product details (brand, model, specifications)
2. Quantity required
3. Location/delivery address
4. Timeline/urgency
5. Budget range

Then help connect with verified suppliers and get best quotes.`,

  expert: `You are HubAI Expert Finder, helping users find verified professionals in real estate.
You help locate:
- Architects (residential, commercial, luxury, etc.)
- Interior designers
- Contractors and builders
- Plumbers, electricians, carpenters
- Property lawyers
- Valuers and surveyors
- Project managers

Always ask for:
1. Type of professional needed
2. Project details and scope
3. Location
4. Budget range
5. Specific expertise or experience required
6. Timeline

Then match with verified professionals based on ratings, past work, and expertise.`,

  dispute: `You are HubAI Dispute Resolution Assistant, guiding users through conflict resolution.
You help with:
- Builder-buyer disputes
- Contractor payment issues
- Defect and warranty claims
- Delay compensation
- Documentation for legal proceedings
- RERA complaints
- Consumer court procedures
- Arbitration processes

Provide:
1. Initial assessment of the situation
2. Documentation requirements
3. Available recourse options
4. Step-by-step complaint filing process
5. Expected timelines
6. Relevant authorities and contacts

Always recommend consulting a lawyer for serious matters.`,

  general: `You are HubAI, the intelligent assistant for Hub4Estate - India's comprehensive real estate platform.
You can help with:
- Finding building materials and getting quotes
- Understanding property laws and procedures
- Connecting with verified professionals
- Project planning and management
- City insights and regulations
- Community questions

Ask users what they need help with and guide them to the right specialized bot mode if needed.`,
};

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, mode = "general", language = "en", history = [] } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // If no OpenAI key, return a mock response
    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        response: getMockResponse(message, mode),
        mode,
        sources: getMockSources(mode),
      });
    }

    // Build conversation history
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompts[mode] },
      ...history,
      { role: "user", content: message },
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    return NextResponse.json({
      response: assistantMessage,
      mode,
      sources: getMockSources(mode),
      disclaimer: getDisclaimer(mode),
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}

// Mock responses for demo/testing
function getMockResponse(message: string, mode: BotMode): string {
  const lowerMessage = message.toLowerCase();

  if (mode === "knowledge") {
    if (lowerMessage.includes("convert") && lowerMessage.includes("land")) {
      return `**How to Convert Agricultural Land to Residential in Rajasthan:**

**Steps:**
1. **Obtain NOC** from Agriculture Department
2. **Submit Application** to Sub-Divisional Magistrate (SDM)
3. **Pay Conversion Fees** (varies by location, typically 10-50% of land value)
4. **Get Approval** from District Collector
5. **Update Land Records** in Tehsil office

**Required Documents:**
- Original land documents (Jamabandi, Khasra)
- NOC from Agriculture Department
- Site plan/map
- Affidavit on stamp paper
- Identity and address proof
- Payment receipt of conversion fee

**Timeline:** 3-6 months (varies by district)

**Fees:** ₹10,000 - ₹5,00,000 (depends on location and land value)

**Important Contacts:**
- District Collector Office: 0141-2227011 (Jaipur)
- Revenue Department: 0141-2227359

⚠️ **Disclaimer:** This is general guidance. Consult with a property lawyer for your specific case.

**Sources:**
- Rajasthan Land Revenue Act
- Urban Land Ceiling Act
- Local municipal guidelines`;
    }

    if (lowerMessage.includes("rera") || lowerMessage.includes("registration")) {
      return `**RERA (Real Estate Regulatory Authority) Overview:**

**What is RERA?**
RERA protects homebuyers and ensures transparency in real estate transactions.

**Key Requirements:**
- All projects >500 sqm must be registered
- Builders must deposit 70% of funds in escrow
- Standard carpet area definition
- Mandatory disclosure of project details
- Defect liability period of 5 years

**How to Register Property:**
1. Visit state RERA website
2. Check project RERA number
3. Verify builder credentials
4. Review approved plans
5. Check complaint history

**File Complaint:**
- Online portal: https://rera.rajasthan.gov.in
- Within 1 year of possession
- Required: Sale agreement, payment receipts, correspondence

**Timeline for Resolution:** 60-90 days

⚠️ **Disclaimer:** Consult a real estate lawyer for legal matters.`;
    }
  }

  if (mode === "procurement") {
    if (lowerMessage.includes("tile") || lowerMessage.includes("wallpaper") || lowerMessage.includes("material")) {
      return `**I can help you find the best deals! 📦**

To get you accurate quotes, I need a few details:

1. **Product Specification:**
   - Brand preference? (e.g., Kajaria, Asian Paints, Jaquar)
   - Specific model/SKU if known
   - Size/dimensions
   
2. **Quantity:** How much do you need?

3. **Location:** Where should it be delivered?

4. **Timeline:** When do you need it?

5. **Budget:** Any price range in mind?

Once you provide these details, I'll:
✓ Search our database of 500+ verified vendors
✓ Broadcast your RFQ to matching suppliers
✓ Get you 3-5 competitive quotes within 2 hours
✓ Help you compare and choose the best offer

**Example Response Time:** Most vendors respond in 30-120 minutes!`;
    }
  }

  if (mode === "expert") {
    if (lowerMessage.includes("architect") || lowerMessage.includes("designer") || lowerMessage.includes("professional")) {
      return `**Finding the Right Professional for You 👷**

To match you with verified experts, please share:

1. **Type of Professional:**
   - Architect / Interior Designer
   - Contractor / Builder
   - Plumber / Electrician / Carpenter
   - Other specialist

2. **Project Details:**
   - Type (residential/commercial)
   - Scope (new construction/renovation/design)
   - Size (sq ft / number of rooms)

3. **Location:** Project location?

4. **Budget Range:** Estimated budget?

5. **Specific Requirements:**
   - Luxury/premium experience?
   - Particular style (modern/traditional)?
   - Past portfolio examples?

I'll find **verified professionals** with:
✓ KYC-verified profiles
✓ Ratings from past clients
✓ Portfolio of completed projects
✓ Transparent pricing

**Response Time:** You'll get 3-5 expert profiles within 1 hour!`;
    }
  }

  // Default response
  return `Hello! I'm HubAI, your intelligent assistant for all real estate needs. 

I can help you with:

🏛️ **Knowledge Bot** - Property laws, RERA, land conversion, tax benefits
📦 **Procurement** - Find materials, get quotes, compare prices  
👷 **Expert Finder** - Connect with verified professionals
⚖️ **Dispute Resolution** - Guidance on complaints and legal processes

What would you like help with today?`;
}

function getMockSources(mode: BotMode): string[] {
  const sources: Record<BotMode, string[]> = {
    knowledge: [
      "Rajasthan Land Revenue Act, 1956",
      "RERA Guidelines 2023",
      "Ministry of Housing and Urban Affairs",
    ],
    procurement: ["Hub4Estate Vendor Database", "Live Catalog Search"],
    expert: ["Hub4Estate Verified Professional Directory"],
    dispute: ["RERA Complaint Procedures", "Consumer Protection Act"],
    general: ["Hub4Estate Knowledge Base"],
  };

  return sources[mode] || [];
}

function getDisclaimer(mode: BotMode): string {
  if (mode === "knowledge" || mode === "dispute") {
    return "This information is for general guidance only. Please consult with a qualified lawyer for legal advice specific to your situation.";
  }
  return "Information provided is based on current data and may vary. Please verify details before making decisions.";
}