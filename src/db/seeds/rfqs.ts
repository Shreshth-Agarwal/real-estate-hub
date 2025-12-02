import { db } from '@/db';
import { rfqRequests, quotes } from '@/db/schema';

async function main() {
    // Create 20 RFQ requests
    const sampleRFQs = [
        { catalogId: 1, consumerId: 'user_rajesh_01', providerId: 'user_suresh_01', quantity: 1200, unit: 'sqft', message: 'Need premium floor tiles for living room and bedrooms. Please quote best price.', preferredDate: '2024-02-25', status: 'accepted', createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        { catalogId: 3, consumerId: 'user_priya_01', providerId: 'user_suresh_01', quantity: 150, unit: 'bag', message: 'Required for villa foundation work. Need delivery in Mansarovar.', preferredDate: '2024-03-05', status: 'responded', createdAt: '2024-01-12T00:00:00Z', updatedAt: '2024-01-14T00:00:00Z' },
        { catalogId: 5, consumerId: 'user_amit_01', providerId: 'user_suresh_01', quantity: 2500, unit: 'kg', message: 'TMT bars for office construction. Urgent requirement.', preferredDate: '2024-02-20', status: 'submitted', createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' },
        { catalogId: 9, consumerId: 'user_sneha_01', providerId: 'user_ramesh_01', quantity: 800, unit: 'sqft', message: 'Italian marble for kitchen flooring. Looking for best quality.', preferredDate: '2024-02-15', status: 'responded', createdAt: '2024-01-06T00:00:00Z', updatedAt: '2024-01-08T00:00:00Z' },
        { catalogId: 11, consumerId: 'user_vikram_01', providerId: 'user_ramesh_01', quantity: 450, unit: 'sqft', message: 'Black galaxy granite for kitchen countertop.', preferredDate: '2024-02-22', status: 'accepted', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-22T00:00:00Z' },
        { catalogId: 14, consumerId: 'user_rajesh_01', providerId: 'user_ramesh_01', quantity: 350, unit: 'sqft', message: 'Bathroom wall tiles needed urgently.', preferredDate: '2024-02-18', status: 'submitted', createdAt: '2024-02-05T00:00:00Z', updatedAt: '2024-02-05T00:00:00Z' },
        { catalogId: 17, consumerId: 'user_priya_01', providerId: 'user_kiran_01', quantity: 200, unit: 'bag', message: 'ACC Gold cement for structural work.', preferredDate: '2024-03-10', status: 'responded', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-17T00:00:00Z' },
        { catalogId: 19, consumerId: 'user_amit_01', providerId: 'user_kiran_01', quantity: 3000, unit: 'kg', message: 'TATA steel bars for office building foundation.', preferredDate: '2024-02-28', status: 'submitted', createdAt: '2024-02-08T00:00:00Z', updatedAt: '2024-02-08T00:00:00Z' },
        { catalogId: 21, consumerId: 'user_sneha_01', providerId: 'user_kiran_01', quantity: 50, unit: 'ltr', message: 'Asian Paints Royale for entire house interior painting.', preferredDate: '2024-02-20', status: 'responded', createdAt: '2024-02-06T00:00:00Z', updatedAt: '2024-02-08T00:00:00Z' },
        { catalogId: 25, consumerId: 'user_vikram_01', providerId: 'user_deepak_01', quantity: 2, unit: 'set', message: 'Premium Hindware sanitaryware for 2 bathrooms.', preferredDate: '2024-02-25', status: 'accepted', createdAt: '2024-01-19T00:00:00Z', updatedAt: '2024-01-21T00:00:00Z' },
        { catalogId: 27, consumerId: 'user_rajesh_01', providerId: 'user_deepak_01', quantity: 80, unit: 'piece', message: 'Havells switches for entire apartment.', preferredDate: '2024-02-20', status: 'submitted', createdAt: '2024-02-02T00:00:00Z', updatedAt: '2024-02-02T00:00:00Z' },
        { catalogId: 29, consumerId: 'user_amit_01', providerId: 'user_deepak_01', quantity: 250, unit: 'sqft', message: 'Marine plywood for office cabin partitions.', preferredDate: '2024-02-22', status: 'responded', createdAt: '2024-01-28T00:00:00Z', updatedAt: '2024-01-30T00:00:00Z' },
        { catalogId: null, consumerId: 'user_priya_01', providerId: null, quantity: 100, unit: 'bag', message: 'Looking for competitive quotes on PPC cement 50kg bags. Delivery needed in Jaipur.', preferredDate: '2024-03-01', status: 'submitted', createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z' },
        { catalogId: null, consumerId: 'user_sneha_01', providerId: null, quantity: 600, unit: 'sqft', message: 'Need anti-skid tiles for outdoor patio area.', preferredDate: '2024-02-18', status: 'submitted', createdAt: '2024-02-07T00:00:00Z', updatedAt: '2024-02-07T00:00:00Z' },
        { catalogId: 7, consumerId: 'user_vikram_01', providerId: 'user_suresh_01', quantity: 280, unit: 'sqft', message: 'Wall tiles for kitchen and bathroom.', preferredDate: '2024-02-24', status: 'rejected', createdAt: '2024-01-25T00:00:00Z', updatedAt: '2024-01-27T00:00:00Z' },
        { catalogId: 12, consumerId: 'user_rajesh_01', providerId: 'user_ramesh_01', quantity: 950, unit: 'sqft', message: 'Double charge vitrified tiles for commercial space.', preferredDate: '2024-02-28', status: 'submitted', createdAt: '2024-02-09T00:00:00Z', updatedAt: '2024-02-09T00:00:00Z' },
        { catalogId: 18, consumerId: 'user_priya_01', providerId: 'user_kiran_01', quantity: 80, unit: 'bag', message: 'Ultratech Super cement for RCC work.', preferredDate: '2024-03-12', status: 'submitted', createdAt: '2024-02-11T00:00:00Z', updatedAt: '2024-02-11T00:00:00Z' },
        { catalogId: 22, consumerId: 'user_amit_01', providerId: 'user_kiran_01', quantity: 40, unit: 'ltr', message: 'Exterior paint for office building facade.', preferredDate: '2024-03-05', status: 'expired', createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-01-25T00:00:00Z' },
        { catalogId: 26, consumerId: 'user_sneha_01', providerId: 'user_deepak_01', quantity: 1, unit: 'set', message: 'Jaquar fittings for premium bathroom renovation.', preferredDate: '2024-02-19', status: 'submitted', createdAt: '2024-02-04T00:00:00Z', updatedAt: '2024-02-04T00:00:00Z' },
        { catalogId: 30, consumerId: 'user_vikram_01', providerId: 'user_deepak_01', quantity: 180, unit: 'sqft', message: 'MR grade plywood for modular kitchen cabinets.', preferredDate: '2024-02-26', status: 'submitted', createdAt: '2024-02-03T00:00:00Z', updatedAt: '2024-02-03T00:00:00Z' },
    ];

    await db.insert(rfqRequests).values(sampleRFQs);
    console.log('✅ RFQ requests seeded: 20 RFQs created');

    // Create quotes for RFQs with status responded/accepted/rejected
    const sampleQuotes = [
        // RFQ 1 (accepted)
        { rfqId: 1, providerId: 'user_suresh_01', price: 82, currency: 'INR', deliveryEtaDays: 5, notes: 'Best quality Kajaria tiles with 10% discount on bulk order. Free delivery within 30km.', status: 'accepted', createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        
        // RFQ 2 (responded)
        { rfqId: 2, providerId: 'user_suresh_01', price: 380, currency: 'INR', deliveryEtaDays: 3, notes: 'Fresh stock available. Delivery to Mansarovar in 3 days.', status: 'pending', createdAt: '2024-01-13T00:00:00Z', updatedAt: '2024-01-13T00:00:00Z' },
        { rfqId: 2, providerId: 'user_kiran_01', price: 375, currency: 'INR', deliveryEtaDays: 4, notes: 'Competitive pricing for bulk orders. Free technical support.', status: 'pending', createdAt: '2024-01-14T00:00:00Z', updatedAt: '2024-01-14T00:00:00Z' },
        
        // RFQ 4 (responded)
        { rfqId: 4, providerId: 'user_ramesh_01', price: 420, currency: 'INR', deliveryEtaDays: 7, notes: 'Premium Italian Statuario marble. First grade quality with certification.', status: 'pending', createdAt: '2024-01-07T00:00:00Z', updatedAt: '2024-01-07T00:00:00Z' },
        { rfqId: 4, providerId: 'user_suresh_01', price: 410, currency: 'INR', deliveryEtaDays: 10, notes: 'Imported marble with proper documentation. Expert installation available.', status: 'pending', createdAt: '2024-01-08T00:00:00Z', updatedAt: '2024-01-08T00:00:00Z' },
        
        // RFQ 5 (accepted)
        { rfqId: 5, providerId: 'user_ramesh_01', price: 280, currency: 'INR', deliveryEtaDays: 4, notes: 'Black Galaxy granite - premium grade. Polishing included in price.', status: 'accepted', createdAt: '2024-01-21T00:00:00Z', updatedAt: '2024-01-22T00:00:00Z' },
        
        // RFQ 7 (responded)
        { rfqId: 7, providerId: 'user_kiran_01', price: 408, currency: 'INR', deliveryEtaDays: 2, notes: 'ACC Gold cement in stock. Fast delivery available.', status: 'pending', createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
        { rfqId: 7, providerId: 'user_suresh_01', price: 395, currency: 'INR', deliveryEtaDays: 3, notes: 'ACC cement with 5% discount on 200 bags. Genuine product with bill.', status: 'pending', createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-01-17T00:00:00Z' },
        
        // RFQ 9 (responded)
        { rfqId: 9, providerId: 'user_kiran_01', price: 478, currency: 'INR', deliveryEtaDays: 5, notes: 'Asian Paints Royale with Teflon protection. Color consultation available.', status: 'pending', createdAt: '2024-02-07T00:00:00Z', updatedAt: '2024-02-07T00:00:00Z' },
        
        // RFQ 10 (accepted)
        { rfqId: 10, providerId: 'user_deepak_01', price: 12200, currency: 'INR', deliveryEtaDays: 7, notes: 'Premium Hindware set with 5-year warranty. Professional installation included.', status: 'accepted', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-21T00:00:00Z' },
        
        // RFQ 12 (responded)
        { rfqId: 12, providerId: 'user_deepak_01', price: 122, currency: 'INR', deliveryEtaDays: 6, notes: 'Century marine plywood BWP grade. Suitable for office partitions.', status: 'pending', createdAt: '2024-01-29T00:00:00Z', updatedAt: '2024-01-29T00:00:00Z' },
        
        // RFQ 15 (rejected)
        { rfqId: 15, providerId: 'user_suresh_01', price: 52, currency: 'INR', deliveryEtaDays: 8, notes: 'Wall tiles available. Limited stock.', status: 'rejected', createdAt: '2024-01-26T00:00:00Z', updatedAt: '2024-01-27T00:00:00Z' },
    ];

    await db.insert(quotes).values(sampleQuotes);
    console.log('✅ Quotes seeded: 12 quotes created');
}

main().catch((error) => {
    console.error('❌ RFQs seeder failed:', error);
});
