import { db } from '@/db';
import { projects, projectItems, projectTasks, projectMembers, projectDocs, rfqRequests, quotes } from '@/db/schema';

async function main() {
    // Projects data
    const sampleProjects = [
        {
            id: 1,
            title: '2BHK Apartment Renovation - Vaishali Nagar',
            ownerId: 'consumer_amit_01',
            address: 'A-205, Vaishali Apartments, Vaishali Nagar, Jaipur, Rajasthan 302021',
            city: 'Jaipur',
            budget: 450000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            id: 2,
            title: 'Kitchen Remodeling - Malviya Nagar',
            ownerId: 'consumer_amit_01',
            address: 'House 45, Malviya Nagar, Jaipur 302017',
            city: 'Jaipur',
            budget: 185000,
            currency: 'INR',
            status: 'completed',
            createdAt: new Date('2023-12-10').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            id: 3,
            title: 'Luxury Villa Construction - Mansarovar Extension',
            ownerId: 'consumer_neha_01',
            address: 'Plot 127, Mansarovar Extension, Jaipur 302020',
            city: 'Jaipur',
            budget: 4500000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
        {
            id: 4,
            title: 'Corporate Office Interior - MI Road',
            ownerId: 'consumer_neha_01',
            address: 'Office 302, Business Plaza, MI Road, Jaipur 302001',
            city: 'Jaipur',
            budget: 850000,
            currency: 'INR',
            status: 'planning',
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            id: 5,
            title: '3BHK Flat Complete Interiors - Andheri West',
            ownerId: 'consumer_rahul_01',
            address: 'Flat 801, Sunrise Tower, Andheri West, Mumbai 400053',
            city: 'Mumbai',
            budget: 1200000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-02-11').toISOString(),
        },
        {
            id: 6,
            title: 'Master Bathroom Upgrade - Powai',
            ownerId: 'consumer_rahul_01',
            address: 'B-404, Hiranandani Gardens, Powai, Mumbai 400076',
            city: 'Mumbai',
            budget: 275000,
            currency: 'INR',
            status: 'planning',
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            id: 7,
            title: 'Penthouse Luxury Renovation - Indiranagar',
            ownerId: 'consumer_sneha_01',
            address: 'PH-01, Brigade Millennium, Indiranagar, Bangalore 560038',
            city: 'Bangalore',
            budget: 2800000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-02-13').toISOString(),
        },
        {
            id: 8,
            title: 'Boutique Cafe Interior Design - Koramangala',
            ownerId: 'consumer_sneha_01',
            address: 'Shop 12, 5th Block, Koramangala, Bangalore 560095',
            city: 'Bangalore',
            budget: 650000,
            currency: 'INR',
            status: 'planning',
            createdAt: new Date('2024-02-03').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            id: 9,
            title: 'Duplex House Construction - Rohini',
            ownerId: 'consumer_karan_01',
            address: 'Plot D-67, Sector 18, Rohini, Delhi 110089',
            city: 'Delhi',
            budget: 3500000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
        {
            id: 10,
            title: 'Guest House Complete Interiors - Vasant Kunj',
            ownerId: 'consumer_karan_01',
            address: 'C-23, Vasant Kunj, Delhi 110070',
            city: 'Delhi',
            budget: 425000,
            currency: 'INR',
            status: 'completed',
            createdAt: new Date('2023-11-15').toISOString(),
            updatedAt: new Date('2024-01-05').toISOString(),
        },
    ];

    await db.insert(projects).values(sampleProjects);

    // Project Items data
    const sampleProjectItems = [
        // Project 1 items (2BHK Apartment Renovation)
        { id: 1, projectId: 1, catalogId: 1, qty: 800, unit: 'sq ft', note: 'Vitrified tiles for living room and bedrooms', createdAt: new Date('2024-01-26').toISOString() },
        { id: 2, projectId: 1, catalogId: 5, qty: 15, unit: 'units', note: 'LED ceiling lights for all rooms', createdAt: new Date('2024-01-26').toISOString() },
        { id: 3, projectId: 1, catalogId: 10, qty: 1200, unit: 'sq ft', note: 'Exterior and interior painting', createdAt: new Date('2024-01-27').toISOString() },
        { id: 4, projectId: 1, catalogId: 15, qty: 6, unit: 'units', note: 'Wooden doors for bedrooms and bathrooms', createdAt: new Date('2024-01-27').toISOString() },

        // Project 2 items (Kitchen Remodeling)
        { id: 5, projectId: 2, catalogId: 2, qty: 150, unit: 'sq ft', note: 'Italian marble for kitchen countertop', createdAt: new Date('2023-12-11').toISOString() },
        { id: 6, projectId: 2, catalogId: 7, qty: 80, unit: 'sq ft', note: 'Kitchen backsplash tiles', createdAt: new Date('2023-12-11').toISOString() },
        { id: 7, projectId: 2, catalogId: 18, qty: 1, unit: 'set', note: 'Modular kitchen cabinets with soft-close hinges', createdAt: new Date('2023-12-12').toISOString() },

        // Project 3 items (Luxury Villa Construction)
        { id: 8, projectId: 3, catalogId: 3, qty: 5000, unit: 'bags', note: 'Grade 53 cement for foundation and structure', createdAt: new Date('2024-01-16').toISOString() },
        { id: 9, projectId: 3, catalogId: 8, qty: 500, unit: 'rods', note: 'TMT bars for RCC work', createdAt: new Date('2024-01-16').toISOString() },
        { id: 10, projectId: 3, catalogId: 12, qty: 3500, unit: 'sq ft', note: 'Premium hardwood flooring for living areas', createdAt: new Date('2024-01-17').toISOString() },
        { id: 11, projectId: 3, catalogId: 20, qty: 25, unit: 'units', note: 'Luxury bathroom fixtures and fittings', createdAt: new Date('2024-01-18').toISOString() },
        { id: 12, projectId: 3, catalogId: 22, qty: 3000, unit: 'sq ft', note: 'High-efficiency HVAC system', createdAt: new Date('2024-01-19').toISOString() },

        // Project 4 items (Corporate Office Interior)
        { id: 13, projectId: 4, catalogId: 11, qty: 45, unit: 'panels', note: 'Acoustic gypsum ceiling for conference rooms', createdAt: new Date('2024-02-02').toISOString() },
        { id: 14, projectId: 4, catalogId: 14, qty: 2500, unit: 'sq ft', note: 'Designer wallpaper for reception area', createdAt: new Date('2024-02-02').toISOString() },
        { id: 15, projectId: 4, catalogId: 19, qty: 35, unit: 'units', note: 'Ergonomic office workstations', createdAt: new Date('2024-02-03').toISOString() },

        // Project 5 items (3BHK Flat Complete Interiors)
        { id: 16, projectId: 5, catalogId: 1, qty: 1200, unit: 'sq ft', note: 'Premium vitrified tiles for entire flat', createdAt: new Date('2024-01-21').toISOString() },
        { id: 17, projectId: 5, catalogId: 13, qty: 1200, unit: 'sq ft', note: 'Modular false ceiling with lighting', createdAt: new Date('2024-01-21').toISOString() },
        { id: 18, projectId: 5, catalogId: 16, qty: 8, unit: 'units', note: 'Premium quality windows with mosquito mesh', createdAt: new Date('2024-01-22').toISOString() },
        { id: 19, projectId: 5, catalogId: 21, qty: 1, unit: 'set', note: 'Smart home automation system', createdAt: new Date('2024-01-23').toISOString() },

        // Project 6 items (Master Bathroom Upgrade)
        { id: 20, projectId: 6, catalogId: 2, qty: 80, unit: 'sq ft', note: 'Italian marble for bathroom flooring', createdAt: new Date('2024-02-06').toISOString() },
        { id: 21, projectId: 6, catalogId: 6, qty: 120, unit: 'sq ft', note: 'Designer bathroom wall tiles', createdAt: new Date('2024-02-06').toISOString() },
        { id: 22, projectId: 6, catalogId: 20, qty: 1, unit: 'set', note: 'Premium sanitary ware and fixtures', createdAt: new Date('2024-02-06').toISOString() },

        // Project 7 items (Penthouse Luxury Renovation)
        { id: 23, projectId: 7, catalogId: 4, qty: 4500, unit: 'sq ft', note: 'Premium Italian marble for entire penthouse', createdAt: new Date('2024-01-19').toISOString() },
        { id: 24, projectId: 7, catalogId: 12, qty: 2000, unit: 'sq ft', note: 'Imported hardwood flooring for bedrooms', createdAt: new Date('2024-01-19').toISOString() },
        { id: 25, projectId: 7, catalogId: 17, qty: 1, unit: 'set', note: 'Premium modular kitchen with all appliances', createdAt: new Date('2024-01-20').toISOString() },
        { id: 26, projectId: 7, catalogId: 23, qty: 3500, unit: 'sq ft', note: 'Central air conditioning system', createdAt: new Date('2024-01-21').toISOString() },
        { id: 27, projectId: 7, catalogId: 25, qty: 1, unit: 'system', note: 'Complete home theater setup', createdAt: new Date('2024-01-22').toISOString() },

        // Project 8 items (Boutique Cafe Interior)
        { id: 28, projectId: 8, catalogId: 9, qty: 800, unit: 'sq ft', note: 'Decorative wall paint for cafe ambiance', createdAt: new Date('2024-02-04').toISOString() },
        { id: 29, projectId: 8, catalogId: 14, qty: 600, unit: 'sq ft', note: 'Themed wallpaper for feature walls', createdAt: new Date('2024-02-04').toISOString() },
        { id: 30, projectId: 8, catalogId: 24, qty: 1, unit: 'set', note: 'Commercial kitchen setup', createdAt: new Date('2024-02-05').toISOString() },

        // Project 9 items (Duplex House Construction)
        { id: 31, projectId: 9, catalogId: 3, qty: 6000, unit: 'bags', note: 'High-grade cement for duplex construction', createdAt: new Date('2024-01-13').toISOString() },
        { id: 32, projectId: 9, catalogId: 8, qty: 800, unit: 'rods', note: 'TMT bars for structural work', createdAt: new Date('2024-01-13').toISOString() },
        { id: 33, projectId: 9, catalogId: 26, qty: 4000, unit: 'bricks', note: 'High-quality bricks for walls', createdAt: new Date('2024-01-14').toISOString() },
        { id: 34, projectId: 9, catalogId: 27, qty: 250, unit: 'cu m', note: 'Ready-mix concrete for floors', createdAt: new Date('2024-01-15').toISOString() },

        // Project 10 items (Guest House Interiors)
        { id: 35, projectId: 10, catalogId: 1, qty: 600, unit: 'sq ft', note: 'Vitrified tiles for guest rooms', createdAt: new Date('2023-11-16').toISOString() },
        { id: 36, projectId: 10, catalogId: 11, qty: 30, unit: 'panels', note: 'Gypsum false ceiling', createdAt: new Date('2023-11-16').toISOString() },
        { id: 37, projectId: 10, catalogId: 18, qty: 2, unit: 'sets', note: 'Modular kitchen units for pantry', createdAt: new Date('2023-11-17').toISOString() },
    ];

    await db.insert(projectItems).values(sampleProjectItems);

    // Project Tasks data
    const sampleProjectTasks = [
        // Project 1 tasks
        { id: 1, projectId: 1, title: 'Site preparation and demolition', description: 'Remove old flooring and prepare surface for new tiles', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-02-05').toISOString(), createdAt: new Date('2024-01-26').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 2, projectId: 1, title: 'Electrical rewiring', description: 'Complete electrical wiring for new lighting fixtures', status: 'in_progress', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-01-27').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 3, projectId: 1, title: 'Tile installation', description: 'Install vitrified tiles in living room and bedrooms', status: 'in_progress', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 4, projectId: 1, title: 'Door installation', description: 'Install wooden doors in all rooms', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-01').toISOString(), createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-01-28').toISOString() },
        { id: 5, projectId: 1, title: 'Interior painting', description: 'Paint all walls and ceiling with premium paint', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-10').toISOString(), createdAt: new Date('2024-01-29').toISOString(), updatedAt: new Date('2024-01-29').toISOString() },

        // Project 2 tasks
        { id: 6, projectId: 2, title: 'Kitchen demolition', description: 'Remove old kitchen cabinets and countertop', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2023-12-20').toISOString(), createdAt: new Date('2023-12-11').toISOString(), updatedAt: new Date('2023-12-21').toISOString() },
        { id: 7, projectId: 2, title: 'Plumbing work', description: 'Install new plumbing lines for kitchen sink and appliances', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2023-12-28').toISOString(), createdAt: new Date('2023-12-11').toISOString(), updatedAt: new Date('2023-12-29').toISOString() },
        { id: 8, projectId: 2, title: 'Countertop installation', description: 'Install Italian marble countertop', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-01-05').toISOString(), createdAt: new Date('2023-12-12').toISOString(), updatedAt: new Date('2024-01-06').toISOString() },
        { id: 9, projectId: 2, title: 'Cabinet installation', description: 'Install modular kitchen cabinets', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-01-15').toISOString(), createdAt: new Date('2023-12-12').toISOString(), updatedAt: new Date('2024-01-16').toISOString() },

        // Project 3 tasks
        { id: 10, projectId: 3, title: 'Foundation excavation', description: 'Excavate foundation area as per architectural plans', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-01-25').toISOString(), createdAt: new Date('2024-01-16').toISOString(), updatedAt: new Date('2024-01-26').toISOString() },
        { id: 11, projectId: 3, title: 'Foundation concrete work', description: 'Pour concrete for foundation and plinth', status: 'completed', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-02-05').toISOString(), createdAt: new Date('2024-01-16').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 12, projectId: 3, title: 'Ground floor structure', description: 'Complete RCC work for ground floor columns and beams', status: 'in_progress', assignedTo: 'provider_jpr_01', dueDate: new Date('2024-02-28').toISOString(), createdAt: new Date('2024-01-17').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { id: 13, projectId: 3, title: 'First floor structure', description: 'Complete RCC work for first floor', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-20').toISOString(), createdAt: new Date('2024-01-18').toISOString(), updatedAt: new Date('2024-01-18').toISOString() },
        { id: 14, projectId: 3, title: 'Electrical rough-in', description: 'Complete electrical conduit installation', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-30').toISOString(), createdAt: new Date('2024-01-19').toISOString(), updatedAt: new Date('2024-01-19').toISOString() },

        // Project 4 tasks
        { id: 15, projectId: 4, title: 'Space planning and layout', description: 'Finalize office layout and workstation arrangement', status: 'in_progress', assignedTo: 'consumer_neha_01', dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-02-02').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 16, projectId: 4, title: 'False ceiling installation', description: 'Install acoustic gypsum ceiling in conference rooms', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-05').toISOString(), createdAt: new Date('2024-02-02').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { id: 17, projectId: 4, title: 'Electrical and data cabling', description: 'Complete electrical and network cabling as per layout', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-10').toISOString(), createdAt: new Date('2024-02-03').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },
        { id: 18, projectId: 4, title: 'Workstation installation', description: 'Install and set up all office workstations', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-20').toISOString(), createdAt: new Date('2024-02-03').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },

        // Project 5 tasks
        { id: 19, projectId: 5, title: 'Interior demolition', description: 'Remove existing flooring and prepare surfaces', status: 'completed', assignedTo: 'provider_mum_01', dueDate: new Date('2024-02-01').toISOString(), createdAt: new Date('2024-01-21').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { id: 20, projectId: 5, title: 'False ceiling framework', description: 'Install false ceiling framework in all rooms', status: 'in_progress', assignedTo: 'provider_mum_01', dueDate: new Date('2024-02-22').toISOString(), createdAt: new Date('2024-01-21').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { id: 21, projectId: 5, title: 'Tile installation', description: 'Install vitrified tiles throughout the flat', status: 'in_progress', assignedTo: 'provider_mum_01', dueDate: new Date('2024-02-28').toISOString(), createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { id: 22, projectId: 5, title: 'Window installation', description: 'Install premium windows with mosquito mesh', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-05').toISOString(), createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-01-22').toISOString() },
        { id: 23, projectId: 5, title: 'Smart home setup', description: 'Install and configure smart home automation system', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-15').toISOString(), createdAt: new Date('2024-01-23').toISOString(), updatedAt: new Date('2024-01-23').toISOString() },

        // Project 6 tasks
        { id: 24, projectId: 6, title: 'Bathroom demolition', description: 'Remove existing fixtures and tiles', status: 'pending', assignedTo: null, dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { id: 25, projectId: 6, title: 'Waterproofing', description: 'Apply waterproofing treatment to walls and floor', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-01').toISOString(), createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 26, projectId: 6, title: 'Tile installation', description: 'Install Italian marble flooring and wall tiles', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-10').toISOString(), createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 27, projectId: 6, title: 'Fixture installation', description: 'Install premium sanitary ware and fixtures', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-15').toISOString(), createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },

        // Project 7 tasks
        { id: 28, projectId: 7, title: 'Design finalization', description: 'Finalize interior design plans with architect', status: 'completed', assignedTo: 'consumer_sneha_01', dueDate: new Date('2024-01-28').toISOString(), createdAt: new Date('2024-01-19').toISOString(), updatedAt: new Date('2024-01-29').toISOString() },
        { id: 29, projectId: 7, title: 'Marble flooring installation', description: 'Install Italian marble flooring in living areas', status: 'in_progress', assignedTo: 'provider_blr_01', dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-01-19').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
        { id: 30, projectId: 7, title: 'Hardwood flooring in bedrooms', description: 'Install imported hardwood flooring in all bedrooms', status: 'in_progress', assignedTo: 'provider_blr_01', dueDate: new Date('2024-03-01').toISOString(), createdAt: new Date('2024-01-19').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
        { id: 31, projectId: 7, title: 'Kitchen installation', description: 'Install premium modular kitchen with appliances', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-10').toISOString(), createdAt: new Date('2024-01-20').toISOString(), updatedAt: new Date('2024-01-20').toISOString() },
        { id: 32, projectId: 7, title: 'HVAC installation', description: 'Install central air conditioning system', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-15').toISOString(), createdAt: new Date('2024-01-21').toISOString(), updatedAt: new Date('2024-01-21').toISOString() },
        { id: 33, projectId: 7, title: 'Home theater setup', description: 'Install complete home theater system', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-25').toISOString(), createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-01-22').toISOString() },

        // Project 8 tasks
        { id: 34, projectId: 8, title: 'Cafe layout planning', description: 'Finalize seating arrangement and service area layout', status: 'in_progress', assignedTo: 'consumer_sneha_01', dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 35, projectId: 8, title: 'Wall preparation and painting', description: 'Prepare walls and apply decorative paint', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-01').toISOString(), createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { id: 36, projectId: 8, title: 'Wallpaper installation', description: 'Install themed wallpaper on feature walls', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-05').toISOString(), createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { id: 37, projectId: 8, title: 'Commercial kitchen setup', description: 'Install commercial kitchen equipment', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-15').toISOString(), createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },

        // Project 9 tasks
        { id: 38, projectId: 9, title: 'Site excavation', description: 'Complete excavation for duplex foundation', status: 'completed', assignedTo: 'provider_del_01', dueDate: new Date('2024-01-22').toISOString(), createdAt: new Date('2024-01-13').toISOString(), updatedAt: new Date('2024-01-23').toISOString() },
        { id: 39, projectId: 9, title: 'Foundation work', description: 'Complete foundation and plinth beam work', status: 'completed', assignedTo: 'provider_del_01', dueDate: new Date('2024-02-05').toISOString(), createdAt: new Date('2024-01-13').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 40, projectId: 9, title: 'Ground floor construction', description: 'Complete ground floor structure with columns and beams', status: 'in_progress', assignedTo: 'provider_del_01', dueDate: new Date('2024-02-28').toISOString(), createdAt: new Date('2024-01-14').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { id: 41, projectId: 9, title: 'First floor construction', description: 'Complete first floor structure', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-20').toISOString(), createdAt: new Date('2024-01-15').toISOString(), updatedAt: new Date('2024-01-15').toISOString() },
        { id: 42, projectId: 9, title: 'Roofing work', description: 'Complete roof slab and waterproofing', status: 'pending', assignedTo: null, dueDate: new Date('2024-04-10').toISOString(), createdAt: new Date('2024-01-15').toISOString(), updatedAt: new Date('2024-01-15').toISOString() },

        // Project 10 tasks
        { id: 43, projectId: 10, title: 'Room partition and layout', description: 'Create room partitions as per guest house layout', status: 'completed', assignedTo: 'provider_del_01', dueDate: new Date('2023-11-25').toISOString(), createdAt: new Date('2023-11-16').toISOString(), updatedAt: new Date('2023-11-26').toISOString() },
        { id: 44, projectId: 10, title: 'Flooring installation', description: 'Install vitrified tiles in all guest rooms', status: 'completed', assignedTo: 'provider_del_01', dueDate: new Date('2023-12-10').toISOString(), createdAt: new Date('2023-11-16').toISOString(), updatedAt: new Date('2023-12-11').toISOString() },
        { id: 45, projectId: 10, title: 'False ceiling work', description: 'Install gypsum false ceiling in common areas', status: 'completed', assignedTo: 'provider_del_01', dueDate: new Date('2023-12-20').toISOString(), createdAt: new Date('2023-11-16').toISOString(), updatedAt: new Date('2023-12-21').toISOString() },
        { id: 46, projectId: 10, title: 'Kitchen installation', description: 'Install modular kitchen units in pantry', status: 'completed', assignedTo: 'provider_del_01', dueDate: new Date('2024-01-05').toISOString(), createdAt: new Date('2023-11-17').toISOString(), updatedAt: new Date('2024-01-05').toISOString() },
    ];

    await db.insert(projectTasks).values(sampleProjectTasks);

    // Project Members data
    const sampleProjectMembers = [
        { id: 1, projectId: 1, userId: 'provider_jpr_01', role: 'member', joinedAt: new Date('2024-01-26').toISOString() },
        { id: 2, projectId: 3, userId: 'provider_jpr_01', role: 'member', joinedAt: new Date('2024-01-16').toISOString() },
        { id: 3, projectId: 3, userId: 'consumer_rahul_01', role: 'member', joinedAt: new Date('2024-01-20').toISOString() },
        { id: 4, projectId: 5, userId: 'provider_mum_01', role: 'member', joinedAt: new Date('2024-01-21').toISOString() },
        { id: 5, projectId: 7, userId: 'provider_blr_01', role: 'member', joinedAt: new Date('2024-01-19').toISOString() },
        { id: 6, projectId: 7, userId: 'consumer_karan_01', role: 'member', joinedAt: new Date('2024-01-25').toISOString() },
        { id: 7, projectId: 9, userId: 'provider_del_01', role: 'member', joinedAt: new Date('2024-01-13').toISOString() },
        { id: 8, projectId: 9, userId: 'consumer_neha_01', role: 'member', joinedAt: new Date('2024-01-18').toISOString() },
    ];

    await db.insert(projectMembers).values(sampleProjectMembers);

    // Project Docs data
    const sampleProjectDocs = [
        { id: 1, projectId: 1, title: 'Floor Plan.pdf', docUrl: '/uploads/documents/project1_floor_plan.pdf', uploadedBy: 'consumer_amit_01', createdAt: new Date('2024-01-25').toISOString() },
        { id: 2, projectId: 1, title: 'Material Quotation.pdf', docUrl: '/uploads/documents/project1_material_quotation.pdf', uploadedBy: 'consumer_amit_01', createdAt: new Date('2024-01-27').toISOString() },
        { id: 3, projectId: 3, title: 'Architectural Plans.pdf', docUrl: '/uploads/documents/project3_architectural_plans.pdf', uploadedBy: 'consumer_neha_01', createdAt: new Date('2024-01-15').toISOString() },
        { id: 4, projectId: 3, title: 'Structural Drawings.pdf', docUrl: '/uploads/documents/project3_structural_drawings.pdf', uploadedBy: 'consumer_neha_01', createdAt: new Date('2024-01-16').toISOString() },
        { id: 5, projectId: 3, title: 'Site Photos.zip', docUrl: '/uploads/documents/project3_site_photos.zip', uploadedBy: 'provider_jpr_01', createdAt: new Date('2024-01-20').toISOString() },
        { id: 6, projectId: 5, title: 'Electrical Layout.pdf', docUrl: '/uploads/documents/project5_electrical_layout.pdf', uploadedBy: 'consumer_rahul_01', createdAt: new Date('2024-01-21').toISOString() },
        { id: 7, projectId: 5, title: 'Plumbing Layout.pdf', docUrl: '/uploads/documents/project5_plumbing_layout.pdf', uploadedBy: 'consumer_rahul_01', createdAt: new Date('2024-01-21').toISOString() },
        { id: 8, projectId: 7, title: 'Interior Design Concept.pdf', docUrl: '/uploads/documents/project7_interior_design.pdf', uploadedBy: 'consumer_sneha_01', createdAt: new Date('2024-01-18').toISOString() },
        { id: 9, projectId: 7, title: 'Material Specifications.pdf', docUrl: '/uploads/documents/project7_material_specs.pdf', uploadedBy: 'consumer_sneha_01', createdAt: new Date('2024-01-19').toISOString() },
        { id: 10, projectId: 9, title: 'Building Permit.pdf', docUrl: '/uploads/documents/project9_building_permit.pdf', uploadedBy: 'consumer_karan_01', createdAt: new Date('2024-01-12').toISOString() },
    ];

    await db.insert(projectDocs).values(sampleProjectDocs);

    // RFQ Requests data
    const sampleRfqRequests = [
        // Draft RFQs
        { id: 1, catalogId: 1, consumerId: 'consumer_amit_01', providerId: null, quantity: 1000, unit: 'sq ft', message: 'Need premium tiles for living room renovation', preferredDate: new Date('2024-03-15').toISOString(), status: 'draft', createdAt: new Date('2024-02-10').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 2, catalogId: 5, consumerId: 'consumer_neha_01', providerId: null, quantity: 20, unit: 'units', message: 'Looking for energy-efficient LED lights for office space', preferredDate: new Date('2024-03-20').toISOString(), status: 'draft', createdAt: new Date('2024-02-12').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },

        // Submitted RFQs
        { id: 3, catalogId: 2, consumerId: 'consumer_amit_01', providerId: null, quantity: 200, unit: 'sq ft', message: 'Italian marble needed for kitchen countertop. Please confirm availability and delivery time.', preferredDate: new Date('2024-03-10').toISOString(), status: 'submitted', createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { id: 4, catalogId: 8, consumerId: 'consumer_neha_01', providerId: null, quantity: 600, unit: 'rods', message: 'TMT bars required for villa construction. Need bulk discount pricing.', preferredDate: new Date('2024-03-05').toISOString(), status: 'submitted', createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { id: 5, catalogId: 12, consumerId: 'consumer_rahul_01', providerId: null, quantity: 1500, unit: 'sq ft', message: 'Premium hardwood flooring for flat interiors. Looking for best quality.', preferredDate: new Date('2024-03-18').toISOString(), status: 'submitted', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },
        { id: 6, catalogId: 15, consumerId: 'consumer_sneha_01', providerId: null, quantity: 10, unit: 'units', message: 'Designer wooden doors for penthouse. Need samples before bulk order.', preferredDate: new Date('2024-03-12').toISOString(), status: 'submitted', createdAt: new Date('2024-02-07').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },
        { id: 7, catalogId: 18, consumerId: 'consumer_karan_01', providerId: null, quantity: 1, unit: 'set', message: 'Complete modular kitchen for guest house. Include installation charges.', preferredDate: new Date('2024-03-25').toISOString(), status: 'submitted', createdAt: new Date('2024-02-11').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { id: 8, catalogId: 20, consumerId: 'consumer_amit_01', providerId: null, quantity: 3, unit: 'sets', message: 'Premium bathroom fixtures needed urgently. Can you deliver within 2 weeks?', preferredDate: new Date('2024-02-28').toISOString(), status: 'submitted', createdAt: new Date('2024-02-13').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
        { id: 9, catalogId: 22, consumerId: 'consumer_neha_01', providerId: null, quantity: 3500, unit: 'sq ft', message: 'HVAC system for corporate office. Need energy-efficient model.', preferredDate: new Date('2024-03-30').toISOString(), status: 'submitted', createdAt: new Date('2024-02-10').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 10, catalogId: 25, consumerId: 'consumer_rahul_01', providerId: null, quantity: 1, unit: 'system', message: 'Home theater setup with premium speakers and projector.', preferredDate: new Date('2024-04-05').toISOString(), status: 'submitted', createdAt: new Date('2024-02-14').toISOString(), updatedAt: new Date('2024-02-14').toISOString() },

        // Responded RFQs
        { id: 11, catalogId: 3, consumerId: 'consumer_karan_01', providerId: 'provider_del_01', quantity: 7000, unit: 'bags', message: 'High-grade cement for duplex house construction. Need competitive pricing for bulk order.', preferredDate: new Date('2024-03-01').toISOString(), status: 'responded', createdAt: new Date('2024-02-01').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { id: 12, catalogId: 10, consumerId: 'consumer_amit_01', providerId: 'provider_jpr_01', quantity: 1500, unit: 'sq ft', message: 'Complete painting service for 2BHK apartment. Include material and labor.', preferredDate: new Date('2024-03-08').toISOString(), status: 'responded', createdAt: new Date('2024-02-03').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },
        { id: 13, catalogId: 14, consumerId: 'consumer_sneha_01', providerId: 'provider_blr_01', quantity: 800, unit: 'sq ft', message: 'Designer wallpaper for cafe interior. Need trendy patterns and designs.', preferredDate: new Date('2024-03-15').toISOString(), status: 'responded', createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 14, catalogId: 19, consumerId: 'consumer_neha_01', providerId: 'provider_jpr_01', quantity: 40, unit: 'units', message: 'Ergonomic office workstations with cable management. Need delivery in Jaipur.', preferredDate: new Date('2024-03-22').toISOString(), status: 'responded', createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { id: 15, catalogId: 27, consumerId: 'consumer_karan_01', providerId: 'provider_del_01', quantity: 300, unit: 'cu m', message: 'Ready-mix concrete for floor slabs. Need M25 grade with proper testing certificates.', preferredDate: new Date('2024-03-05').toISOString(), status: 'responded', createdAt: new Date('2024-02-02').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },

        // Accepted RFQs
        { id: 16, catalogId: 4, consumerId: 'consumer_sneha_01', providerId: 'provider_blr_01', quantity: 5000, unit: 'sq ft', message: 'Premium Italian marble for penthouse flooring. Need best quality with proper finishing.', preferredDate: new Date('2024-03-10').toISOString(), status: 'accepted', createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { id: 17, catalogId: 11, consumerId: 'consumer_rahul_01', providerId: 'provider_mum_01', quantity: 50, unit: 'panels', message: 'Acoustic gypsum ceiling for flat. Need soundproofing and fire-resistant panels.', preferredDate: new Date('2024-02-28').toISOString(), status: 'accepted', createdAt: new Date('2024-01-30').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 18, catalogId: 16, consumerId: 'consumer_amit_01', providerId: 'provider_jpr_01', quantity: 8, unit: 'units', message: 'UPVC windows with mosquito mesh for apartment. Need installation service included.', preferredDate: new Date('2024-03-12').toISOString(), status: 'accepted', createdAt: new Date('2024-02-01').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },

        // Rejected RFQs
        { id: 19, catalogId: 7, consumerId: 'consumer_rahul_01', providerId: 'provider_mum_01', quantity: 100, unit: 'sq ft', message: 'Bathroom wall tiles with anti-slip surface. Need urgent delivery.', preferredDate: new Date('2024-02-25').toISOString(), status: 'rejected', createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { id: 20, catalogId: 13, consumerId: 'consumer_sneha_01', providerId: 'provider_blr_01', quantity: 1000, unit: 'sq ft', message: 'False ceiling with integrated LED lighting for cafe. Price too high.', preferredDate: new Date('2024-03-20').toISOString(), status: 'rejected', createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
    ];

    await db.insert(rfqRequests).values(sampleRfqRequests);

    // Quotes data
    const sampleQuotes = [
        // Quotes for RFQ 11 (responded - cement)
        { id: 1, rfqId: 11, providerId: 'provider_del_01', price: 385, currency: 'INR', deliveryEtaDays: 5, notes: 'Free delivery for orders above ₹2,50,000. 10% bulk discount included.', status: 'pending', createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { id: 2, rfqId: 11, providerId: 'provider_jpr_01', price: 395, currency: 'INR', deliveryEtaDays: 7, notes: 'Premium quality cement. Installation support available at extra cost.', status: 'pending', createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },

        // Quotes for RFQ 12 (responded - painting)
        { id: 3, rfqId: 12, providerId: 'provider_jpr_01', price: 45, currency: 'INR', deliveryEtaDays: 3, notes: 'Complete painting service with premium Asian Paints. 2 coats included.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },
        { id: 4, rfqId: 12, providerId: 'provider_mum_01', price: 48, currency: 'INR', deliveryEtaDays: 4, notes: 'Premium quality paint with 5-year warranty. Expert painters team.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },
        { id: 5, rfqId: 12, providerId: 'provider_blr_01', price: 42, currency: 'INR', deliveryEtaDays: 5, notes: 'Best rates with Berger Paints. Free color consultation.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },

        // Quotes for RFQ 13 (responded - wallpaper)
        { id: 6, rfqId: 13, providerId: 'provider_blr_01', price: 285, currency: 'INR', deliveryEtaDays: 8, notes: 'Designer imported wallpaper. Free installation for orders above ₹2,00,000.', status: 'pending', createdAt: new Date('2024-02-10').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { id: 7, rfqId: 13, providerId: 'provider_mum_01', price: 295, currency: 'INR', deliveryEtaDays: 10, notes: 'Premium Korean wallpaper with texture. Installation charges extra.', status: 'pending', createdAt: new Date('2024-02-10').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },

        // Quotes for RFQ 14 (responded - workstations)
        { id: 8, rfqId: 14, providerId: 'provider_jpr_01', price: 18500, currency: 'INR', deliveryEtaDays: 12, notes: 'Ergonomic design with adjustable height. 3-year warranty included.', status: 'pending', createdAt: new Date('2024-02-11').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { id: 9, rfqId: 14, providerId: 'provider_del_01', price: 17800, currency: 'INR', deliveryEtaDays: 15, notes: 'Modular workstations with cable management. Free assembly service.', status: 'pending', createdAt: new Date('2024-02-11').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },

        // Quotes for RFQ 15 (responded - concrete)
        { id: 10, rfqId: 15, providerId: 'provider_del_01', price: 4800, currency: 'INR', deliveryEtaDays: 2, notes: 'M25 grade ready-mix concrete. Test certificates provided. Minimum order 5 cu m.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },
        { id: 11, rfqId: 15, providerId: 'provider_jpr_01', price: 4950, currency: 'INR', deliveryEtaDays: 3, notes: 'Premium RMC with proper slump test. Free technical support.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },

        // Quotes for RFQ 16 (accepted - marble)
        { id: 12, rfqId: 16, providerId: 'provider_blr_01', price: 485, currency: 'INR', deliveryEtaDays: 10, notes: 'Premium Italian marble with mirror finish. Free installation and polishing.', status: 'accepted', createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { id: 13, rfqId: 16, providerId: 'provider_mum_01', price: 495, currency: 'INR', deliveryEtaDays: 12, notes: 'Imported marble with lifetime warranty. Expert installation team.', status: 'rejected', createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },

        // Quotes for RFQ 17 (accepted - gypsum ceiling)
        { id: 14, rfqId: 17, providerId: 'provider_mum_01', price: 185, currency: 'INR', deliveryEtaDays: 7, notes: 'Fire-resistant acoustic panels. Soundproofing guaranteed up to 45dB.', status: 'accepted', createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { id: 15, rfqId: 17, providerId: 'provider_blr_01', price: 195, currency: 'INR', deliveryEtaDays: 8, notes: 'Premium gypsum with Saint-Gobain brand. Installation included.', status: 'rejected', createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },

        // Quotes for RFQ 18 (accepted - windows)
        { id: 16, rfqId: 18, providerId: 'provider_jpr_01', price: 8200, currency: 'INR', deliveryEtaDays: 10, notes: 'UPVC windows with German hardware. Free installation and mosquito mesh.', status: 'accepted', createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },
        { id: 17, rfqId: 18, providerId: 'provider_del_01', price: 8500, currency: 'INR', deliveryEtaDays: 12, notes: 'Premium UPVC with multi-point locking. 10-year warranty.', status: 'rejected', createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },

        // Quotes for RFQ 19 (rejected - tiles)
        { id: 18, rfqId: 19, providerId: 'provider_mum_01', price: 95, currency: 'INR', deliveryEtaDays: 15, notes: 'Anti-slip bathroom tiles. Delivery time too long for urgent requirement.', status: 'rejected', createdAt: new Date('2024-02-11').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { id: 19, rfqId: 19, providerId: 'provider_blr_01', price: 92, currency: 'INR', deliveryEtaDays: 14, notes: 'Premium quality tiles with R11 anti-slip rating. Cannot meet urgent timeline.', status: 'rejected', createdAt: new Date('2024-02-11').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },

        // Quotes for RFQ 20 (rejected - false ceiling)
        { id: 20, rfqId: 20, providerId: 'provider_blr_01', price: 295, currency: 'INR', deliveryEtaDays: 10, notes: 'Premium false ceiling with integrated LED. Price too high for consumer budget.', status: 'rejected', createdAt: new Date('2024-02-12').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
        { id: 21, rfqId: 20, providerId: 'provider_mum_01', price: 285, currency: 'INR', deliveryEtaDays: 12, notes: 'Modular ceiling with energy-efficient lights. Still above consumer budget.', status: 'rejected', createdAt: new Date('2024-02-12').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
    ];

    await db.insert(quotes).values(sampleQuotes);

    console.log('✅ Seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});