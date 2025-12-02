import { db } from '@/db';
import { blogPosts } from '@/db/schema';

async function main() {
    const sampleBlogs = [
        {
            authorId: 'user_admin_hub4estate',
            title: 'Understanding RERA: Complete Guide for Homebuyers in 2024',
            slug: 'understanding-rera-complete-guide-homebuyers-2024',
            excerpt: 'Learn everything about Real Estate Regulation and Development Act (RERA) and how it protects your rights as a homebuyer in India.',
            bodyMd: `# Understanding RERA: Complete Guide for Homebuyers in 2024

## What is RERA?

The Real Estate (Regulation and Development) Act, 2016 (RERA) is a landmark legislation that aims to protect homebuyers and boost investment in the real estate sector.

## Key Benefits for Homebuyers

1. **Project Registration**: All projects must be registered with RERA
2. **Transparency**: Developers must disclose all project details
3. **Escrow Account**: 70% of funds in separate account
4. **Timely Delivery**: Penalties for delays
5. **Quality Assurance**: 5-year defect liability period

## How to Check RERA Registration

Visit your state's RERA website and verify:
- Project registration number
- Builder credentials
- Project timelines
- Carpet area details

## Common RERA Violations

- Delayed possession
- Change in approved plans
- Hidden charges
- Quality issues

## Filing a RERA Complaint

If you face issues, you can file a complaint with your state RERA authority within the prescribed time limit.

Stay informed and protected!`,
            tags: JSON.stringify(['RERA', 'Homebuyers', 'Real Estate Law', 'Property Rights']),
            heroUrl: null,
            status: 'published',
            publishedAt: '2024-01-15T00:00:00Z',
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
        },
        {
            authorId: 'user_admin_hub4estate',
            title: 'Top 10 Tiles Brands in India 2024: Quality & Price Comparison',
            slug: 'top-10-tiles-brands-india-2024-quality-price',
            excerpt: 'Comprehensive comparison of leading tiles manufacturers in India, including Kajaria, Somany, Nitco, and more. Find the best tiles for your project.',
            bodyMd: `# Top 10 Tiles Brands in India 2024

## 1. Kajaria Ceramics
- **Rating**: 4.8/5
- **Price Range**: ₹40-150/sqft
- **Best For**: Premium vitrified tiles
- **Warranty**: 10 years

## 2. Somany Ceramics
- **Rating**: 4.6/5
- **Price Range**: ₹35-120/sqft
- **Best For**: Designer wall tiles

## 3. Nitco Tiles
- **Rating**: 4.5/5
- **Price Range**: ₹45-130/sqft
- **Best For**: Large format tiles

## 4. Johnson Tiles
- **Rating**: 4.4/5
- **Price Range**: ₹38-110/sqft

## 5. Asian Granito
- **Rating**: 4.3/5
- **Price Range**: ₹35-100/sqft

## How to Choose the Right Tiles

### Consider These Factors:
1. **Area of Application**: Floor vs Wall
2. **Traffic**: High traffic vs Low traffic
3. **Moisture**: Wet vs Dry areas
4. **Aesthetics**: Modern vs Traditional
5. **Budget**: Premium vs Economy

## Installation Tips

- Always buy 10% extra for wastage
- Check water absorption rate
- Verify grade and quality certificate
- Hire experienced tile layers

Happy tiling!`,
            tags: JSON.stringify(['Tiles', 'Brands', 'Home Improvement', 'Flooring']),
            heroUrl: null,
            status: 'published',
            publishedAt: '2024-01-20T00:00:00Z',
            createdAt: '2024-01-18T00:00:00Z',
            updatedAt: '2024-01-20T00:00:00Z',
        },
        {
            authorId: 'user_admin_hub4estate',
            title: 'How to Convert Agricultural Land to Residential: Complete Process',
            slug: 'convert-agricultural-land-residential-process',
            excerpt: 'Step-by-step guide to converting agricultural land to residential property in India. Learn about regulations, approvals, and documentation required.',
            bodyMd: `# Land Conversion: Agricultural to Residential

## Understanding Land Conversion

Converting agricultural land to residential use requires multiple approvals from government authorities.

## Step-by-Step Process

### Step 1: Check Eligibility
- Land should be in development zone
- Must not be in protected/green belt area
- Verify in local master plan

### Step 2: Obtain NA Permission
- Apply to Revenue Department
- Submit land documents
- Pay conversion charges (varies by state)

### Step 3: Required Documents
1. Original land documents
2. 7/12 extract (land record)
3. Property card
4. Location map
5. Proposed layout plan
6. NOC from gram panchayat

### Step 4: Timeline
- Application processing: 3-6 months
- Final approval: 6-12 months

### Step 5: Costs Involved
- Conversion charges: 25-50% of ready reckoner rate
- Processing fees
- Legal fees
- Documentation charges

## State-Specific Rules

### Maharashtra
- Apply through DIPR portal
- Premium: 50% of market value

### Rajasthan
- Apply to Revenue Department
- Premium: 25-40% of land value

### Karnataka
- Apply to DC office
- Premium: 30-50% of guidance value

## Common Mistakes to Avoid

1. Buying land without conversion feasibility
2. Not checking master plan
3. Incomplete documentation
4. Not paying proper conversion charges

Consult a local real estate lawyer for specific guidance!`,
            tags: JSON.stringify(['Land Conversion', 'Agricultural Land', 'Property Law', 'Real Estate']),
            heroUrl: null,
            status: 'published',
            publishedAt: '2024-01-25T00:00:00Z',
            createdAt: '2024-01-22T00:00:00Z',
            updatedAt: '2024-01-25T00:00:00Z',
        },
        {
            authorId: 'user_admin_hub4estate',
            title: 'GST on Construction Materials: Complete Guide 2024',
            slug: 'gst-construction-materials-guide-2024',
            excerpt: 'Understand GST rates applicable on cement, steel, tiles, paint, and other building materials. Includes input tax credit rules for builders.',
            bodyMd: `# GST on Construction Materials 2024

## GST Rates on Common Materials

### Cement
- **Rate**: 28%
- **Category**: Highest slab
- Applicable on all types (OPC, PPC, White)

### Steel & TMT Bars
- **Rate**: 18%
- Includes all grades (Fe500, Fe550)

### Tiles & Sanitaryware
- **Rate**: 28%
- Ceramic, vitrified, porcelain tiles
- Sanitary fittings, bathroom fixtures

### Paint
- **Rate**: 28%
- Interior and exterior emulsions
- Enamel, putty, primer

### Electrical Items
- **Rate**: 18-28%
- Switches: 28%
- Wires: 18%
- MCBs: 18%

### Plywood & Doors
- **Rate**: 18%
- Marine, commercial plywood
- Flush doors, wooden doors

## Input Tax Credit (ITC)

### Who Can Claim?
- Registered contractors
- Builders and developers
- Not available for individual homeowners

### Conditions for ITC:
1. Valid tax invoice required
2. Goods used for taxable supply
3. Tax paid to government
4. Return filed on time

## GST on Property

### Under Construction Property
- **Rate**: 5% (without ITC)
- **Rate**: 1% (affordable housing)

### Ready to Move Property
- **No GST**: On completed properties

## Compliance Tips

1. Maintain proper invoices
2. Verify GST number of supplier
3. File returns on time
4. Keep records for 6 years

Stay GST compliant!`,
            tags: JSON.stringify(['GST', 'Taxation', 'Construction Materials', 'Building Materials']),
            heroUrl: null,
            status: 'published',
            publishedAt: '2024-02-01T00:00:00Z',
            createdAt: '2024-01-28T00:00:00Z',
            updatedAt: '2024-02-01T00:00:00Z',
        },
        {
            authorId: 'user_admin_hub4estate',
            title: 'Vastu Tips for Modern Homes: Science Meets Tradition',
            slug: 'vastu-tips-modern-homes-science-tradition',
            excerpt: 'Practical Vastu Shastra principles for contemporary home design. Balance ancient wisdom with modern architecture for positive energy.',
            bodyMd: `# Vastu Tips for Modern Homes

## Understanding Vastu Shastra

Vastu is the ancient Indian science of architecture that harmonizes living spaces with natural elements.

## Main Entrance

### Best Directions
- **North**: Prosperity and wealth
- **East**: Health and happiness
- **Northeast**: Most auspicious

### Avoid
- South or Southwest main entrance
- Obstruction in front of door

## Room Placement

### Master Bedroom
- **Best**: Southwest corner
- **Bed Direction**: Head towards South or East
- **Avoid**: Mirrors facing bed

### Kitchen
- **Best**: Southeast corner
- **Cooking Direction**: Face East
- **Avoid**: Kitchen under or above bedroom

### Living Room
- **Best**: North or East direction
- **Furniture**: Heavy furniture in Southwest
- **Avoid**: Clutter near entrance

### Bathroom
- **Best**: Northwest or Southeast
- **Avoid**: Northeast corner

## Colors According to Vastu

### Room-wise Recommendations
- **Bedroom**: Light pink, blue, green
- **Kitchen**: Yellow, orange, red
- **Living Room**: White, yellow, light green
- **Study**: Green, light yellow

## Water Elements

### Placement
- **Overhead Tank**: Southwest
- **Underground Water**: Northeast
- **Fountain**: North or Northeast

## Modern Vastu Adaptations

### For Apartments
- Use plants in Northeast
- Keep balcony in North or East
- Place heavy items in Southwest

### For Working Professionals
- Home office in West or Southwest
- Face North or East while working
- Keep workstation clutter-free

## Common Myths vs Reality

**Myth**: Vastu is superstition
**Reality**: Based on solar movement and magnetic fields

**Myth**: Complete Vastu compliance is necessary
**Reality**: Follow major principles, minor adjustments okay

Create your harmonious living space!`,
            tags: JSON.stringify(['Vastu Shastra', 'Home Design', 'Interior Design', 'Architecture']),
            heroUrl: null,
            status: 'published',
            publishedAt: '2024-02-05T00:00:00Z',
            createdAt: '2024-02-02T00:00:00Z',
            updatedAt: '2024-02-05T00:00:00Z',
        },
        {
            authorId: 'user_admin_hub4estate',
            title: 'Building Material Price Trends 2024: What to Expect',
            slug: 'building-material-price-trends-2024',
            excerpt: 'Analysis of construction material prices in India. Market trends for cement, steel, tiles, and tips to optimize your construction budget.',
            bodyMd: `# Building Material Price Trends 2024

## Current Market Overview

The construction materials sector has seen significant price fluctuations in 2024 due to global supply chain dynamics.

## Cement Prices

### Current Rates (Per 50kg bag)
- **OPC 53 Grade**: ₹380-420
- **PPC**: ₹350-390
- **White Cement**: ₹600-650

### Trend
↑ 5-8% increase expected by March 2024

### Factors Affecting Prices
- Coal prices
- Freight costs
- Seasonal demand

## Steel Prices

### TMT Bars (Per kg)
- **8mm**: ₹55-62
- **10mm**: ₹58-65
- **12mm**: ₹60-68

### Trend
→ Stable to slight increase

## Tiles Prices

### Per Square Foot
- **Vitrified**: ₹35-95
- **Ceramic**: ₹25-65
- **Marble**: ₹180-450

### Trend
↑ Premium segment growing

## Paint Prices

### Per Litre
- **Interior Emulsion**: ₹320-580
- **Exterior**: ₹350-620
- **Enamel**: ₹280-450

### Trend
↑ 3-5% increase

## Money-Saving Tips

### 1. Bulk Buying
- Order materials together
- Negotiate better rates
- Reduce delivery charges

### 2. Seasonal Planning
- Buy cement in summer
- Order tiles in monsoon
- Purchase steel off-season

### 3. Alternative Options
- Consider local brands
- Mix premium with economy
- Use cost-effective alternatives

### 4. Direct Purchase
- Buy from manufacturers
- Skip middlemen
- Join builder groups

## Regional Variations

### North India
- Higher transport costs
- Winter demand surge

### South India
- Stable supply
- Competitive pricing

### West India
- Manufacturing hubs
- Better availability

## Price Forecast

### Q1 2024 (Jan-Mar)
- Cement: Slight increase
- Steel: Stable
- Tiles: Seasonal discount

### Q2 2024 (Apr-Jun)
- Peak construction season
- Prices likely to rise
- Plan purchases in advance

Plan your construction budget wisely!`,
            tags: JSON.stringify(['Prices', 'Market Trends', 'Construction Materials', 'Budget Planning']),
            heroUrl: null,
            status: 'published',
            publishedAt: '2024-02-10T00:00:00Z',
            createdAt: '2024-02-08T00:00:00Z',
            updatedAt: '2024-02-10T00:00:00Z',
        },
    ];

    await db.insert(blogPosts).values(sampleBlogs);
    console.log('✅ Blog posts seeded: 6 blogs created');
}

main().catch((error) => {
    console.error('❌ Blogs seeder failed:', error);
});
