import { db } from '@/db';
import { socialPosts, socialComments, socialGroups, socialGroupMembers, ratings, notifications } from '@/db/schema';

async function main() {
    // Create social posts
    const samplePosts = [
        { authorId: 'user_rajesh_01', content: 'Just completed my 2BHK renovation! The Kajaria tiles look amazing. Highly recommend checking out premium floor tiles for modern homes. #HomeRenovation #InteriorDesign', mediaUrls: JSON.stringify([]), likesCount: 24, commentsCount: 5, createdAt: '2024-02-12T10:30:00Z', updatedAt: '2024-02-12T10:30:00Z' },
        { authorId: 'user_suresh_01', content: 'New stock alert! Premium Italian marble at special discounted prices this week only. DM for bulk orders. Free delivery within 50km. #BuildingMaterials #Marble', mediaUrls: JSON.stringify([]), likesCount: 18, commentsCount: 3, createdAt: '2024-02-11T14:20:00Z', updatedAt: '2024-02-11T14:20:00Z' },
        { authorId: 'user_priya_01', content: 'Can anyone recommend a good contractor for villa construction in Jaipur? Looking for someone experienced with modern architecture. Budget around 45L.', mediaUrls: JSON.stringify([]), likesCount: 32, commentsCount: 12, createdAt: '2024-02-10T09:15:00Z', updatedAt: '2024-02-10T09:15:00Z' },
        { authorId: 'user_ramesh_01', content: 'Expert tip: Always buy 10-15% extra tiles to account for breakage and future repairs. Keep the same batch number for color consistency! #TileInstallation #ProTip', mediaUrls: JSON.stringify([]), likesCount: 45, commentsCount: 8, createdAt: '2024-02-09T16:45:00Z', updatedAt: '2024-02-09T16:45:00Z' },
        { authorId: 'user_amit_01', content: 'Office interior project coming along nicely! Bangalore Premium Interiors did an excellent job with the modular furniture and lighting. Very professional service.', mediaUrls: JSON.stringify([]), likesCount: 28, commentsCount: 6, createdAt: '2024-02-08T11:30:00Z', updatedAt: '2024-02-08T11:30:00Z' },
        { authorId: 'user_sneha_01', content: 'PSA: Check RERA registration before booking any property! Just saved myself from a potential scam. Do your due diligence, folks. #RERA #HomeBuying', mediaUrls: JSON.stringify([]), likesCount: 52, commentsCount: 15, createdAt: '2024-02-07T13:20:00Z', updatedAt: '2024-02-07T13:20:00Z' },
        { authorId: 'user_kiran_01', content: 'Flash sale on Asian Paints this weekend! Premium interior emulsion at ₹450/ltr. First come first served. Limited stock available in Mumbai. #PaintSale #HomePainting', mediaUrls: JSON.stringify([]), likesCount: 19, commentsCount: 4, createdAt: '2024-02-06T10:00:00Z', updatedAt: '2024-02-06T10:00:00Z' },
        { authorId: 'user_vikram_01', content: 'Finally got my bathroom upgrade done! Hindware fixtures are worth every penny. The water pressure and finish quality is exceptional. #BathroomRenovation', mediaUrls: JSON.stringify([]), likesCount: 21, commentsCount: 7, createdAt: '2024-02-05T15:45:00Z', updatedAt: '2024-02-05T15:45:00Z' },
        { authorId: 'user_deepak_01', content: 'Excited to announce we are now authorized dealers for Legrand switches! Premium quality modular switches with 10-year warranty. Visit our Bangalore showroom. #Electrical #Switches', mediaUrls: JSON.stringify([]), likesCount: 16, commentsCount: 2, createdAt: '2024-02-04T12:30:00Z', updatedAt: '2024-02-04T12:30:00Z' },
        { authorId: 'user_rajesh_01', content: 'Question: What is the best waterproofing solution for terrace in Jaipur? Dealing with seepage issues during monsoon. Any recommendations?', mediaUrls: JSON.stringify([]), likesCount: 38, commentsCount: 18, createdAt: '2024-02-03T09:00:00Z', updatedAt: '2024-02-03T09:00:00Z' },
    ];

    await db.insert(socialPosts).values(samplePosts);
    console.log('✅ Social posts seeded: 10 posts created');

    // Create comments
    const sampleComments = [
        { postId: 1, authorId: 'user_priya_01', content: 'Looks beautiful! Which design did you choose? I am planning a similar renovation.', createdAt: '2024-02-12T11:00:00Z' },
        { postId: 1, authorId: 'user_suresh_01', content: 'Thank you for the recommendation! Glad you loved our products.', createdAt: '2024-02-12T11:15:00Z' },
        { postId: 1, authorId: 'user_amit_01', content: 'How much did the complete renovation cost? Including labor and materials?', createdAt: '2024-02-12T12:30:00Z' },
        { postId: 3, authorId: 'user_suresh_01', content: 'I can connect you with experienced contractors in Jaipur. DM me!', createdAt: '2024-02-10T09:45:00Z' },
        { postId: 3, authorId: 'user_vikram_01', content: 'Check reviews on Hub4Estate. Lots of verified contractors with ratings.', createdAt: '2024-02-10T10:20:00Z' },
        { postId: 4, authorId: 'user_rajesh_01', content: 'Great advice! Learned this the hard way during my renovation.', createdAt: '2024-02-09T17:00:00Z' },
        { postId: 6, authorId: 'user_amit_01', content: 'This is so important! More people need to know about RERA protection.', createdAt: '2024-02-07T13:45:00Z' },
        { postId: 6, authorId: 'user_priya_01', content: 'Can you share how to check RERA registration? Is there an official website?', createdAt: '2024-02-07T14:10:00Z' },
        { postId: 10, authorId: 'user_ramesh_01', content: 'Try Dr. Fixit or Fosroc waterproofing. Both work well in Rajasthan climate.', createdAt: '2024-02-03T09:30:00Z' },
        { postId: 10, authorId: 'user_kiran_01', content: 'We have specialized waterproofing solutions. Can provide quote with site visit.', createdAt: '2024-02-03T10:00:00Z' },
    ];

    await db.insert(socialComments).values(sampleComments);
    console.log('✅ Social comments seeded: 10 comments created');

    // Create social groups
    const sampleGroups = [
        { name: 'Jaipur Home Builders', description: 'Community for home builders and renovators in Jaipur. Share experiences, get recommendations, and connect with professionals.', visibility: 'public', ownerId: 'user_rajesh_01', membersCount: 124, createdAt: '2024-01-05T00:00:00Z' },
        { name: 'Interior Design Enthusiasts', description: 'Passionate about interior design? Join us to share ideas, latest trends, and get expert advice on home interiors.', visibility: 'public', ownerId: 'user_priya_01', membersCount: 89, createdAt: '2024-01-10T00:00:00Z' },
        { name: 'Real Estate Legal Advice', description: 'Get legal guidance on property matters, RERA complaints, and documentation. Verified lawyers available.', visibility: 'public', ownerId: 'user_admin_hub4estate', membersCount: 256, createdAt: '2024-01-01T00:00:00Z' },
        { name: 'Construction Material Deals', description: 'Best deals and discounts on construction materials. Direct supplier connections and bulk order discounts.', visibility: 'public', ownerId: 'user_suresh_01', membersCount: 178, createdAt: '2024-01-08T00:00:00Z' },
        { name: 'Bangalore Property Investors', description: 'Private group for serious property investors in Bangalore. Share investment opportunities and market insights.', visibility: 'private', ownerId: 'user_amit_01', membersCount: 45, createdAt: '2024-01-15T00:00:00Z' },
        { name: 'Sustainable Construction', description: 'Discuss eco-friendly building materials, green construction techniques, and sustainable architecture.', visibility: 'public', ownerId: 'user_deepak_01', membersCount: 67, createdAt: '2024-01-20T00:00:00Z' },
    ];

    await db.insert(socialGroups).values(sampleGroups);
    console.log('✅ Social groups seeded: 6 groups created');

    // Create group members
    const sampleGroupMembers = [
        { groupId: 1, userId: 'user_rajesh_01', role: 'admin', joinedAt: '2024-01-05T00:00:00Z' },
        { groupId: 1, userId: 'user_priya_01', role: 'member', joinedAt: '2024-01-06T00:00:00Z' },
        { groupId: 1, userId: 'user_suresh_01', role: 'member', joinedAt: '2024-01-07T00:00:00Z' },
        { groupId: 2, userId: 'user_priya_01', role: 'admin', joinedAt: '2024-01-10T00:00:00Z' },
        { groupId: 2, userId: 'user_amit_01', role: 'member', joinedAt: '2024-01-12T00:00:00Z' },
        { groupId: 3, userId: 'user_admin_hub4estate', role: 'admin', joinedAt: '2024-01-01T00:00:00Z' },
        { groupId: 4, userId: 'user_suresh_01', role: 'admin', joinedAt: '2024-01-08T00:00:00Z' },
        { groupId: 5, userId: 'user_amit_01', role: 'admin', joinedAt: '2024-01-15T00:00:00Z' },
    ];

    await db.insert(socialGroupMembers).values(sampleGroupMembers);
    console.log('✅ Group members seeded: 8 members created');

    // Create ratings
    const sampleRatings = [
        { raterId: 'user_rajesh_01', targetType: 'provider', targetId: 1, score: 5, reviewMd: 'Excellent service and product quality! Fast delivery and professional team. Highly recommended for construction materials.', createdAt: '2024-02-12T00:00:00Z' },
        { raterId: 'user_priya_01', targetType: 'provider', targetId: 2, score: 5, reviewMd: 'Beautiful marble collection with genuine Italian imports. Deepak provided expert consultation for our villa project.', createdAt: '2024-01-16T00:00:00Z' },
        { raterId: 'user_amit_01', targetType: 'provider', targetId: 4, score: 5, reviewMd: 'Premium interior products with excellent after-sales service. Installation was smooth and professional.', createdAt: '2024-02-13T00:00:00Z' },
        { raterId: 'user_vikram_01', targetType: 'provider', targetId: 4, score: 5, reviewMd: 'Great quality Hindware products. Fair pricing and delivery was on time. Very satisfied with bathroom fixtures.', createdAt: '2024-01-24T00:00:00Z' },
        { raterId: 'user_sneha_01', targetType: 'provider', targetId: 1, score: 4, reviewMd: 'Good quality materials but slightly expensive. However, the reliability and trust factor makes it worth it.', createdAt: '2024-01-09T00:00:00Z' },
        { raterId: 'user_rajesh_01', targetType: 'catalog', targetId: 1, score: 5, reviewMd: 'Premium Kajaria tiles exceeded expectations. Beautiful finish and easy to maintain. Worth every rupee!', createdAt: '2024-02-11T00:00:00Z' },
        { raterId: 'user_vikram_01', targetType: 'catalog', targetId: 11, score: 5, reviewMd: 'Black Galaxy granite is stunning! Perfect for kitchen countertop. High quality polish and finish.', createdAt: '2024-01-23T00:00:00Z' },
        { raterId: 'user_sneha_01', targetType: 'catalog', targetId: 21, score: 4, reviewMd: 'Asian Paints Royale gives excellent coverage. Colors are vibrant and finish is smooth. A bit pricey but good quality.', createdAt: '2024-02-09T00:00:00Z' },
        { raterId: 'user_amit_01', targetType: 'catalog', targetId: 29, score: 5, reviewMd: 'Century Ply marine plywood is top quality. No delamination even after 6 months. Great for humid areas.', createdAt: '2024-02-01T00:00:00Z' },
        { raterId: 'user_priya_01', targetType: 'provider', targetId: 3, score: 3, reviewMd: 'Competitive prices for bulk orders but customer service needs improvement. Delivery was delayed by 3 days.', createdAt: '2024-01-19T00:00:00Z' },
    ];

    await db.insert(ratings).values(sampleRatings);
    console.log('✅ Ratings seeded: 10 ratings created');

    // Create notifications
    const sampleNotifications = [
        { userId: 'user_rajesh_01', type: 'rfq_response', title: 'New Quote Received', message: 'Jaipur Building Supplies sent you a quote for Premium Floor Tiles', link: '/rfq/1', read: false, createdAt: '2024-01-17T10:00:00Z' },
        { userId: 'user_priya_01', type: 'quote_received', title: 'Quote Submitted', message: 'You received 2 quotes for your cement RFQ', link: '/rfq/2', read: false, createdAt: '2024-01-14T14:30:00Z' },
        { userId: 'user_amit_01', type: 'project_update', title: 'Task Completed', message: 'Design consultation task marked as completed', link: '/projects/3', read: true, createdAt: '2024-01-23T16:20:00Z' },
        { userId: 'user_vikram_01', type: 'quote_received', title: 'Quote Accepted', message: 'Your quote for Black Galaxy granite has been accepted!', link: '/provider/rfq/5', read: true, createdAt: '2024-01-22T11:45:00Z' },
        { userId: 'user_sneha_01', type: 'rfq_response', title: 'New Quote Available', message: 'Check the latest quote for Asian Paints Royale', link: '/rfq/9', read: false, createdAt: '2024-02-07T09:15:00Z' },
        { userId: 'user_suresh_01', type: 'rfq_response', title: 'New RFQ Request', message: 'You have a new RFQ for TMT Steel Bars', link: '/provider/rfq/3', read: false, createdAt: '2024-02-01T08:30:00Z' },
        { userId: 'user_ramesh_01', type: 'rfq_response', title: 'RFQ Notification', message: 'New inquiry for Italian Marble from Sneha Gupta', link: '/provider/rfq/4', read: true, createdAt: '2024-01-07T12:00:00Z' },
        { userId: 'user_deepak_01', type: 'quote_received', title: 'Quote Request', message: 'Vikram Singh requested quote for Hindware Sanitaryware Set', link: '/provider/rfq/10', read: true, createdAt: '2024-01-20T15:30:00Z' },
        { userId: 'user_rajesh_01', type: 'new_member', title: 'Project Member Added', message: 'New member joined your 2BHK Renovation project', link: '/projects/1', read: true, createdAt: '2024-01-18T10:45:00Z' },
        { userId: 'user_priya_01', type: 'project_update', title: 'Task Update', message: 'Architect drawings approval is in progress', link: '/projects/2', read: false, createdAt: '2024-01-11T13:20:00Z' },
    ];

    await db.insert(notifications).values(sampleNotifications);
    console.log('✅ Notifications seeded: 10 notifications created');
}

main().catch((error) => {
    console.error('❌ Social data seeder failed:', error);
});
