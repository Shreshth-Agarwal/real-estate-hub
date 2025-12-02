import { db } from '@/db';
import { socialPosts, socialComments, socialGroups, socialGroupMembers } from '@/db/schema';

async function main() {
    // Sample Social Posts
    const samplePosts = [
        {
            authorId: 'consumer_amit_01',
            content: 'Looking for marble supplier in Jaipur. Budget ₹8-10 lakh. Recommendations?',
            mediaUrls: null,
            likesCount: 24,
            commentsCount: 8,
            createdAt: new Date('2024-02-10T09:30:00Z').toISOString(),
            updatedAt: new Date('2024-02-10T09:30:00Z').toISOString(),
        },
        {
            authorId: 'consumer_neha_01',
            content: 'Completed villa in Mansarovar! Sharing lessons learned. Total cost came to ₹1.2 crore. Italian marble saved 30% by direct sourcing. DM for contacts.',
            mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c']),
            likesCount: 45,
            commentsCount: 12,
            createdAt: new Date('2024-02-08T14:20:00Z').toISOString(),
            updatedAt: new Date('2024-02-08T14:20:00Z').toISOString(),
        },
        {
            authorId: 'provider_jpr_01',
            content: 'New Italian marble stock! Special price ₹420/sqft for this week only. Premium quality, direct import from Italy. Available colors: Statuario, Calacatta, Carrara. Limited stock!',
            mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1600607687644-c7171b42498b']),
            likesCount: 18,
            commentsCount: 5,
            createdAt: new Date('2024-02-12T11:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-12T11:00:00Z').toISOString(),
        },
        {
            authorId: 'consumer_rahul_01',
            content: 'Need help with RERA complaint for project delay. Builder has delayed possession by 8 months. What are my options? Anyone faced similar situation?',
            mediaUrls: null,
            likesCount: 32,
            commentsCount: 15,
            createdAt: new Date('2024-02-05T16:45:00Z').toISOString(),
            updatedAt: new Date('2024-02-05T16:45:00Z').toISOString(),
        },
        {
            authorId: 'consumer_sneha_01',
            content: 'Best tiles brands under ₹60/sqft? Planning for 2000 sqft apartment in Bangalore. Need durable options for living room and bedrooms.',
            mediaUrls: null,
            likesCount: 28,
            commentsCount: 11,
            createdAt: new Date('2024-02-13T10:15:00Z').toISOString(),
            updatedAt: new Date('2024-02-13T10:15:00Z').toISOString(),
        },
        {
            authorId: 'provider_del_01',
            content: 'Launch offer on premium sanitaryware! Kohler and Grohe at wholesale prices. Free installation for orders above ₹50k. Delhi NCR delivery available.',
            mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1620626011761-996317b8d101']),
            likesCount: 22,
            commentsCount: 6,
            createdAt: new Date('2024-02-11T13:30:00Z').toISOString(),
            updatedAt: new Date('2024-02-11T13:30:00Z').toISOString(),
        },
        {
            authorId: 'consumer_karan_01',
            content: 'Can someone recommend good interior designer in Jaipur? Budget ₹3-4 lakh for 3BHK. Looking for modern minimalist style.',
            mediaUrls: null,
            likesCount: 19,
            commentsCount: 9,
            createdAt: new Date('2024-02-09T15:20:00Z').toISOString(),
            updatedAt: new Date('2024-02-09T15:20:00Z').toISOString(),
        },
        {
            authorId: 'provider_mum_01',
            content: 'Special discount on waterproofing solutions! Dr. Fixit products at 25% off. Essential for Mumbai monsoon season. Hurry, offer valid till month end!',
            mediaUrls: null,
            likesCount: 16,
            commentsCount: 4,
            createdAt: new Date('2024-02-14T09:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-14T09:00:00Z').toISOString(),
        },
        {
            authorId: 'admin_vik_01',
            content: 'New RERA guidelines for 2024! All builders must register projects before launch. Consumers get better protection. Read full details on our blog.',
            mediaUrls: null,
            likesCount: 67,
            commentsCount: 18,
            createdAt: new Date('2024-02-01T08:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-01T08:00:00Z').toISOString(),
        },
        {
            authorId: 'consumer_amit_01',
            content: 'Sharing my renovation cost breakdown. 1200 sqft apartment in Jaipur. Total: ₹8.5 lakh. Flooring: ₹2.2L, Paint: ₹1.5L, Kitchen: ₹2.8L, Bathroom: ₹1.5L, Others: ₹0.5L',
            mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3']),
            likesCount: 53,
            commentsCount: 14,
            createdAt: new Date('2024-02-07T12:00:00Z').toISOString(),
            updatedAt: new Date('2024-02-07T12:00:00Z').toISOString(),
        },
        {
            authorId: 'provider_blr_01',
            content: 'New stock of teak wood doors! Premium quality, termite-treated. Starting ₹18,000 per door. Free delivery in Bangalore. WhatsApp for catalog.',
            mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1600585154526-990dced4db0d']),
            likesCount: 21,
            commentsCount: 7,
            createdAt: new Date('2024-02-06T10:30:00Z').toISOString(),
            updatedAt: new Date('2024-02-06T10:30:00Z').toISOString(),
        },
        {
            authorId: 'consumer_neha_01',
            content: 'Anyone used wall putty before painting? Is it really necessary? Contractor quoting ₹15/sqft extra for putty work.',
            mediaUrls: null,
            likesCount: 34,
            commentsCount: 13,
            createdAt: new Date('2024-02-04T14:45:00Z').toISOString(),
            updatedAt: new Date('2024-02-04T14:45:00Z').toISOString(),
        },
    ];

    await db.insert(socialPosts).values(samplePosts);

    // Sample Social Comments (3-5 per post)
    const sampleComments = [
        // Comments for Post 1 (Marble supplier)
        {
            postId: 1,
            authorId: 'provider_jpr_01',
            content: 'DM me! We have Italian and Indian marble in your budget. Can arrange site visit with samples.',
            createdAt: new Date('2024-02-10T10:00:00Z').toISOString(),
        },
        {
            postId: 1,
            authorId: 'consumer_neha_01',
            content: 'I recently bought from Marble House in Malviya Nagar. Good quality and reasonable prices. Check them out!',
            createdAt: new Date('2024-02-10T10:30:00Z').toISOString(),
        },
        {
            postId: 1,
            authorId: 'consumer_karan_01',
            content: 'For that budget, go for Indian marble. Italian will be tight. Makrana marble is excellent quality.',
            createdAt: new Date('2024-02-10T11:15:00Z').toISOString(),
        },

        // Comments for Post 2 (Villa completion)
        {
            postId: 2,
            authorId: 'consumer_amit_01',
            content: 'Congratulations! Can you share the direct marble supplier contact?',
            createdAt: new Date('2024-02-08T15:00:00Z').toISOString(),
        },
        {
            postId: 2,
            authorId: 'consumer_rahul_01',
            content: 'Beautiful work! How long did the whole project take?',
            createdAt: new Date('2024-02-08T15:30:00Z').toISOString(),
        },
        {
            postId: 2,
            authorId: 'consumer_sneha_01',
            content: 'Love the design! Which architect did you work with?',
            createdAt: new Date('2024-02-08T16:00:00Z').toISOString(),
        },
        {
            postId: 2,
            authorId: 'consumer_karan_01',
            content: 'This is goals! Did you face any major challenges during construction?',
            createdAt: new Date('2024-02-08T16:45:00Z').toISOString(),
        },

        // Comments for Post 3 (Marble stock)
        {
            postId: 3,
            authorId: 'consumer_amit_01',
            content: 'What\'s the size of slabs available? Need for 1500 sqft.',
            createdAt: new Date('2024-02-12T11:30:00Z').toISOString(),
        },
        {
            postId: 3,
            authorId: 'consumer_sneha_01',
            content: 'Do you have samples? Can we visit your showroom?',
            createdAt: new Date('2024-02-12T12:00:00Z').toISOString(),
        },
        {
            postId: 3,
            authorId: 'consumer_neha_01',
            content: 'Price seems good! Do you provide installation service as well?',
            createdAt: new Date('2024-02-12T12:30:00Z').toISOString(),
        },

        // Comments for Post 4 (RERA complaint)
        {
            postId: 4,
            authorId: 'admin_vik_01',
            content: 'You can file complaint on RERA website. You\'re entitled to compensation for delay. Check our guide in Legal Advice group.',
            createdAt: new Date('2024-02-05T17:00:00Z').toISOString(),
        },
        {
            postId: 4,
            authorId: 'consumer_amit_01',
            content: 'I faced similar issue. Got 12% compensation after RERA intervention. Don\'t delay, file complaint now.',
            createdAt: new Date('2024-02-05T17:30:00Z').toISOString(),
        },
        {
            postId: 4,
            authorId: 'consumer_karan_01',
            content: 'Check your agreement first. Some builders have force majeure clauses for certain delays.',
            createdAt: new Date('2024-02-05T18:00:00Z').toISOString(),
        },
        {
            postId: 4,
            authorId: 'consumer_sneha_01',
            content: 'Lawyer consultation is advisable. Many consumer forums can help free of cost.',
            createdAt: new Date('2024-02-05T18:30:00Z').toISOString(),
        },

        // Comments for Post 5 (Tiles brands)
        {
            postId: 5,
            authorId: 'provider_blr_01',
            content: 'Kajaria and Somany have good options under ₹60. Visit our showroom, we have extensive collection.',
            createdAt: new Date('2024-02-13T10:45:00Z').toISOString(),
        },
        {
            postId: 5,
            authorId: 'consumer_neha_01',
            content: 'I used Nitco tiles, very durable. Around ₹55/sqft and great designs.',
            createdAt: new Date('2024-02-13T11:15:00Z').toISOString(),
        },
        {
            postId: 5,
            authorId: 'consumer_amit_01',
            content: 'For Bangalore humidity, go for vitrified tiles. They don\'t absorb water.',
            createdAt: new Date('2024-02-13T11:45:00Z').toISOString(),
        },

        // Comments for Post 6 (Sanitaryware)
        {
            postId: 6,
            authorId: 'consumer_rahul_01',
            content: 'What\'s the warranty period on Kohler products?',
            createdAt: new Date('2024-02-11T14:00:00Z').toISOString(),
        },
        {
            postId: 6,
            authorId: 'consumer_sneha_01',
            content: 'Do you deliver to Noida? What\'s the delivery time?',
            createdAt: new Date('2024-02-11T14:30:00Z').toISOString(),
        },
        {
            postId: 6,
            authorId: 'consumer_karan_01',
            content: 'Great offer! Can you share the complete product catalog?',
            createdAt: new Date('2024-02-11T15:00:00Z').toISOString(),
        },

        // Comments for Post 7 (Interior designer)
        {
            postId: 7,
            authorId: 'consumer_neha_01',
            content: 'Contact Studio Aesthetics. They did my place beautifully within budget.',
            createdAt: new Date('2024-02-09T15:45:00Z').toISOString(),
        },
        {
            postId: 7,
            authorId: 'consumer_amit_01',
            content: 'Try online platforms like Livspace or HomeLane. Good designs and fixed pricing.',
            createdAt: new Date('2024-02-09T16:15:00Z').toISOString(),
        },
        {
            postId: 7,
            authorId: 'consumer_sneha_01',
            content: 'For minimalist, look at Japanese-inspired designs. Very clean and functional.',
            createdAt: new Date('2024-02-09T16:45:00Z').toISOString(),
        },

        // Comments for Post 8 (Waterproofing)
        {
            postId: 8,
            authorId: 'consumer_rahul_01',
            content: 'Does this include labor cost or just materials?',
            createdAt: new Date('2024-02-14T09:30:00Z').toISOString(),
        },
        {
            postId: 8,
            authorId: 'consumer_amit_01',
            content: 'Dr. Fixit is reliable brand. Used it for my terrace, no leakage for 3 years now.',
            createdAt: new Date('2024-02-14T10:00:00Z').toISOString(),
        },

        // Comments for Post 9 (RERA guidelines)
        {
            postId: 9,
            authorId: 'consumer_neha_01',
            content: 'Thanks for sharing! This is very helpful for buyers.',
            createdAt: new Date('2024-02-01T08:30:00Z').toISOString(),
        },
        {
            postId: 9,
            authorId: 'consumer_rahul_01',
            content: 'Does this apply to ongoing projects or only new ones?',
            createdAt: new Date('2024-02-01T09:00:00Z').toISOString(),
        },
        {
            postId: 9,
            authorId: 'consumer_amit_01',
            content: 'Great step by government. More transparency needed in real estate.',
            createdAt: new Date('2024-02-01T09:30:00Z').toISOString(),
        },

        // Comments for Post 10 (Renovation breakdown)
        {
            postId: 10,
            authorId: 'consumer_karan_01',
            content: 'Very helpful breakdown! Which tiles brand did you use?',
            createdAt: new Date('2024-02-07T12:30:00Z').toISOString(),
        },
        {
            postId: 10,
            authorId: 'consumer_sneha_01',
            content: 'Kitchen cost seems high. What all did you include?',
            createdAt: new Date('2024-02-07T13:00:00Z').toISOString(),
        },
        {
            postId: 10,
            authorId: 'consumer_neha_01',
            content: 'This matches my estimates too. Good reference for others planning renovation.',
            createdAt: new Date('2024-02-07T13:30:00Z').toISOString(),
        },

        // Comments for Post 11 (Teak doors)
        {
            postId: 11,
            authorId: 'consumer_sneha_01',
            content: 'What\'s the thickness of doors? Need for main entrance.',
            createdAt: new Date('2024-02-06T11:00:00Z').toISOString(),
        },
        {
            postId: 11,
            authorId: 'consumer_rahul_01',
            content: 'Do you customize designs? Have specific requirements.',
            createdAt: new Date('2024-02-06T11:30:00Z').toISOString(),
        },

        // Comments for Post 12 (Wall putty)
        {
            postId: 12,
            authorId: 'consumer_amit_01',
            content: 'Putty is essential! Gives smooth finish and paint lasts longer. Worth the cost.',
            createdAt: new Date('2024-02-04T15:00:00Z').toISOString(),
        },
        {
            postId: 12,
            authorId: 'provider_jpr_01',
            content: 'Yes, putty is necessary for good finish. Prevents cracks and ensures even surface.',
            createdAt: new Date('2024-02-04T15:30:00Z').toISOString(),
        },
        {
            postId: 12,
            authorId: 'consumer_karan_01',
            content: 'I skipped putty once and regretted. Paint peeled off in 6 months. Don\'t skip it!',
            createdAt: new Date('2024-02-04T16:00:00Z').toISOString(),
        },
    ];

    await db.insert(socialComments).values(sampleComments);

    // Sample Social Groups
    const sampleGroups = [
        {
            name: 'Jaipur Home Builders & Renovators',
            ownerId: 'consumer_amit_01',
            description: 'Community for Jaipur residents. Share experiences and recommendations.',
            visibility: 'public',
            membersCount: 127,
            createdAt: new Date('2024-01-15T00:00:00Z').toISOString(),
        },
        {
            name: 'Interior Design Enthusiasts India',
            ownerId: 'consumer_neha_01',
            description: 'For design lovers. Share ideas and trends.',
            visibility: 'public',
            membersCount: 89,
            createdAt: new Date('2024-01-18T00:00:00Z').toISOString(),
        },
        {
            name: 'Real Estate Legal Advice & RERA',
            ownerId: 'admin_vik_01',
            description: 'Legal advice on property. RERA complaints help.',
            visibility: 'public',
            membersCount: 203,
            createdAt: new Date('2024-01-10T00:00:00Z').toISOString(),
        },
        {
            name: 'Construction Material Deals',
            ownerId: 'provider_jpr_01',
            description: 'Latest deals on materials. Exclusive discounts.',
            visibility: 'public',
            membersCount: 156,
            createdAt: new Date('2024-01-12T00:00:00Z').toISOString(),
        },
        {
            name: 'Luxury Projects & Premium Design',
            ownerId: 'consumer_sneha_01',
            description: 'High-end projects. Premium materials.',
            visibility: 'private',
            membersCount: 23,
            createdAt: new Date('2024-01-22T00:00:00Z').toISOString(),
        },
        {
            name: 'Bangalore Builders Community',
            ownerId: 'provider_blr_01',
            description: 'Connect with Bangalore builders.',
            visibility: 'public',
            membersCount: 94,
            createdAt: new Date('2024-01-14T00:00:00Z').toISOString(),
        },
    ];

    await db.insert(socialGroups).values(sampleGroups);

    // Sample Social Group Members
    const sampleGroupMembers = [
        // Jaipur Home Builders group
        {
            groupId: 1,
            userId: 'consumer_amit_01',
            role: 'admin',
            joinedAt: new Date('2024-01-15T00:00:00Z').toISOString(),
        },
        {
            groupId: 1,
            userId: 'consumer_neha_01',
            role: 'member',
            joinedAt: new Date('2024-01-16T08:00:00Z').toISOString(),
        },
        {
            groupId: 1,
            userId: 'provider_jpr_01',
            role: 'member',
            joinedAt: new Date('2024-01-17T10:00:00Z').toISOString(),
        },

        // Interior Design group
        {
            groupId: 2,
            userId: 'consumer_neha_01',
            role: 'admin',
            joinedAt: new Date('2024-01-18T00:00:00Z').toISOString(),
        },
        {
            groupId: 2,
            userId: 'consumer_sneha_01',
            role: 'member',
            joinedAt: new Date('2024-01-19T09:00:00Z').toISOString(),
        },

        // Legal Advice group
        {
            groupId: 3,
            userId: 'admin_vik_01',
            role: 'admin',
            joinedAt: new Date('2024-01-10T00:00:00Z').toISOString(),
        },
        {
            groupId: 3,
            userId: 'consumer_rahul_01',
            role: 'member',
            joinedAt: new Date('2024-01-11T14:00:00Z').toISOString(),
        },
        {
            groupId: 3,
            userId: 'consumer_amit_01',
            role: 'member',
            joinedAt: new Date('2024-01-12T11:00:00Z').toISOString(),
        },

        // Material Deals group
        {
            groupId: 4,
            userId: 'provider_jpr_01',
            role: 'admin',
            joinedAt: new Date('2024-01-12T00:00:00Z').toISOString(),
        },
        {
            groupId: 4,
            userId: 'provider_del_01',
            role: 'member',
            joinedAt: new Date('2024-01-13T10:00:00Z').toISOString(),
        },

        // Luxury Projects group
        {
            groupId: 5,
            userId: 'consumer_sneha_01',
            role: 'admin',
            joinedAt: new Date('2024-01-22T00:00:00Z').toISOString(),
        },

        // Bangalore Builders group
        {
            groupId: 6,
            userId: 'provider_blr_01',
            role: 'admin',
            joinedAt: new Date('2024-01-14T00:00:00Z').toISOString(),
        },
    ];

    await db.insert(socialGroupMembers).values(sampleGroupMembers);

    console.log('✅ Social data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});