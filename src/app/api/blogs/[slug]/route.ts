import { NextRequest, NextResponse } from "next/server";

// Mock blog data (same as in main blogs route)
const mockBlogs = [
  {
    id: 1,
    title: "Complete Guide to Property Registration in Delhi",
    slug: "property-registration-delhi-guide",
    excerpt: "Learn the step-by-step process of registering property in Delhi, required documents, fees, and timeline.",
    bodyMd: `# Complete Guide to Property Registration in Delhi

Property registration is a crucial legal process that transfers ownership from seller to buyer. Here's everything you need to know:

## Required Documents

1. **Sale Deed** - Properly drafted and printed on stamp paper
2. **Identity Proof** - Aadhaar, PAN card, Passport
3. **Address Proof** - Utility bills, rental agreement
4. **PAN Card** - For both buyer and seller
5. **Property Documents** - Previous sale deed, title deed, encumbrance certificate
6. **NOC** - From housing society (if applicable)

## Registration Process

### Step 1: Obtain Stamp Duty Payment
- Calculate stamp duty (4-6% of property value for men, 4% for women)
- Pay online through Delhi government portal or at designated banks
- Obtain stamp duty receipt

### Step 2: Visit Sub-Registrar Office
- Book appointment online at delhi.gov.in
- Visit office with all documents
- Both parties (buyer and seller) must be present

### Step 3: Document Verification
- Submit sale deed and supporting documents
- Biometric verification of parties
- Document scrutiny by registrar

### Step 4: Payment of Registration Fee
- 1% of property value (capped at ₹30,000 in Delhi)
- Pay at sub-registrar office

### Step 5: Document Registration
- Final registration after verification
- Receive registered documents in 7-15 days

## Fees Structure

| Component | Rate | Cap |
|-----------|------|-----|
| Stamp Duty (Men) | 6% | No cap |
| Stamp Duty (Women) | 4% | No cap |
| Registration Fee | 1% | ₹30,000 |

## Timeline

- **Normal Process**: 7-15 days
- **Tatkal Process**: 3-5 days (additional ₹10,000)

## Important Tips

1. Verify property ownership through encumbrance certificate
2. Check for pending dues (property tax, maintenance)
3. Ensure NOC from society/builder
4. Get legal advice if buying under-construction property
5. Check RERA registration for new projects

## Common Mistakes to Avoid

- Not verifying property documents thoroughly
- Incorrect calculation of stamp duty
- Missing required documents
- Not checking for property disputes
- Skipping legal consultation

## Contacts

- **DDA**: 011-23760031
- **MCD**: 1800-11-0093
- **Sub-Registrar Office**: 011-23817248

---

*Disclaimer: This is general guidance. Please consult with a property lawyer for your specific case.*`,
    tags: ["Property Registration", "Delhi", "Legal", "Guide"],
    heroUrl: null,
    status: "published",
    publishedAt: "2025-01-15T10:00:00Z",
    author: {
      id: 1,
      name: "Priya Sharma",
    },
  },
  {
    id: 2,
    title: "How to Convert Agricultural Land to Residential in Rajasthan",
    slug: "convert-agricultural-land-rajasthan",
    excerpt: "A comprehensive guide on converting agricultural land to residential use in Rajasthan, including fees, procedures, and timeline.",
    bodyMd: `# How to Convert Agricultural Land to Residential in Rajasthan

Converting agricultural land to residential use is a common requirement for property development. This guide covers the complete process in Rajasthan.

## Eligibility Criteria

- Land must be located in areas designated for development in master plan
- No agricultural activities in last 3 years
- Clear title and ownership
- No pending disputes

## Required Documents

1. Land ownership documents (Jamabandi, Khasra)
2. NOC from Agriculture Department
3. Site plan/map approved by licensed surveyor
4. Affidavit on ₹100 stamp paper
5. Identity and address proof
6. Payment receipt of application fee

## Step-by-Step Process

### Step 1: Obtain NOC from Agriculture Department
- Visit District Agriculture Officer
- Submit application with land documents
- Timeline: 15-30 days
- Fee: ₹500-₹1,000

### Step 2: Submit Conversion Application
- Approach Sub-Divisional Magistrate (SDM)
- Submit complete application with NOC
- Pay application fee: ₹2,000-₹5,000

### Step 3: Site Inspection
- Revenue official conducts site visit
- Verifies land boundaries and use
- Prepares inspection report

### Step 4: Pay Conversion Fee
- Calculate based on location and land value
- Urban areas: 50% of land value
- Peri-urban areas: 25% of land value
- Rural areas: 10% of land value
- Payment through online portal or treasury

### Step 5: Approval from District Collector
- File reviewed by collector office
- May require additional documents
- Timeline: 30-60 days

### Step 6: Update Land Records
- Visit Tehsil office
- Submit approval order
- Update in revenue records (Jamabandi)
- Obtain updated land documents

## Fee Structure

| Location | Conversion Fee |
|----------|----------------|
| Urban (inside municipal limits) | 50% of land value |
| Peri-urban | 25% of land value |
| Rural | 10% of land value |

**Additional Costs:**
- Application fee: ₹2,000-₹5,000
- Document fees: ₹500-₹1,000
- Legal consultation: ₹10,000-₹50,000

## Timeline

- **Total Duration**: 3-6 months
- Can vary by district and pending cases

## Important Considerations

1. **Master Plan**: Check if land falls in residential zone
2. **Distance from Highway**: National highways have restrictions
3. **Environmental Clearance**: May be required for large plots
4. **FAR/FSI Limits**: Check construction limits
5. **Water and Electricity**: Plan for connections

## Common Reasons for Rejection

- Land in green belt or agricultural preservation zone
- Active agricultural activities
- Disputed ownership
- Non-payment of dues
- Incomplete documentation

## Post-Conversion Steps

1. Update property tax records
2. Apply for building plan approval
3. Obtain water and electricity connections
4. Check for compound wall requirements
5. Register with local municipal body

## Useful Contacts

- **District Collector Office**: 0141-2227011 (Jaipur)
- **Revenue Department**: 0141-2227359
- **Agriculture Department**: 0141-2227456
- **SDM Office**: Contact local office

---

*Disclaimer: Procedures and fees may vary. Consult a property lawyer for your specific situation.*`,
    tags: ["Land Conversion", "Rajasthan", "Legal", "Agriculture"],
    heroUrl: null,
    status: "published",
    publishedAt: "2025-01-10T14:30:00Z",
    author: {
      id: 2,
      name: "Amit Kumar",
    },
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const blog = mockBlogs.find((b) => b.slug === slug);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog });
  } catch (error: any) {
    console.error("Blog detail API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog" },
      { status: 500 }
    );
  }
}