import { db } from '@/db';
import { profilesProvider } from '@/db/schema';

async function main() {
    const sampleProviders = [
        {
            userId: 'user_suresh_01',
            shopName: 'Jaipur Building Supplies',
            phone: '+91-9876543210',
            address: 'Plot 45, Sitapura Industrial Area, Phase II, Jaipur, Rajasthan 302022',
            lat: 26.7721,
            lng: 75.8163,
            categories: JSON.stringify(['tiles', 'cement', 'steel']),
            brands: JSON.stringify(['Kajaria', 'Ultratech', 'JSW']),
            logoUrl: null,
            kycStatus: 'verified',
            trustScore: 92,
            description: 'Leading supplier of premium construction materials in Rajasthan. ISO certified with 15+ years of industry experience. We provide end-to-end solutions for residential and commercial projects with competitive pricing and timely delivery.',
            gallery: JSON.stringify([]),
            createdAt: '2024-01-05T00:00:00Z',
            updatedAt: '2024-01-05T00:00:00Z',
        },
        {
            userId: 'user_ramesh_01',
            shopName: 'Delhi Tiles & Marble Hub',
            phone: '+91-9876543211',
            address: '127, Kirti Nagar Furniture Market, New Delhi 110015',
            lat: 28.6562,
            lng: 77.1482,
            categories: JSON.stringify(['tiles', 'marble', 'granite']),
            brands: JSON.stringify(['Kajaria', 'Somany', 'Italian Marble']),
            logoUrl: null,
            kycStatus: 'verified',
            trustScore: 88,
            description: 'Premium tiles and marble showroom in Delhi NCR. Exclusive dealer for Italian and Spanish tiles. Expert consultation available for design and material selection.',
            gallery: JSON.stringify([]),
            createdAt: '2024-01-06T00:00:00Z',
            updatedAt: '2024-01-06T00:00:00Z',
        },
        {
            userId: 'user_kiran_01',
            shopName: 'Mumbai Construction Materials',
            phone: '+91-9876543212',
            address: '203, Sion Industrial Estate, Mumbai, Maharashtra 400022',
            lat: 19.0430,
            lng: 72.8637,
            categories: JSON.stringify(['cement', 'steel', 'paint']),
            brands: JSON.stringify(['ACC', 'TATA Steel', 'Asian Paints']),
            logoUrl: null,
            kycStatus: 'pending',
            trustScore: 45,
            description: 'Wholesale supplier of construction materials in Mumbai. Bulk orders only. Competitive rates for contractors and builders. Fast delivery within Mumbai and Navi Mumbai.',
            gallery: JSON.stringify([]),
            createdAt: '2024-01-07T00:00:00Z',
            updatedAt: '2024-01-07T00:00:00Z',
        },
        {
            userId: 'user_deepak_01',
            shopName: 'Bangalore Premium Interiors',
            phone: '+91-9876543213',
            address: '89, Whitefield Main Road, Bangalore, Karnataka 560066',
            lat: 12.9698,
            lng: 77.7499,
            categories: JSON.stringify(['fixtures', 'electrical', 'plywood']),
            brands: JSON.stringify(['Hindware', 'Havells', 'Century Ply']),
            logoUrl: null,
            kycStatus: 'verified',
            trustScore: 85,
            description: 'Premium interior solutions for modern homes and offices. Design consultation available. Authorized dealer for top brands with genuine products and warranty.',
            gallery: JSON.stringify([]),
            createdAt: '2024-01-08T00:00:00Z',
            updatedAt: '2024-01-08T00:00:00Z',
        }
    ];

    await db.insert(profilesProvider).values(sampleProviders);
    
    console.log('✅ Provider profiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});