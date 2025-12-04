import { db } from "@/db";
import { 
  user, 
  profilesProvider, 
  catalogs, 
  blogPosts, 
  cityKnowledge, 
  projects,
  socialPosts,
  socialGroups,
  notifications
} from "@/db/schema";

async function seed() {
  console.log("🌱 Starting Hub4Estate seed...");

  try {
    // 1. Create sample users (consumers and providers)
    const users = [
      {
        id: "user_consumer_1",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        emailVerified: true,
        userType: "consumer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user_consumer_2",
        name: "Priya Sharma",
        email: "priya@example.com",
        emailVerified: true,
        userType: "consumer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user_provider_1",
        name: "Delhi Tiles & Marble Co.",
        email: "delhi.tiles@example.com",
        emailVerified: true,
        userType: "provider",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user_provider_2",
        name: "Jaipur Building Materials",
        email: "jaipur.build@example.com",
        emailVerified: true,
        userType: "provider",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user_provider_3",
        name: "Mumbai Cement Suppliers",
        email: "mumbai.cement@example.com",
        emailVerified: true,
        userType: "provider",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const userData of users) {
      await db.insert(user).values(userData).onConflictDoNothing();
    }
    console.log("✅ Created users");

    // 2. Create provider profiles
    const providers = [
      {
        userId: "user_provider_1",
        shopName: "Delhi Tiles & Marble Co.",
        phone: "+91-9876543210",
        address: "Shop 45, Kirti Nagar, New Delhi, 110015",
        lat: 28.6517178,
        lng: 77.1389452,
        categories: JSON.stringify(["Tiles", "Marble", "Granite", "Flooring"]),
        brands: JSON.stringify(["Kajaria", "Somany", "Johnson", "Nitco"]),
        logoUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
        kycStatus: "verified",
        trustScore: 92,
        description: "Premium tiles and marble supplier with 20+ years experience. Authorized dealer for leading brands.",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
        ]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        userId: "user_provider_2",
        shopName: "Jaipur Building Materials",
        phone: "+91-9876543211",
        address: "Plot 23, Jhotwara Industrial Area, Jaipur, 302012",
        lat: 26.9558,
        lng: 75.7956,
        categories: JSON.stringify(["Cement", "Sand", "Bricks", "Steel", "TMT Bars"]),
        brands: JSON.stringify(["UltraTech", "ACC", "Ambuja", "Shree", "TATA Tiscon"]),
        logoUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400",
        kycStatus: "verified",
        trustScore: 88,
        description: "Complete building materials solution. Bulk orders welcomed. Free delivery in Jaipur.",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
          "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800"
        ]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        userId: "user_provider_3",
        shopName: "Mumbai Cement Suppliers",
        phone: "+91-9876543212",
        address: "Godown 12, Turbhe MIDC, Navi Mumbai, 400705",
        lat: 19.0626,
        lng: 73.0165,
        categories: JSON.stringify(["Cement", "Ready-Mix Concrete", "Construction Chemicals"]),
        brands: JSON.stringify(["UltraTech", "ACC", "JSW", "Ramco"]),
        logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
        kycStatus: "verified",
        trustScore: 85,
        description: "ISO certified cement supplier. 24/7 delivery service. Bulk discounts available.",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
        ]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const provider of providers) {
      await db.insert(profilesProvider).values(provider).onConflictDoNothing();
    }
    console.log("✅ Created provider profiles");

    // 3. Create catalog items
    const catalogItems = [
      // Delhi Tiles & Marble
      {
        providerId: "user_provider_1",
        title: "Kajaria Premium Vitrified Tiles 800x800mm",
        brand: "Kajaria",
        sku: "KAJ-VIT-800-BG",
        description: "Premium quality vitrified tiles with high gloss finish. Perfect for living rooms and bedrooms. Water resistant and easy to maintain.",
        price: 65.50,
        currency: "INR",
        unit: "sq ft",
        moq: 100,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          size: "800x800mm",
          finish: "Glossy",
          thickness: "10mm",
          color: "Beige Marble Effect"
        }),
        city: "Delhi",
        deliveryRadiusKm: 50,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
        ]),
        popularityScore: 156,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: "user_provider_1",
        title: "Italian Marble White Carrara",
        brand: "Imported",
        sku: "IMP-MAR-CAR-WHT",
        description: "Authentic Italian Carrara marble. Premium grade with natural veining. Ideal for luxury homes and commercial spaces.",
        price: 450.00,
        currency: "INR",
        unit: "sq ft",
        moq: 200,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          origin: "Italy",
          finish: "Polished",
          thickness: "18mm",
          color: "White with Grey Veins"
        }),
        city: "Delhi",
        deliveryRadiusKm: 100,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        ]),
        popularityScore: 89,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: "user_provider_1",
        title: "Somany Bathroom Wall Tiles 300x600mm",
        brand: "Somany",
        sku: "SOM-WALL-300-CR",
        description: "Designer wall tiles for bathrooms. Waterproof and stain resistant. Easy to clean.",
        price: 38.00,
        currency: "INR",
        unit: "sq ft",
        moq: 150,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          size: "300x600mm",
          finish: "Matt",
          application: "Bathroom Walls",
          color: "Cream"
        }),
        city: "Delhi",
        deliveryRadiusKm: 50,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800"
        ]),
        popularityScore: 123,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      
      // Jaipur Building Materials
      {
        providerId: "user_provider_2",
        title: "UltraTech Cement OPC 53 Grade",
        brand: "UltraTech",
        sku: "ULT-CEM-OPC53-50",
        description: "Premium quality cement for all construction needs. High strength and durability. 53 Grade OPC as per IS 12269.",
        price: 420.00,
        currency: "INR",
        unit: "bag (50kg)",
        moq: 50,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          grade: "OPC 53",
          weight: "50kg",
          standard: "IS 12269",
          application: "All Construction"
        }),
        city: "Jaipur",
        deliveryRadiusKm: 80,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800"
        ]),
        popularityScore: 245,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: "user_provider_2",
        title: "TATA Tiscon TMT Bars Fe 500D",
        brand: "TATA Tiscon",
        sku: "TATA-TMT-500D-12",
        description: "High strength TMT bars with earthquake resistance. Fe 500D grade for superior ductility.",
        price: 58.50,
        currency: "INR",
        unit: "kg",
        moq: 500,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          grade: "Fe 500D",
          diameter: "12mm",
          length: "12m",
          standard: "IS 1786"
        }),
        city: "Jaipur",
        deliveryRadiusKm: 100,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"
        ]),
        popularityScore: 178,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: "user_provider_2",
        title: "Red Clay Bricks First Class",
        brand: "Local",
        sku: "BRICK-RED-FC",
        description: "First class red clay bricks. High compressive strength. Uniform size and shape.",
        price: 8.50,
        currency: "INR",
        unit: "piece",
        moq: 1000,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          class: "First Class",
          size: "230x110x75mm",
          material: "Red Clay",
          compressiveStrength: "10 N/mm²"
        }),
        city: "Jaipur",
        deliveryRadiusKm: 60,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800"
        ]),
        popularityScore: 201,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Mumbai Cement
      {
        providerId: "user_provider_3",
        title: "ACC Gold Water Resistant Cement",
        brand: "ACC",
        sku: "ACC-GOLD-WR-50",
        description: "Premium water resistant cement. Ideal for coastal areas. Superior strength and durability.",
        price: 445.00,
        currency: "INR",
        unit: "bag (50kg)",
        moq: 40,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          type: "Water Resistant",
          weight: "50kg",
          grade: "OPC 53",
          specialFeature: "Coastal Construction"
        }),
        city: "Mumbai",
        deliveryRadiusKm: 70,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
        ]),
        popularityScore: 134,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: "user_provider_3",
        title: "Ready-Mix Concrete M25 Grade",
        brand: "RMC",
        sku: "RMC-M25-CUM",
        description: "Pre-mixed concrete M25 grade. Ready for immediate use. Consistent quality guaranteed.",
        price: 5200.00,
        currency: "INR",
        unit: "cubic meter",
        moq: 3,
        stockStatus: "in_stock",
        attributes: JSON.stringify({
          grade: "M25",
          slump: "100-150mm",
          setting: "4-6 hours",
          application: "Beams, Columns, Slabs"
        }),
        city: "Mumbai",
        deliveryRadiusKm: 40,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
        ]),
        popularityScore: 98,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const item of catalogItems) {
      await db.insert(catalogs).values(item).onConflictDoNothing();
    }
    console.log("✅ Created catalog items");

    // 4. Create blog posts
    const blogs = [
      {
        authorId: "user_provider_1",
        title: "Complete Guide to Choosing the Right Tiles for Your Home",
        slug: "guide-choosing-right-tiles",
        excerpt: "Learn how to select the perfect tiles for different rooms in your home. Expert tips on materials, sizes, and finishes.",
        bodyMd: `# Complete Guide to Choosing the Right Tiles for Your Home

Choosing the right tiles can transform your space. Here's everything you need to know:

## 1. Understand Tile Types
- **Vitrified Tiles**: Low water absorption, high durability
- **Ceramic Tiles**: Cost-effective, variety of designs
- **Porcelain Tiles**: Premium quality, highly durable

## 2. Room-Specific Selection
### Living Room
- Large format tiles (800x800mm or 1200x600mm)
- Glossy or polished finish
- Neutral colors with subtle patterns

### Bathroom
- Smaller tiles (300x600mm) for walls
- Anti-skid tiles for floor
- Water-resistant and easy to clean

## 3. Budget Planning
- Premium tiles: ₹60-200 per sq ft
- Mid-range: ₹35-60 per sq ft
- Economy: ₹20-35 per sq ft

## Conclusion
Visit our showroom for personalized consultation!`,
        tags: JSON.stringify(["tiles", "home-improvement", "interior-design", "renovation"]),
        heroUrl: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1200",
        status: "published",
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        authorId: "user_provider_2",
        title: "Understanding Cement Grades: OPC 43 vs OPC 53",
        slug: "understanding-cement-grades",
        excerpt: "Confused between OPC 43 and OPC 53? This guide explains the differences and when to use each grade.",
        bodyMd: `# Understanding Cement Grades: OPC 43 vs OPC 53

## What is OPC?
Ordinary Portland Cement (OPC) is the most common type used in construction.

## OPC 43 Grade
- Compressive strength: 43 MPa at 28 days
- Best for: Normal construction, plastering
- Cost: Lower than OPC 53
- Setting time: Slightly longer

## OPC 53 Grade
- Compressive strength: 53 MPa at 28 days
- Best for: High-rise buildings, heavy structures
- Cost: 5-10% higher than OPC 43
- Setting time: Faster

## Which Should You Choose?
- **Residential homes**: OPC 43 is sufficient
- **Commercial buildings**: OPC 53 recommended
- **Fast construction**: OPC 53 for quicker strength gain

## Storage Tips
- Keep cement bags on wooden pallets
- Store in dry, covered area
- Use within 3 months of manufacturing`,
        tags: JSON.stringify(["cement", "construction", "building-materials", "guide"]),
        heroUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200",
        status: "published",
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        authorId: "user_consumer_1",
        title: "My Home Renovation Journey: Lessons Learned",
        slug: "home-renovation-journey",
        excerpt: "I renovated my 2BHK apartment in Delhi. Here are 10 important lessons that will help you avoid common mistakes.",
        bodyMd: `# My Home Renovation Journey: Lessons Learned

After 6 months of renovating my 2BHK in Delhi, here's what I wish I knew earlier:

## 1. Plan Everything First
Don't start work without complete planning. We changed our mind mid-way and it cost us extra ₹50,000.

## 2. Always Get Multiple Quotes
I got quotes from 5 contractors. Prices varied by 30-40%! Hub4Estate made this so easy.

## 3. Quality Over Price
We bought cheap tiles to save money. Had to replace them after 6 months. Total waste.

## 4. Hidden Costs Are Real
- Transportation: ₹15,000
- Labor meals: ₹8,000
- Site cleaning: ₹5,000
Budget 20% extra for such expenses.

## 5. Waterproofing is Critical
Spent ₹25,000 on proper bathroom waterproofing. Best decision ever.

## Final Thoughts
Total cost: ₹8.5 lakhs for complete renovation. Worth every rupee when done right!`,
        tags: JSON.stringify(["renovation", "home-improvement", "personal-experience", "tips"]),
        heroUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
        status: "published",
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const blog of blogs) {
      await db.insert(blogPosts).values(blog).onConflictDoNothing();
    }
    console.log("✅ Created blog posts");

    // 5. Create city knowledge
    const cities = [
      {
        regionCode: "DEL",
        summaryMd: `# Delhi NCR Real Estate Guide

Delhi NCR is India's capital region with robust real estate infrastructure.

## Key Facts
- **Population**: 30+ million
- **Major Areas**: Gurugram, Noida, Ghaziabad, Faridabad
- **Growth Rate**: 8-10% annually

## Development Projects
- Delhi-Meerut Expressway
- Dwarka Expressway
- Metro Phase IV expansion

## Building Regulations
- FAR varies by zone (1.2 to 4.5)
- Height restrictions near airport (15km radius)
- Fire NOC mandatory for buildings >15m`,
        govContacts: JSON.stringify({
          DDA: "+91-11-23370009",
          MCD: "+91-11-23378787",
          PWD: "+91-11-23073014"
        }),
        planningDocs: JSON.stringify([
          "Master Plan Delhi 2041",
          "Delhi Building Bye-Laws 1983",
          "Unified Building Bye-Laws 2016"
        ]),
        utilitySteps: JSON.stringify({
          "Water Connection": ["Apply online on Delhi Jal Board portal", "Submit proof of ownership", "Pay connection fee", "Inspection within 15 days"],
          "Electricity": ["Apply at BSES/TATA Power", "Submit documents", "Meter installation in 7 days"],
          "Building Permit": ["Submit plans to MCD", "Get structural stability certificate", "Pay fees", "Approval in 30-60 days"]
        }),
        lastRefreshed: new Date().toISOString(),
      },
      {
        regionCode: "JAI",
        summaryMd: `# Jaipur Real Estate Guide

Jaipur, the Pink City, is a growing real estate market with heritage considerations.

## Key Facts
- **Population**: 3.9+ million
- **Major Areas**: Vaishali Nagar, Mansarovar, Malviya Nagar
- **Growth Rate**: 12-15% annually

## Development Projects
- Jaipur Metro Phase 1B
- Ring Road expansion
- Smart City initiatives

## Building Regulations
- Heritage zone restrictions
- FAR: 1.5 to 2.25
- Pink stone facade mandatory in Walled City`,
        govContacts: JSON.stringify({
          JDA: "+91-141-2224475",
          JMC: "+91-141-2616002",
          "Town Planning": "+91-141-2227137"
        }),
        planningDocs: JSON.stringify([
          "Jaipur Master Plan 2025",
          "Building Bye-Laws 2004",
          "Heritage Zone Guidelines"
        ]),
        utilitySteps: JSON.stringify({
          "Water Connection": ["Apply at PHED", "Documents verification", "Connection in 15 days"],
          "Electricity": ["JVVNL application", "Meter installation", "Connection in 7-10 days"],
          "Building Permit": ["JDA plan approval", "Structural certificate", "Fee payment", "30-45 days approval"]
        }),
        lastRefreshed: new Date().toISOString(),
      },
      {
        regionCode: "MUM",
        summaryMd: `# Mumbai Real Estate Guide

Mumbai is India's financial capital with premium real estate market.

## Key Facts
- **Population**: 20+ million
- **Major Areas**: Andheri, Powai, Thane, Navi Mumbai
- **Growth Rate**: 6-8% annually

## Development Projects
- Coastal Road
- Metro Lines expansion
- Trans Harbour Link

## Building Regulations
- FSI varies by zone (1.0 to 3.0)
- CRZ regulations for coastal areas
- RERA registration mandatory`,
        govContacts: JSON.stringify({
          BMC: "+91-22-22620222",
          MHADA: "+91-22-24194967",
          MMRDA: "+91-22-26592253"
        }),
        planningDocs: JSON.stringify([
          "Development Plan 2034",
          "DCR 2034",
          "RERA Guidelines 2017"
        ]),
        utilitySteps: JSON.stringify({
          "Water Connection": ["BMC online application", "Property documents", "Connection in 20 days"],
          "Electricity": ["Apply at BEST/Reliance", "Meter within 7 days"],
          "Building Permit": ["BMC plan submission", "Architect certificate", "IOD in 30 days"]
        }),
        lastRefreshed: new Date().toISOString(),
      },
    ];

    for (const city of cities) {
      await db.insert(cityKnowledge).values(city).onConflictDoNothing();
    }
    console.log("✅ Created city knowledge");

    // 6. Create sample projects
    const sampleProjects = [
      {
        ownerId: "user_consumer_1",
        title: "2BHK Apartment Renovation - Dwarka",
        address: "Sector 12, Dwarka, New Delhi",
        city: "Delhi",
        budget: 850000,
        currency: "INR",
        status: "in_progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        ownerId: "user_consumer_2",
        title: "3BHK Villa Construction - Jaipur",
        address: "Mansarovar Extension, Jaipur",
        city: "Jaipur",
        budget: 4500000,
        currency: "INR",
        status: "planning",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const project of sampleProjects) {
      await db.insert(projects).values(project).onConflictDoNothing();
    }
    console.log("✅ Created sample projects");

    // 7. Create social posts
    const posts = [
      {
        authorId: "user_provider_1",
        content: "🎉 New collection of Italian marble just arrived! Visit our showroom to see the stunning Carrara and Statuario varieties. Limited stock available. #Marble #LuxuryHomes #InteriorDesign",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        ]),
        likesCount: 24,
        commentsCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        authorId: "user_consumer_1",
        content: "Just completed my home renovation! Big shoutout to Hub4Estate for making it so easy to find verified suppliers. Got quotes from 8 vendors and saved ₹50,000! 🏠✨ #HomeRenovation #HappyCustomer",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
        ]),
        likesCount: 67,
        commentsCount: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        authorId: "user_provider_2",
        content: "Construction tip of the day: Always cure concrete for at least 7 days for optimal strength. Use wet gunny bags or water spraying method. 💧🏗️ #ConstructionTips #CivilEngineering",
        mediaUrls: JSON.stringify([]),
        likesCount: 45,
        commentsCount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const post of posts) {
      await db.insert(socialPosts).values(post).onConflictDoNothing();
    }
    console.log("✅ Created social posts");

    // 8. Create social groups
    const groups = [
      {
        name: "Delhi NCR Contractors & Builders",
        description: "Connect with contractors, builders, and real estate professionals in Delhi NCR. Share projects, find partners, discuss regulations.",
        visibility: "public",
        ownerId: "user_provider_1",
        membersCount: 1245,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Jaipur Construction Materials Forum",
        description: "Discuss prices, quality, and suppliers of construction materials in Jaipur. Share experiences and recommendations.",
        visibility: "public",
        ownerId: "user_provider_2",
        membersCount: 856,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Home Renovation Ideas India",
        description: "Share your renovation stories, get design ideas, find reliable contractors. For homeowners across India.",
        visibility: "public",
        ownerId: "user_consumer_1",
        membersCount: 3421,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const group of groups) {
      await db.insert(socialGroups).values(group).onConflictDoNothing();
    }
    console.log("✅ Created social groups");

    // 9. Create sample notifications
    const sampleNotifications = [
      {
        userId: "user_consumer_1",
        type: "quote_received",
        title: "New Quote Received",
        message: "Delhi Tiles & Marble Co. sent you a quote for Vitrified Tiles. Price: ₹65.50/sq ft",
        link: "/rfq/1",
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        userId: "user_provider_1",
        type: "new_lead",
        title: "New RFQ Alert",
        message: "Priya Sharma is looking for Italian Marble in South Delhi. Quantity: 500 sq ft",
        link: "/provider/rfq/2",
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const notification of sampleNotifications) {
      await db.insert(notifications).values(notification).onConflictDoNothing();
    }
    console.log("✅ Created notifications");

    console.log("\n🎉 Hub4Estate seed completed successfully!\n");
    console.log("📊 Summary:");
    console.log("  - 5 Users (2 consumers, 3 providers)");
    console.log("  - 3 Provider profiles");
    console.log("  - 9 Catalog items");
    console.log("  - 3 Blog posts");
    console.log("  - 3 City knowledge entries");
    console.log("  - 2 Sample projects");
    console.log("  - 3 Social posts");
    console.log("  - 3 Social groups");
    console.log("  - 2 Notifications");
    console.log("\n✅ Platform is ready for testing!\n");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed();
