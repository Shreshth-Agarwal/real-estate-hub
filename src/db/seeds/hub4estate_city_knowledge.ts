import { db } from '@/db';
import { cityKnowledge } from '@/db/schema';

async function main() {
    const sampleCityKnowledge = [
        {
            regionCode: 'RAJ-JAI-2024',
            summaryMd: "Jaipur, capital of Rajasthan, is experiencing rapid urbanization. JDA Master Plan 2025 focuses on sustainable development with green zones. The city has designated residential zones in Mansarovar, Vaishali, Malviya Nagar, and Jagatpura. Industrial areas in Sitapura and Jhotwara. New metro corridors are changing real estate dynamics. Property registration happens at sub-registrar offices. Stamp duty: 6% for men, 5% for women. Building plans must be approved by JDA.",
            govContacts: {
                jmc: '0141-2227011',
                jda: '0141-2228721',
                jdvvnl: '0141-2744433',
                phed: '0141-2227563',
                subRegistrar: '0141-2221456'
            },
            planningDocs: [
                {
                    title: 'JDA Master Plan 2025',
                    url: '/docs/jda-master-2025.pdf'
                },
                {
                    title: 'Building Bylaws Jaipur',
                    url: '/docs/jaipur-bylaws.pdf'
                },
                {
                    title: 'FAR Guidelines',
                    url: '/docs/far-guidelines.pdf'
                }
            ],
            utilitySteps: {
                water: 'Visit PHED office at Jhalana Institutional Area with property papers and ID. Submit application form with ₹500 fee. Connection within 15 days.',
                electricity: 'Apply online at jdvvnl.com. Upload property documents. Pay security deposit. Meter installation in 7 days.',
                sewage: 'JMC sewage connection: Visit ward office, submit application with house plan. ₹2000 connection fee.'
            },
            lastRefreshed: new Date('2024-02-01').toISOString(),
        },
        {
            regionCode: 'DL-NCT-2024',
            summaryMd: "Delhi NCT has complex jurisdiction with DDA, MCD, and NDMC. Master Plan Delhi 2041 guides development. Residential zones span across all districts. Stamp duty: 6% for men, 4% for women. Property registration through online portal. Building plans approved by local authority. RERA registered projects mandatory. Delhi Development Authority handles land use changes.",
            govContacts: {
                dda: '011-23760031',
                mcd: '011-23357011',
                bses: '19123',
                delhiJal: '1916'
            },
            planningDocs: [
                {
                    title: 'Master Plan Delhi 2041',
                    url: '/docs/mpd-2041.pdf'
                },
                {
                    title: 'Building Bylaws 2020',
                    url: '/docs/delhi-bylaws.pdf'
                }
            ],
            utilitySteps: {
                water: 'Apply at Delhi Jal Board website. Submit documents online. Pay deposit of ₹5000-10000. Connection in 21 days.',
                electricity: 'Apply at BSES/BYPL/TPDDL portal. Upload documents. Pay security as per load. Meter in 10 days.',
                sewage: 'Part of DJB connection. No separate application needed.'
            },
            lastRefreshed: new Date('2024-02-02').toISOString(),
        },
        {
            regionCode: 'MH-MUM-2024',
            summaryMd: "Mumbai follows Development Control Regulations 2034. MHADA, MMRDA oversee development. High property values. Stamp duty: 6% (5% for women). Registration through IGR Maharashtra portal. Building plans approved by BMC. Coastal Regulation Zone restrictions apply. FSI varies by zone. RERA mandatory for projects above 500 sqm.",
            govContacts: {
                bmc: '022-22694727',
                mhada: '022-24131186',
                mahavitaran: '19122',
                waterSupply: '1916'
            },
            planningDocs: [
                {
                    title: 'DCR Mumbai 2034',
                    url: '/docs/dcr-mumbai-2034.pdf'
                },
                {
                    title: 'CRZ Guidelines',
                    url: '/docs/crz-guidelines.pdf'
                }
            ],
            utilitySteps: {
                water: 'Apply at BMC water department. Submit property documents. Pay ₹10000-25000 deposit. Connection in 30 days.',
                electricity: 'Mahavitaran online application. Upload documents. Security deposit based on load. Meter in 15 days.',
                sewage: 'BMC sewage department. Ward office application with building plan. ₹5000 fee.'
            },
            lastRefreshed: new Date('2024-02-03').toISOString(),
        },
        {
            regionCode: 'KA-BLR-2024',
            summaryMd: "Bangalore (Bengaluru) managed by BDA and BBMP. Revised Master Plan 2031 guides growth. IT corridor in Whitefield, Electronics City. Residential zones expanding. Stamp duty: 5% (men), 3% (women). Online registration via Kaveri portal. Building plans via BBMP BPAS system. RERA Karnataka active. Khata certificate mandatory for property transactions.",
            govContacts: {
                bbmp: '080-22660000',
                bda: '080-22867777',
                bescom: '1912',
                bwssb: '1916'
            },
            planningDocs: [
                {
                    title: 'RMP 2031 Bangalore',
                    url: '/docs/rmp-2031-blr.pdf'
                },
                {
                    title: 'BBMP Building Bylaws',
                    url: '/docs/bbmp-bylaws.pdf'
                }
            ],
            utilitySteps: {
                water: 'BWSSB online application. Submit khata and sale deed. Plumber inspection. ₹15000-30000 deposit. 30-45 days.',
                electricity: 'BESCOM portal application. Upload documents. Security deposit. Installation in 10 days.',
                sewage: 'BWSSB sewage connection. Submit through online portal. ₹5000 fee. 21 days processing.'
            },
            lastRefreshed: new Date('2024-02-04').toISOString(),
        },
        {
            regionCode: 'TG-HYD-2024',
            summaryMd: "Hyderabad under GHMC and HMDA jurisdiction. Strategic Plan 2031 focuses on infrastructure. HITEC City, Gachibowli are major IT hubs. Residential growth in Kokapet, Nallagandla. Stamp duty: 5%. Online registration via e-registration portal. Building plans via TS-bPASS. RERA Telangana active. Pattadar passbook required.",
            govContacts: {
                ghmc: '040-21111111',
                hmda: '040-23396409',
                tsspdcl: '1912',
                hmwssb: '1916'
            },
            planningDocs: [
                {
                    title: 'GHMC Master Plan 2031',
                    url: '/docs/ghmc-mp-2031.pdf'
                },
                {
                    title: 'Building Rules Telangana',
                    url: '/docs/ts-building-rules.pdf'
                }
            ],
            utilitySteps: {
                water: 'HMWSSB online application at www.hyderabadwater.gov.in. Pattadar passbook, sale deed required. ₹12000-20000 deposit. Connection in 30 days.',
                electricity: 'TSSPDCL online. Upload property documents. Security deposit. Meter within 7 days.',
                sewage: 'GHMC sewage connection through zonal office. Building plan approval required. ₹3000 fee.'
            },
            lastRefreshed: new Date('2024-02-05').toISOString(),
        }
    ];

    await db.insert(cityKnowledge).values(sampleCityKnowledge);
    
    console.log('✅ City knowledge seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});