import { db } from '@/db';
import { 
  users, 
  profilesProvider, 
  catalogs, 
  rfqRequests, 
  quotes, 
  projects, 
  projectItems, 
  ratings, 
  verificationDocs 
} from '@/db/schema';

async function main() {
  // Insert users
  const sampleUsers = [
    {
      email: 'admin@hub4estate.com',
      name: 'Admin User',
      userType: 'admin',
      locale: 'en',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
    {
      email: 'consumer@test.com',
      name: 'John Consumer',
      userType: 'consumer',
      locale: 'en',
      createdAt: new Date('2024-01-05').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      email: 'provider@test.com',
      name: 'ABC Materials',
      userType: 'provider',
      locale: 'en',
      createdAt: new Date('2024-01-10').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString(),
    }
  ];

  await db.insert(users).values(sampleUsers);

  // Insert provider profiles
  const sampleProviderProfiles = [
    {
      userId: 3,
      shopName: 'ABC Building Materials',
      phone: '+91-9876543210',
      address: '123 Industrial Area, Mumbai',
      lat: 19.0760,
      lng: 72.8777,
      categories: JSON.stringify(['tiles', 'cement', 'steel']),
      brands: JSON.stringify(['Kajaria', 'UltraTech', 'Tata Steel']),
      kycStatus: 'verified',
      trustScore: 85,
      description: 'Leading supplier of construction materials',
      gallery: JSON.stringify([]),
      createdAt: new Date('2024-01-10').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString(),
    },
    {
      userId: 3,
      shopName: 'Premium Fixtures',
      phone: '+91-8765432109',
      address: '456 Market Street, Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      categories: JSON.stringify(['plumbing', 'electrical', 'lighting']),
      brands: JSON.stringify(['Jaquar', 'Philips', 'Legrand']),
      kycStatus: 'verified',
      trustScore: 92,
      description: 'Premium quality fixtures and fittings',
      gallery: JSON.stringify([]),
      createdAt: new Date('2024-01-12').toISOString(),
      updatedAt: new Date('2024-01-12').toISOString(),
    }
  ];

  await db.insert(profilesProvider).values(sampleProviderProfiles);

  // Insert catalogs
  const sampleCatalogs = [
    {
      providerId: 3,
      title: 'Premium Vitrified Tiles',
      brand: 'Kajaria',
      price: 45.0,
      unit: 'sq.ft',
      moq: 100,
      city: 'Mumbai',
      deliveryRadiusKm: 50,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'tiles' }),
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
      providerId: 3,
      title: 'OPC 53 Grade Cement',
      brand: 'UltraTech',
      price: 385.0,
      unit: 'bag',
      moq: 10,
      city: 'Mumbai',
      deliveryRadiusKm: 100,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'cement' }),
      createdAt: new Date('2024-01-16').toISOString(),
      updatedAt: new Date('2024-01-16').toISOString(),
    },
    {
      providerId: 3,
      title: 'TMT Steel Bars Fe-500',
      brand: 'Tata Steel',
      price: 58.0,
      unit: 'kg',
      moq: 100,
      city: 'Mumbai',
      deliveryRadiusKm: 75,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'steel' }),
      createdAt: new Date('2024-01-17').toISOString(),
      updatedAt: new Date('2024-01-17').toISOString(),
    },
    {
      providerId: 3,
      title: 'Single Lever Basin Mixer',
      brand: 'Jaquar',
      price: 2450.0,
      unit: 'piece',
      moq: 1,
      city: 'Bangalore',
      deliveryRadiusKm: 25,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'plumbing' }),
      createdAt: new Date('2024-01-18').toISOString(),
      updatedAt: new Date('2024-01-18').toISOString(),
    },
    {
      providerId: 3,
      title: 'LED Panel Light 36W',
      brand: 'Philips',
      price: 850.0,
      unit: 'piece',
      moq: 1,
      city: 'Bangalore',
      deliveryRadiusKm: 30,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'lighting' }),
      createdAt: new Date('2024-01-19').toISOString(),
      updatedAt: new Date('2024-01-19').toISOString(),
    },
    {
      providerId: 3,
      title: 'Royale Play Paint',
      brand: 'Asian Paints',
      price: 180.0,
      unit: 'ltr',
      moq: 5,
      city: 'Delhi',
      deliveryRadiusKm: 40,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'paint' }),
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString(),
    },
    {
      providerId: 3,
      title: 'Modular Switch',
      brand: 'Legrand',
      price: 125.0,
      unit: 'piece',
      moq: 10,
      city: 'Bangalore',
      deliveryRadiusKm: 35,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'electrical' }),
      createdAt: new Date('2024-01-21').toISOString(),
      updatedAt: new Date('2024-01-21').toISOString(),
    },
    {
      providerId: 3,
      title: 'Flush Door',
      brand: 'Century',
      price: 3200.0,
      unit: 'piece',
      moq: 1,
      city: 'Chennai',
      deliveryRadiusKm: 45,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'doors' }),
      createdAt: new Date('2024-01-22').toISOString(),
      updatedAt: new Date('2024-01-22').toISOString(),
    },
    {
      providerId: 3,
      title: 'UPVC Window',
      brand: 'Fenesta',
      price: 8500.0,
      unit: 'sq.ft',
      moq: 20,
      city: 'Pune',
      deliveryRadiusKm: 60,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'windows' }),
      createdAt: new Date('2024-01-23').toISOString(),
      updatedAt: new Date('2024-01-23').toISOString(),
    },
    {
      providerId: 3,
      title: 'Granite Slab',
      brand: 'R.K. Marble',
      price: 95.0,
      unit: 'sq.ft',
      moq: 50,
      city: 'Rajasthan',
      deliveryRadiusKm: 200,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'stone' }),
      createdAt: new Date('2024-01-24').toISOString(),
      updatedAt: new Date('2024-01-24').toISOString(),
    },
    {
      providerId: 3,
      title: 'Waterproofing Membrane',
      brand: 'Fosroc',
      price: 68.0,
      unit: 'sq.ft',
      moq: 100,
      city: 'Mumbai',
      deliveryRadiusKm: 50,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'waterproofing' }),
      createdAt: new Date('2024-01-25').toISOString(),
      updatedAt: new Date('2024-01-25').toISOString(),
    },
    {
      providerId: 3,
      title: 'Designer Ceiling Fan',
      brand: 'Orient',
      price: 2850.0,
      unit: 'piece',
      moq: 1,
      city: 'Delhi',
      deliveryRadiusKm: 40,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'electrical' }),
      createdAt: new Date('2024-01-26').toISOString(),
      updatedAt: new Date('2024-01-26').toISOString(),
    },
    {
      providerId: 3,
      title: 'Laminated Flooring',
      brand: 'Pergo',
      price: 125.0,
      unit: 'sq.ft',
      moq: 100,
      city: 'Bangalore',
      deliveryRadiusKm: 30,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'flooring' }),
      createdAt: new Date('2024-01-27').toISOString(),
      updatedAt: new Date('2024-01-27').toISOString(),
    },
    {
      providerId: 3,
      title: 'Aluminum Composite Panel',
      brand: 'Alubond',
      price: 245.0,
      unit: 'sq.ft',
      moq: 50,
      city: 'Mumbai',
      deliveryRadiusKm: 50,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'cladding' }),
      createdAt: new Date('2024-01-28').toISOString(),
      updatedAt: new Date('2024-01-28').toISOString(),
    },
    {
      providerId: 3,
      title: 'Sanitaryware Set',
      brand: 'Hindware',
      price: 15000.0,
      unit: 'set',
      moq: 1,
      city: 'Chennai',
      deliveryRadiusKm: 45,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'plumbing' }),
      createdAt: new Date('2024-01-29').toISOString(),
      updatedAt: new Date('2024-01-29').toISOString(),
    },
    {
      providerId: 3,
      title: 'Fire Resistant Cable',
      brand: 'Havells',
      price: 45.0,
      unit: 'mtr',
      moq: 100,
      city: 'Delhi',
      deliveryRadiusKm: 40,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'electrical' }),
      createdAt: new Date('2024-01-30').toISOString(),
      updatedAt: new Date('2024-01-30').toISOString(),
    },
    {
      providerId: 3,
      title: 'Insulation Board',
      brand: 'Rockwool',
      price: 85.0,
      unit: 'sq.ft',
      moq: 50,
      city: 'Pune',
      deliveryRadiusKm: 60,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'insulation' }),
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString(),
    },
    {
      providerId: 3,
      title: 'Security Door Lock',
      brand: 'Godrej',
      price: 3500.0,
      unit: 'piece',
      moq: 1,
      city: 'Mumbai',
      deliveryRadiusKm: 50,
      images: JSON.stringify([]),
      attributes: JSON.stringify({ category: 'hardware' }),
      createdAt: new Date('2024-02-02').toISOString(),
      updatedAt: new Date('2024-02-02').toISOString(),
    }
  ];

  await db.insert(catalogs).values(sampleCatalogs);

  // Insert RFQ requests
  const sampleRFQRequests = [
    {
      catalogId: 1,
      consumerId: 2,
      quantity: 500.0,
      unit: 'sq.ft',
      status: 'submitted',
      createdAt: new Date('2024-02-05').toISOString(),
      updatedAt: new Date('2024-02-05').toISOString(),
    },
    {
      catalogId: 3,
      consumerId: 2,
      quantity: 2000.0,
      unit: 'kg',
      status: 'responded',
      createdAt: new Date('2024-02-06').toISOString(),
      updatedAt: new Date('2024-02-07').toISOString(),
    },
    {
      catalogId: 4,
      consumerId: 2,
      quantity: 5.0,
      unit: 'piece',
      status: 'accepted',
      createdAt: new Date('2024-02-08').toISOString(),
      updatedAt: new Date('2024-02-09').toISOString(),
    },
    {
      catalogId: null,
      consumerId: 2,
      quantity: 100.0,
      unit: 'bag',
      status: 'draft',
      message: 'Need cement bags for foundation work',
      createdAt: new Date('2024-02-10').toISOString(),
      updatedAt: new Date('2024-02-10').toISOString(),
    }
  ];

  await db.insert(rfqRequests).values(sampleRFQRequests);

  // Insert quotes
  const sampleQuotes = [
    {
      rfqId: 1,
      providerId: 3,
      price: 42.0,
      deliveryEtaDays: 7,
      status: 'pending',
      createdAt: new Date('2024-02-06').toISOString(),
      updatedAt: new Date('2024-02-06').toISOString(),
    },
    {
      rfqId: 2,
      providerId: 3,
      price: 56.0,
      deliveryEtaDays: 5,
      status: 'accepted',
      createdAt: new Date('2024-02-07').toISOString(),
      updatedAt: new Date('2024-02-08').toISOString(),
    },
    {
      rfqId: 3,
      providerId: 3,
      price: 2200.0,
      deliveryEtaDays: 3,
      status: 'pending',
      createdAt: new Date('2024-02-09').toISOString(),
      updatedAt: new Date('2024-02-09').toISOString(),
    }
  ];

  await db.insert(quotes).values(sampleQuotes);

  // Insert projects
  const sampleProjects = [
    {
      ownerId: 2,
      title: 'Residential Villa Construction',
      address: 'Plot 45, Green Valley',
      city: 'Mumbai',
      budget: 2500000.0,
      status: 'in_progress',
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString(),
    },
    {
      ownerId: 2,
      title: 'Office Interior Renovation',
      address: '5th Floor, Tech Park',
      city: 'Bangalore',
      budget: 800000.0,
      status: 'planning',
      createdAt: new Date('2024-02-05').toISOString(),
      updatedAt: new Date('2024-02-05').toISOString(),
    }
  ];

  await db.insert(projects).values(sampleProjects);

  // Insert project items
  const sampleProjectItems = [
    {
      projectId: 1,
      catalogId: 1,
      qty: 800.0,
      unit: 'sq.ft',
      note: 'For living room and bedrooms',
      createdAt: new Date('2024-01-25').toISOString(),
    },
    {
      projectId: 1,
      catalogId: 2,
      qty: 50.0,
      unit: 'bag',
      note: 'Foundation work',
      createdAt: new Date('2024-01-26').toISOString(),
    },
    {
      projectId: 2,
      catalogId: 13,
      qty: 200.0,
      unit: 'sq.ft',
      note: 'Office flooring',
      createdAt: new Date('2024-02-06').toISOString(),
    },
    {
      projectId: 2,
      catalogId: 5,
      qty: 15.0,
      unit: 'piece',
      note: 'Conference room lighting',
      createdAt: new Date('2024-02-07').toISOString(),
    }
  ];

  await db.insert(projectItems).values(sampleProjectItems);

  // Insert ratings
  const sampleRatings = [
    {
      raterId: 2,
      targetType: 'provider',
      targetId: 3,
      score: 5,
      reviewMd: 'Excellent service and quality products',
      createdAt: new Date('2024-02-10').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'catalog',
      targetId: 1,
      score: 4,
      reviewMd: 'Good quality tiles, fast delivery',
      createdAt: new Date('2024-02-11').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'catalog',
      targetId: 3,
      score: 5,
      reviewMd: 'Best TMT bars in the market',
      createdAt: new Date('2024-02-12').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'provider',
      targetId: 3,
      score: 4,
      reviewMd: 'Reliable supplier, competitive prices',
      createdAt: new Date('2024-02-13').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'catalog',
      targetId: 4,
      score: 5,
      reviewMd: 'Premium quality faucet, worth the price',
      createdAt: new Date('2024-02-14').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'catalog',
      targetId: 8,
      score: 4,
      reviewMd: 'Sturdy door, good finish',
      createdAt: new Date('2024-02-15').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'catalog',
      targetId: 12,
      score: 3,
      reviewMd: 'Decent fan but could be quieter',
      createdAt: new Date('2024-02-16').toISOString(),
    },
    {
      raterId: 2,
      targetType: 'catalog',
      targetId: 15,
      score: 5,
      reviewMd: 'Complete set, excellent quality',
      createdAt: new Date('2024-02-17').toISOString(),
    }
  ];

  await db.insert(ratings).values(sampleRatings);

  // Insert verification docs
  const sampleVerificationDocs = [
    {
      userId: 3,
      docType: 'GST Certificate',
      docUrl: '/docs/gst-certificate-abc-materials.pdf',
      status: 'approved',
      reviewedBy: 1,
      reviewedAt: new Date('2024-01-15').toISOString(),
      createdAt: new Date('2024-01-11').toISOString(),
    },
    {
      userId: 3,
      docType: 'Trade License',
      docUrl: '/docs/trade-license-abc-materials.pdf',
      status: 'approved',
      reviewedBy: 1,
      reviewedAt: new Date('2024-01-16').toISOString(),
      createdAt: new Date('2024-01-12').toISOString(),
    }
  ];

  await db.insert(verificationDocs).values(sampleVerificationDocs);

  console.log('✅ Real estate platform seeder completed successfully');
}

main().catch((error) => {
  console.error('❌ Seeder failed:', error);
});