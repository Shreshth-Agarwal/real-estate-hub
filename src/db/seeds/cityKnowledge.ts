import { db } from '@/db';
import { cityKnowledge, verificationDocs } from '@/db/schema';

async function main() {
    // Create city knowledge entries
    const sampleCityKnowledge = [
        {
            regionCode: 'JAI',
            summaryMd: `# Jaipur - Real Estate Information

## Master Plan Overview
Jaipur Development Authority (JDA) Master Plan 2025 covers 650 sq km area including extended zones.

## Key Development Areas
- Vaishali Nagar, Malviya Nagar (Fully developed)
- Mansarovar Extension (Developing)
- Jagatpura, Ajmer Road (High growth)

## Property Guidelines
- FAR: 1.5 to 2.0 (varies by zone)
- Maximum height: 15 meters (residential)
- Setbacks: Front 6m, Sides 3m

## Important Contacts
- JDA Office: 0141-2740112
- Municipal Corporation: 0141-2616241`,
            govContacts: JSON.stringify({
                jda: { name: 'Jaipur Development Authority', phone: '0141-2740112', email: 'jda@rajasthan.gov.in' },
                corporation: { name: 'Jaipur Municipal Corporation', phone: '0141-2616241', email: 'jmc@jaipur.rajasthan.gov.in' },
                rera: { name: 'RERA Rajasthan', phone: '0141-2227424', website: 'https://rera.rajasthan.gov.in' }
            }),
            planningDocs: JSON.stringify(['JDA Master Plan 2025', 'Zoning Regulations', 'Building Bylaws 2020']),
            utilitySteps: JSON.stringify({
                water: ['Apply at PHED office', 'Submit property documents', 'Pay connection fee ₹5000-8000', 'Installation in 15 days'],
                electricity: ['Visit Jaipur Discom', 'Submit load application', 'Pay as per load', 'Connection in 7 days'],
                sewage: ['Apply at JMC', 'Pay sewerage charges', 'Connection approval in 10 days']
            }),
            lastRefreshed: '2024-02-15T00:00:00Z',
        },
        {
            regionCode: 'DEL',
            summaryMd: `# Delhi - Real Estate Information

## Master Plan Overview
Delhi Master Plan 2041 focuses on sustainable urban development with emphasis on public transport and green spaces.

## Key Development Areas
- Dwarka, Rohini (Established)
- Karol Bagh, Connaught Place (Central)
- Sectors 18-22 (Commercial hubs)

## Property Guidelines
- FAR: 2.0 to 3.5 (varies by zone)
- Maximum height: 15-45 meters
- EWS requirement: 10-15% in group housing`,
            govContacts: JSON.stringify({
                dda: { name: 'Delhi Development Authority', phone: '011-23716658', email: 'dda@gov.in' },
                corporation: { name: 'North Delhi Municipal Corporation', phone: '011-23819389' },
                rera: { name: 'Delhi RERA', website: 'https://rera.delhi.gov.in' }
            }),
            planningDocs: JSON.stringify(['Master Plan 2041', 'Building Bylaws 2016', 'Unified Building Bye-Laws']),
            utilitySteps: JSON.stringify({
                water: ['Apply at DJB', 'Property papers required', 'Fee: ₹7000-12000', 'Connection in 21 days'],
                electricity: ['BSES/TATA Power', 'Online application', 'Load-based charges', 'Connection in 7-15 days'],
                sewage: ['Included with water connection', 'Additional sewerage charge', 'Automatic with water']
            }),
            lastRefreshed: '2024-02-14T00:00:00Z',
        },
        {
            regionCode: 'MUM',
            summaryMd: `# Mumbai - Real Estate Information

## Development Plan
Mumbai Development Plan 2034 emphasizes vertical growth and transit-oriented development.

## Key Areas
- Andheri, Bandra (Established)
- Navi Mumbai (Planned city)
- Thane, Kalyan (Satellite cities)

## Property Guidelines
- FSI: 1.33 to 3.0 (varies by zone)
- Premium FSI available on payment
- Coastal Regulation Zone restrictions`,
            govContacts: JSON.stringify({
                mcgm: { name: 'Municipal Corporation of Greater Mumbai', phone: '022-22694727', website: 'https://portal.mcgm.gov.in' },
                mhada: { name: 'Maharashtra Housing Authority', phone: '022-24131956' },
                rera: { name: 'MahaRERA', website: 'https://maharera.mahaonline.gov.in' }
            }),
            planningDocs: JSON.stringify(['DP 2034', 'DCR 2034', 'ULCRA Guidelines']),
            utilitySteps: JSON.stringify({
                water: ['Apply at BMC Ward Office', 'NOC from society', 'Fee: ₹10000-15000', 'Connection in 30 days'],
                electricity: ['MSEDCL/Adani/Tata Power', 'Deposit based on load', 'Charges vary by area', 'Connection in 7-21 days'],
                sewage: ['Apply at MCGM', 'Property tax clearance', 'Sewerage charges apply']
            }),
            lastRefreshed: '2024-02-13T00:00:00Z',
        },
        {
            regionCode: 'BLR',
            summaryMd: `# Bangalore - Real Estate Information

## Master Plan
Revised Master Plan 2031 covers Bangalore Metropolitan Area with focus on IT corridors and infrastructure.

## Key Areas
- Whitefield, Electronic City (IT hubs)
- MG Road, Indiranagar (Central)
- Sarjapur, Hennur (Emerging)

## Property Guidelines
- FAR: 1.75 to 3.25 (varies by zone)
- Special provisions for IT parks
- Green building norms mandatory`,
            govContacts: JSON.stringify({
                bda: { name: 'Bangalore Development Authority', phone: '080-22867254', website: 'https://www.bdabangalore.org' },
                bbmp: { name: 'Bruhat Bengaluru Mahanagara Palike', phone: '080-22660000' },
                rera: { name: 'Karnataka RERA', website: 'https://rera.karnataka.gov.in' }
            }),
            planningDocs: JSON.stringify(['RMP 2031', 'Zoning Regulations', 'Building Bylaws 2020']),
            utilitySteps: JSON.stringify({
                water: ['Apply at BWSSB', 'Site inspection', 'Fee: ₹6000-10000', 'Connection in 15-20 days'],
                electricity: ['BESCOM', 'Online application', 'Load sanctioning', 'Connection in 7-14 days'],
                sewage: ['BWSSB application', 'Sewerage connection fee', 'Inspection required']
            }),
            lastRefreshed: '2024-02-12T00:00:00Z',
        },
    ];

    await db.insert(cityKnowledge).values(sampleCityKnowledge);
    console.log('✅ City knowledge seeded: 4 cities created');

    // Create verification documents for providers
    const sampleVerificationDocs = [
        { userId: 'user_suresh_01', docType: 'GST', docUrl: 'https://example.com/docs/gst_suresh.pdf', ocrJson: JSON.stringify({ gstNumber: '29ABCDE1234F1Z5', businessName: 'Jaipur Building Supplies' }), status: 'approved', reviewedBy: 'user_admin_hub4estate', reviewedAt: '2024-01-06T00:00:00Z', createdAt: '2024-01-05T00:00:00Z' },
        { userId: 'user_suresh_01', docType: 'TRADE_LICENSE', docUrl: 'https://example.com/docs/license_suresh.pdf', ocrJson: JSON.stringify({ licenseNumber: 'TL/JAI/2023/4567', validUpto: '2025-03-31' }), status: 'approved', reviewedBy: 'user_admin_hub4estate', reviewedAt: '2024-01-06T00:00:00Z', createdAt: '2024-01-05T00:00:00Z' },
        { userId: 'user_ramesh_01', docType: 'GST', docUrl: 'https://example.com/docs/gst_ramesh.pdf', ocrJson: JSON.stringify({ gstNumber: '07FGHIJ5678K1L9', businessName: 'Delhi Tiles & Marble Hub' }), status: 'approved', reviewedBy: 'user_admin_hub4estate', reviewedAt: '2024-01-07T00:00:00Z', createdAt: '2024-01-06T00:00:00Z' },
        { userId: 'user_kiran_01', docType: 'GST', docUrl: 'https://example.com/docs/gst_kiran.pdf', ocrJson: JSON.stringify({ gstNumber: '27MNOPQ9012R3S4', businessName: 'Mumbai Construction Materials' }), status: 'pending', reviewedBy: null, reviewedAt: null, createdAt: '2024-01-07T00:00:00Z' },
        { userId: 'user_kiran_01', docType: 'PAN', docUrl: 'https://example.com/docs/pan_kiran.pdf', ocrJson: JSON.stringify({ panNumber: 'ABCDE1234F' }), status: 'pending', reviewedBy: null, reviewedAt: null, createdAt: '2024-01-07T00:00:00Z' },
        { userId: 'user_deepak_01', docType: 'GST', docUrl: 'https://example.com/docs/gst_deepak.pdf', ocrJson: JSON.stringify({ gstNumber: '29TUVWX3456Y7Z8', businessName: 'Bangalore Premium Interiors' }), status: 'approved', reviewedBy: 'user_admin_hub4estate', reviewedAt: '2024-01-09T00:00:00Z', createdAt: '2024-01-08T00:00:00Z' },
    ];

    await db.insert(verificationDocs).values(sampleVerificationDocs);
    console.log('✅ Verification docs seeded: 6 documents created');
}

main().catch((error) => {
    console.error('❌ City knowledge seeder failed:', error);
});
