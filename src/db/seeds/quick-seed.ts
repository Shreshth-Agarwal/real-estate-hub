import { db } from "../index";
import { profilesProvider, catalogs, projects, projectItems } from "../schema";

async function seed() {
  try {
    console.log("🌱 Starting quick seed...");

    // Get existing user
    const userId = "unB3kblLbsKP45VWPCJCkcudqM0znE8B"; // From logs

    // Seed provider profiles
    const providers = await db.insert(profilesProvider).values([
      {
        userId: userId,
        shopName: "BuildMart Supplies",
        phone: "+91-9876543210",
        address: "Shop 12, Industrial Area, Andheri East",
        lat: 19.1136,
        lng: 72.8697,
        categories: JSON.stringify(["tiles", "cement", "steel"]),
        brands: JSON.stringify(["Kajaria", "UltraTech", "TATA"]),
        logoUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/professional-real-estate-materials-catal-08e04872-20251003132605.jpg",
        kycStatus: "verified",
        trustScore: 85,
        description: "Premium building materials supplier with 10+ years experience",
        gallery: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]).returning();

    console.log("✅ Providers created:", providers.length);

    // Seed catalogs
    const catalogItems = await db.insert(catalogs).values([
      {
        providerId: userId,
        title: "Kajaria Vitrified Tiles - Premium Series",
        brand: "Kajaria",
        sku: "KAJ-VIT-001",
        description: "High-quality vitrified tiles, 600x600mm, glossy finish",
        price: 450,
        currency: "INR",
        unit: "sqft",
        moq: 100,
        stockStatus: "in_stock",
        attributes: JSON.stringify({ size: "600x600mm", finish: "glossy", color: "white" }),
        city: "Mumbai",
        deliveryRadiusKm: 50,
        images: JSON.stringify(["https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/professional-real-estate-materials-catal-08e04872-20251003132605.jpg"]),
        pdfUrl: null,
        popularityScore: 120,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: userId,
        title: "UltraTech Cement - OPC 53 Grade",
        brand: "UltraTech",
        sku: "UTC-OPC-53",
        description: "Premium quality cement for all construction needs",
        price: 380,
        currency: "INR",
        unit: "bag",
        moq: 50,
        stockStatus: "in_stock",
        attributes: JSON.stringify({ grade: "OPC 53", weight: "50kg" }),
        city: "Mumbai",
        deliveryRadiusKm: 100,
        images: JSON.stringify([]),
        pdfUrl: null,
        popularityScore: 200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: userId,
        title: "TATA TMT Bars - Fe 500D",
        brand: "TATA Steel",
        sku: "TATA-TMT-500D",
        description: "High strength TMT bars for earthquake resistant construction",
        price: 65,
        currency: "INR",
        unit: "kg",
        moq: 500,
        stockStatus: "in_stock",
        attributes: JSON.stringify({ grade: "Fe 500D", diameter: "12mm" }),
        city: "Mumbai",
        deliveryRadiusKm: 150,
        images: JSON.stringify([]),
        pdfUrl: null,
        popularityScore: 180,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: userId,
        title: "Jaquar Bath Fittings Set",
        brand: "Jaquar",
        sku: "JAQ-BF-PREMIUM",
        description: "Complete bathroom fittings set with modern design",
        price: 8500,
        currency: "INR",
        unit: "set",
        moq: 1,
        stockStatus: "in_stock",
        attributes: JSON.stringify({ type: "bath fittings", finish: "chrome" }),
        city: "Mumbai",
        deliveryRadiusKm: 30,
        images: JSON.stringify(["https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/luxury-real-estate-material-samples---hi-680fbba5-20251003132628.jpg"]),
        pdfUrl: null,
        popularityScore: 90,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        providerId: userId,
        title: "Asian Paints Apex Ultima - Premium Emulsion",
        brand: "Asian Paints",
        sku: "AP-APEX-ULT",
        description: "Advanced weather-proof exterior paint",
        price: 650,
        currency: "INR",
        unit: "liter",
        moq: 20,
        stockStatus: "in_stock",
        attributes: JSON.stringify({ type: "exterior", coverage: "140 sqft/liter" }),
        city: "Mumbai",
        deliveryRadiusKm: 50,
        images: JSON.stringify([]),
        pdfUrl: null,
        popularityScore: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]).returning();

    console.log("✅ Catalogs created:", catalogItems.length);

    // Seed projects
    const projectsList = await db.insert(projects).values([
      {
        ownerId: userId,
        title: "Residential Villa Construction - Whitefield",
        address: "Plot 42, Whitefield, Bangalore",
        city: "Bangalore",
        budget: 5000000,
        currency: "INR",
        status: "planning",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        ownerId: userId,
        title: "Office Renovation - Andheri",
        address: "5th Floor, Commercial Complex, Andheri West",
        city: "Mumbai",
        budget: 1500000,
        currency: "INR",
        status: "in_progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]).returning();

    console.log("✅ Projects created:", projectsList.length);

    // Link catalog items to projects
    if (catalogItems.length > 0 && projectsList.length > 0) {
      await db.insert(projectItems).values([
        {
          projectId: projectsList[0].id,
          catalogId: catalogItems[0].id,
          qty: 2000,
          unit: "sqft",
          note: "For living room and bedrooms",
          createdAt: new Date().toISOString(),
        },
        {
          projectId: projectsList[0].id,
          catalogId: catalogItems[1].id,
          qty: 200,
          unit: "bag",
          note: "Foundation work",
          createdAt: new Date().toISOString(),
        },
        {
          projectId: projectsList[1].id,
          catalogId: catalogItems[3].id,
          qty: 5,
          unit: "set",
          note: "Office bathrooms",
          createdAt: new Date().toISOString(),
        },
      ]);
      console.log("✅ Project items linked");
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed();