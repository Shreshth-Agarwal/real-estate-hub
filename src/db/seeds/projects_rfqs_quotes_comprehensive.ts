import { db } from '@/db';
import { projects, projectItems, projectTasks, rfqRequests, quotes } from '@/db/schema';

async function main() {
    // PROJECTS (10 records)
    const sampleProjects = [
        {
            ownerId: 'user_rajesh_01',
            title: '2BHK Apartment Renovation - Vaishali Nagar',
            address: 'Flat B-405, Vaishali Apartments, Vaishali Nagar, Jaipur, Rajasthan 302021',
            city: 'Jaipur',
            budget: 350000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            ownerId: 'user_priya_01',
            title: 'Villa Construction - Mansarovar Extension',
            address: 'Plot 127, Mansarovar Extension, Jaipur, Rajasthan 302020',
            city: 'Jaipur',
            budget: 4500000,
            currency: 'INR',
            status: 'planning',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            ownerId: 'user_amit_01',
            title: 'Office Interior - MG Road',
            address: 'Office 502, Tech Park, MG Road, Bangalore, Karnataka 560001',
            city: 'Bangalore',
            budget: 1200000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
        {
            ownerId: 'user_sneha_01',
            title: 'Kitchen Remodeling - Malviya Nagar',
            address: 'C-23, Malviya Nagar, Jaipur, Rajasthan 302017',
            city: 'Jaipur',
            budget: 250000,
            currency: 'INR',
            status: 'completed',
            createdAt: new Date('2023-12-15').toISOString(),
            updatedAt: new Date('2024-01-28').toISOString(),
        },
        {
            ownerId: 'user_vikram_01',
            title: 'Bathroom Upgrade - Sector 18',
            address: 'Flat 302, Sector 18, Noida, Delhi NCR 110089',
            city: 'Delhi',
            budget: 180000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-28').toISOString(),
            updatedAt: new Date('2024-02-11').toISOString(),
        },
        {
            ownerId: 'user_rajesh_01',
            title: 'Living Room Flooring - Civil Lines',
            address: 'House 45, Civil Lines, Jaipur, Rajasthan 302006',
            city: 'Jaipur',
            budget: 120000,
            currency: 'INR',
            status: 'planning',
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            ownerId: 'user_priya_01',
            title: 'Terrace Waterproofing - Andheri West',
            address: 'Building A, 4th Floor, Andheri West, Mumbai, Maharashtra 400053',
            city: 'Mumbai',
            budget: 85000,
            currency: 'INR',
            status: 'completed',
            createdAt: new Date('2023-12-20').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            ownerId: 'user_amit_01',
            title: 'Bedroom Interior - Whitefield',
            address: 'Villa 12, Whitefield Gardens, Bangalore, Karnataka 560066',
            city: 'Bangalore',
            budget: 320000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
        {
            ownerId: 'user_sneha_01',
            title: 'Complete House Painting - Vaishali Nagar',
            address: 'A-102, Vaishali Heights, Vaishali Nagar, Jaipur 302021',
            city: 'Jaipur',
            budget: 95000,
            currency: 'INR',
            status: 'planning',
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            ownerId: 'user_vikram_01',
            title: 'Modular Kitchen Setup - Karol Bagh',
            address: 'House 78, Karol Bagh, New Delhi 110005',
            city: 'Delhi',
            budget: 420000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-02-13').toISOString(),
        },
    ];

    await db.insert(projects).values(sampleProjects);
    console.log('✅ Projects seeded successfully');

    // PROJECT ITEMS (40 records - 3-5 items per project)
    const sampleProjectItems = [
        // Project 1 items
        { projectId: 1, catalogId: 1, qty: 1200, unit: 'sqft', note: 'For living room and both bedrooms', createdAt: new Date('2024-01-25').toISOString() },
        { projectId: 1, catalogId: 15, qty: 150, unit: 'bags', note: 'Foundation and plastering work', createdAt: new Date('2024-01-26').toISOString() },
        { projectId: 1, catalogId: 22, qty: 180, unit: 'liters', note: 'Interior walls painting', createdAt: new Date('2024-01-27').toISOString() },
        { projectId: 1, catalogId: 8, qty: 3, unit: 'sets', note: 'Premium bathroom fixtures', createdAt: new Date('2024-01-28').toISOString() },

        // Project 2 items
        { projectId: 2, catalogId: 2, qty: 2500, unit: 'kg', note: 'TMT bars for entire villa structure', createdAt: new Date('2024-01-20').toISOString() },
        { projectId: 2, catalogId: 16, qty: 200, unit: 'bags', note: 'For foundation and columns', createdAt: new Date('2024-01-21').toISOString() },
        { projectId: 2, catalogId: 5, qty: 800, unit: 'sqft', note: 'Italian marble for flooring', createdAt: new Date('2024-01-22').toISOString() },
        { projectId: 2, catalogId: 10, qty: 400, unit: 'sqft', note: 'For interior work', createdAt: new Date('2024-01-23').toISOString() },
        { projectId: 2, catalogId: 23, qty: 250, unit: 'liters', note: 'Exterior and interior painting', createdAt: new Date('2024-01-24').toISOString() },

        // Project 3 items
        { projectId: 3, catalogId: 3, qty: 900, unit: 'sqft', note: 'Premium office flooring tiles', createdAt: new Date('2024-01-18').toISOString() },
        { projectId: 3, catalogId: 11, qty: 300, unit: 'sqft', note: 'For office cabinets and partitions', createdAt: new Date('2024-01-19').toISOString() },
        { projectId: 3, catalogId: 24, qty: 120, unit: 'liters', note: 'Corporate color scheme', createdAt: new Date('2024-01-20').toISOString() },
        { projectId: 3, catalogId: 9, qty: 5, unit: 'sets', note: 'Premium fittings for washrooms', createdAt: new Date('2024-01-21').toISOString() },

        // Project 4 items
        { projectId: 4, catalogId: 4, qty: 450, unit: 'sqft', note: 'Kitchen floor and wall tiles', createdAt: new Date('2023-12-15').toISOString() },
        { projectId: 4, catalogId: 6, qty: 200, unit: 'sqft', note: 'Granite for kitchen countertop', createdAt: new Date('2023-12-16').toISOString() },
        { projectId: 4, catalogId: 12, qty: 150, unit: 'sqft', note: 'For kitchen cabinets', createdAt: new Date('2023-12-17').toISOString() },
        { projectId: 4, catalogId: 25, qty: 80, unit: 'liters', note: 'Kitchen walls and ceiling', createdAt: new Date('2023-12-18').toISOString() },

        // Project 5 items
        { projectId: 5, catalogId: 7, qty: 350, unit: 'sqft', note: 'Bathroom wall and floor tiles', createdAt: new Date('2024-01-28').toISOString() },
        { projectId: 5, catalogId: 13, qty: 100, unit: 'sqft', note: 'For storage solutions', createdAt: new Date('2024-01-29').toISOString() },
        { projectId: 5, catalogId: 26, qty: 60, unit: 'liters', note: 'Waterproof bathroom paint', createdAt: new Date('2024-01-30').toISOString() },
        { projectId: 5, catalogId: 14, qty: 4, unit: 'sets', note: 'Modern bathroom fixtures', createdAt: new Date('2024-01-31').toISOString() },

        // Project 6 items
        { projectId: 6, catalogId: 1, qty: 850, unit: 'sqft', note: 'Living room premium flooring', createdAt: new Date('2024-02-05').toISOString() },
        { projectId: 6, catalogId: 17, qty: 80, unit: 'bags', note: 'For leveling work', createdAt: new Date('2024-02-06').toISOString() },
        { projectId: 6, catalogId: 27, qty: 100, unit: 'liters', note: 'Wall painting after flooring', createdAt: new Date('2024-02-07').toISOString() },

        // Project 7 items
        { projectId: 7, catalogId: 18, qty: 50, unit: 'bags', note: 'Waterproofing compound', createdAt: new Date('2023-12-20').toISOString() },
        { projectId: 7, catalogId: 28, qty: 150, unit: 'liters', note: 'Terrace waterproof coating', createdAt: new Date('2023-12-21').toISOString() },
        { projectId: 7, catalogId: 8, qty: 600, unit: 'sqft', note: 'Terrace tiles', createdAt: new Date('2023-12-22').toISOString() },

        // Project 8 items
        { projectId: 8, catalogId: 5, qty: 400, unit: 'sqft', note: 'Bedroom marble flooring', createdAt: new Date('2024-01-22').toISOString() },
        { projectId: 8, catalogId: 14, qty: 250, unit: 'sqft', note: 'Wardrobe and furniture', createdAt: new Date('2024-01-23').toISOString() },
        { projectId: 8, catalogId: 29, qty: 140, unit: 'liters', note: 'Premium interior paint', createdAt: new Date('2024-01-24').toISOString() },
        { projectId: 8, catalogId: 15, qty: 2, unit: 'sets', note: 'Bedroom lighting fixtures', createdAt: new Date('2024-01-25').toISOString() },

        // Project 9 items
        { projectId: 9, catalogId: 30, qty: 280, unit: 'liters', note: 'Complete house interior painting', createdAt: new Date('2024-02-01').toISOString() },
        { projectId: 9, catalogId: 31, qty: 120, unit: 'liters', note: 'Exterior walls painting', createdAt: new Date('2024-02-02').toISOString() },
        { projectId: 9, catalogId: 19, qty: 60, unit: 'bags', note: 'Wall preparation and putty', createdAt: new Date('2024-02-03').toISOString() },

        // Project 10 items
        { projectId: 10, catalogId: 6, qty: 300, unit: 'sqft', note: 'Kitchen countertop granite', createdAt: new Date('2024-01-15').toISOString() },
        { projectId: 10, catalogId: 16, qty: 350, unit: 'sqft', note: 'Kitchen cabinets plywood', createdAt: new Date('2024-01-16').toISOString() },
        { projectId: 10, catalogId: 9, qty: 250, unit: 'sqft', note: 'Kitchen wall tiles', createdAt: new Date('2024-01-17').toISOString() },
        { projectId: 10, catalogId: 17, qty: 5, unit: 'sets', note: 'Kitchen sink and fittings', createdAt: new Date('2024-01-18').toISOString() },
        { projectId: 10, catalogId: 32, qty: 80, unit: 'liters', note: 'Kitchen paint', createdAt: new Date('2024-01-19').toISOString() },
    ];

    await db.insert(projectItems).values(sampleProjectItems);
    console.log('✅ Project items seeded successfully');

    // PROJECT TASKS (50 records - 5 tasks per project)
    const sampleProjectTasks = [
        // Project 1 tasks
        { projectId: 1, title: 'Select tiles and finalize design', description: 'Visit showroom and choose tiles for living room and bedrooms', status: 'completed', assignedTo: 'user_rajesh_01', dueDate: new Date('2024-02-01').toISOString(), createdAt: new Date('2024-01-25').toISOString(), updatedAt: new Date('2024-01-30').toISOString() },
        { projectId: 1, title: 'Order construction materials', description: 'Place order for tiles, cement, and fixtures', status: 'completed', assignedTo: 'user_rajesh_01', dueDate: new Date('2024-02-05').toISOString(), createdAt: new Date('2024-01-26').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },
        { projectId: 1, title: 'Arrange skilled labor for installation', description: 'Hire experienced tile layers and plumbers', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-15').toISOString(), createdAt: new Date('2024-01-27').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { projectId: 1, title: 'Plumbing and electrical rough-in', description: 'Complete all plumbing and electrical work before finishing', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { projectId: 1, title: 'Quality inspection and testing', description: 'Check all installations and test fittings', status: 'pending', assignedTo: 'user_rajesh_01', dueDate: new Date('2024-03-01').toISOString(), createdAt: new Date('2024-01-29').toISOString(), updatedAt: new Date('2024-01-29').toISOString() },

        // Project 2 tasks
        { projectId: 2, title: 'Finalize architectural drawings', description: 'Get approval for villa construction plans', status: 'completed', assignedTo: 'user_priya_01', dueDate: new Date('2024-02-01').toISOString(), createdAt: new Date('2024-01-20').toISOString(), updatedAt: new Date('2024-01-28').toISOString() },
        { projectId: 2, title: 'Order steel and cement', description: 'Bulk order of construction materials', status: 'in_progress', assignedTo: 'user_priya_01', dueDate: new Date('2024-02-10').toISOString(), createdAt: new Date('2024-01-21').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { projectId: 2, title: 'Foundation excavation work', description: 'Complete foundation digging and preparation', status: 'pending', assignedTo: null, dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-01-22').toISOString() },
        { projectId: 2, title: 'Column and beam construction', description: 'Build structural framework', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-15').toISOString(), createdAt: new Date('2024-01-23').toISOString(), updatedAt: new Date('2024-01-23').toISOString() },
        { projectId: 2, title: 'Arrange marble and finishing materials', description: 'Order premium marble and paint', status: 'pending', assignedTo: 'user_priya_01', dueDate: new Date('2024-03-30').toISOString(), createdAt: new Date('2024-01-24').toISOString(), updatedAt: new Date('2024-01-24').toISOString() },

        // Project 3 tasks
        { projectId: 3, title: 'Office layout planning', description: 'Design workspace layout with furniture placement', status: 'completed', assignedTo: 'user_amit_01', dueDate: new Date('2024-01-25').toISOString(), createdAt: new Date('2024-01-18').toISOString(), updatedAt: new Date('2024-01-23').toISOString() },
        { projectId: 3, title: 'Order office flooring tiles', description: 'Select and order premium tiles', status: 'completed', assignedTo: 'user_amit_01', dueDate: new Date('2024-02-01').toISOString(), createdAt: new Date('2024-01-19').toISOString(), updatedAt: new Date('2024-01-30').toISOString() },
        { projectId: 3, title: 'Install partitions and plywood work', description: 'Build office cabins and partitions', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-01-20').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { projectId: 3, title: 'Electrical and lighting setup', description: 'Complete office electrical work', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-01-21').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { projectId: 3, title: 'Final painting and cleanup', description: 'Paint walls and complete final touches', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-05').toISOString(), createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-01-22').toISOString() },

        // Project 4 tasks
        { projectId: 4, title: 'Kitchen demolition work', description: 'Remove old kitchen fixtures and tiles', status: 'completed', assignedTo: 'user_sneha_01', dueDate: new Date('2023-12-20').toISOString(), createdAt: new Date('2023-12-15').toISOString(), updatedAt: new Date('2023-12-18').toISOString() },
        { projectId: 4, title: 'Order granite and tiles', description: 'Purchase granite countertop and kitchen tiles', status: 'completed', assignedTo: 'user_sneha_01', dueDate: new Date('2023-12-25').toISOString(), createdAt: new Date('2023-12-16').toISOString(), updatedAt: new Date('2023-12-23').toISOString() },
        { projectId: 4, title: 'Install new tiles and granite', description: 'Complete tiling and countertop installation', status: 'completed', assignedTo: null, dueDate: new Date('2024-01-05').toISOString(), createdAt: new Date('2023-12-17').toISOString(), updatedAt: new Date('2024-01-03').toISOString() },
        { projectId: 4, title: 'Paint kitchen walls', description: 'Apply fresh paint to kitchen', status: 'completed', assignedTo: null, dueDate: new Date('2024-01-15').toISOString(), createdAt: new Date('2023-12-18').toISOString(), updatedAt: new Date('2024-01-12').toISOString() },
        { projectId: 4, title: 'Final cleanup and handover', description: 'Clean kitchen and final inspection', status: 'completed', assignedTo: 'user_sneha_01', dueDate: new Date('2024-01-28').toISOString(), createdAt: new Date('2023-12-19').toISOString(), updatedAt: new Date('2024-01-28').toISOString() },

        // Project 5 tasks
        { projectId: 5, title: 'Select bathroom tiles and fixtures', description: 'Choose modern bathroom materials', status: 'completed', assignedTo: 'user_vikram_01', dueDate: new Date('2024-02-03').toISOString(), createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-01').toISOString() },
        { projectId: 5, title: 'Order construction materials', description: 'Place order for tiles, plywood, and fixtures', status: 'completed', assignedTo: 'user_vikram_01', dueDate: new Date('2024-02-07').toISOString(), createdAt: new Date('2024-01-29').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { projectId: 5, title: 'Waterproofing and tiling work', description: 'Complete bathroom waterproofing and tiling', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-01-30').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { projectId: 5, title: 'Install fixtures and fittings', description: 'Set up new bathroom fixtures', status: 'pending', assignedTo: null, dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-01-31').toISOString(), updatedAt: new Date('2024-01-31').toISOString() },
        { projectId: 5, title: 'Painting and finishing touches', description: 'Apply paint and complete bathroom', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-05').toISOString(), createdAt: new Date('2024-02-01').toISOString(), updatedAt: new Date('2024-02-01').toISOString() },

        // Project 6 tasks
        { projectId: 6, title: 'Remove old flooring', description: 'Clear living room of existing flooring', status: 'pending', assignedTo: null, dueDate: new Date('2024-02-18').toISOString(), createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { projectId: 6, title: 'Order premium tiles', description: 'Purchase high-quality flooring tiles', status: 'pending', assignedTo: 'user_rajesh_01', dueDate: new Date('2024-02-22').toISOString(), createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { projectId: 6, title: 'Floor leveling work', description: 'Prepare floor base with cement', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-01').toISOString(), createdAt: new Date('2024-02-07').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },
        { projectId: 6, title: 'Tile installation', description: 'Lay new tiles in living room', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-10').toISOString(), createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { projectId: 6, title: 'Wall painting after flooring', description: 'Paint walls to match new flooring', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-20').toISOString(), createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },

        // Project 7 tasks
        { projectId: 7, title: 'Terrace inspection and cleaning', description: 'Check terrace condition and clean surface', status: 'completed', assignedTo: 'user_priya_01', dueDate: new Date('2023-12-22').toISOString(), createdAt: new Date('2023-12-20').toISOString(), updatedAt: new Date('2023-12-21').toISOString() },
        { projectId: 7, title: 'Order waterproofing materials', description: 'Purchase waterproofing compound and coating', status: 'completed', assignedTo: 'user_priya_01', dueDate: new Date('2023-12-26').toISOString(), createdAt: new Date('2023-12-21').toISOString(), updatedAt: new Date('2023-12-24').toISOString() },
        { projectId: 7, title: 'Apply waterproof coating', description: 'Complete waterproofing treatment', status: 'completed', assignedTo: null, dueDate: new Date('2024-01-03').toISOString(), createdAt: new Date('2023-12-22').toISOString(), updatedAt: new Date('2024-01-02').toISOString() },
        { projectId: 7, title: 'Install terrace tiles', description: 'Lay new tiles on waterproofed surface', status: 'completed', assignedTo: null, dueDate: new Date('2024-01-10').toISOString(), createdAt: new Date('2023-12-23').toISOString(), updatedAt: new Date('2024-01-08').toISOString() },
        { projectId: 7, title: 'Final cleanup and handover', description: 'Clean terrace and conduct inspection', status: 'completed', assignedTo: 'user_priya_01', dueDate: new Date('2024-01-15').toISOString(), createdAt: new Date('2023-12-24').toISOString(), updatedAt: new Date('2024-01-15').toISOString() },

        // Project 8 tasks
        { projectId: 8, title: 'Bedroom design planning', description: 'Finalize bedroom interior design', status: 'completed', assignedTo: 'user_amit_01', dueDate: new Date('2024-01-28').toISOString(), createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-01-26').toISOString() },
        { projectId: 8, title: 'Order marble and plywood', description: 'Purchase flooring marble and wardrobe plywood', status: 'completed', assignedTo: 'user_amit_01', dueDate: new Date('2024-02-03').toISOString(), createdAt: new Date('2024-01-23').toISOString(), updatedAt: new Date('2024-02-01').toISOString() },
        { projectId: 8, title: 'Install marble flooring', description: 'Complete bedroom floor marble work', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-01-24').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { projectId: 8, title: 'Build wardrobe and furniture', description: 'Construct custom bedroom furniture', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-28').toISOString(), createdAt: new Date('2024-01-25').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { projectId: 8, title: 'Painting and lighting setup', description: 'Paint walls and install lighting fixtures', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-10').toISOString(), createdAt: new Date('2024-01-26').toISOString(), updatedAt: new Date('2024-01-26').toISOString() },

        // Project 9 tasks
        { projectId: 9, title: 'Color selection and planning', description: 'Choose paint colors for entire house', status: 'pending', assignedTo: 'user_sneha_01', dueDate: new Date('2024-02-15').toISOString(), createdAt: new Date('2024-02-01').toISOString(), updatedAt: new Date('2024-02-01').toISOString() },
        { projectId: 9, title: 'Order paint and materials', description: 'Purchase interior and exterior paint', status: 'pending', assignedTo: 'user_sneha_01', dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-02-02').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { projectId: 9, title: 'Wall preparation and putty work', description: 'Prepare walls for painting', status: 'pending', assignedTo: null, dueDate: new Date('2024-02-28').toISOString(), createdAt: new Date('2024-02-03').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },
        { projectId: 9, title: 'Interior painting', description: 'Paint all interior walls and ceilings', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-15').toISOString(), createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { projectId: 9, title: 'Exterior painting', description: 'Complete exterior walls painting', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-25').toISOString(), createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },

        // Project 10 tasks
        { projectId: 10, title: 'Kitchen layout finalization', description: 'Finalize modular kitchen design', status: 'completed', assignedTo: 'user_vikram_01', dueDate: new Date('2024-01-20').toISOString(), createdAt: new Date('2024-01-15').toISOString(), updatedAt: new Date('2024-01-18').toISOString() },
        { projectId: 10, title: 'Order granite and plywood', description: 'Purchase kitchen countertop and cabinets material', status: 'completed', assignedTo: 'user_vikram_01', dueDate: new Date('2024-01-26').toISOString(), createdAt: new Date('2024-01-16').toISOString(), updatedAt: new Date('2024-01-24').toISOString() },
        { projectId: 10, title: 'Build kitchen cabinets', description: 'Construct modular kitchen cabinets', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-20').toISOString(), createdAt: new Date('2024-01-17').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
        { projectId: 10, title: 'Install granite countertop', description: 'Set up kitchen granite countertop', status: 'in_progress', assignedTo: null, dueDate: new Date('2024-02-25').toISOString(), createdAt: new Date('2024-01-18').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },
        { projectId: 10, title: 'Plumbing and electrical work', description: 'Complete kitchen plumbing and wiring', status: 'pending', assignedTo: null, dueDate: new Date('2024-03-05').toISOString(), createdAt: new Date('2024-01-19').toISOString(), updatedAt: new Date('2024-01-19').toISOString() },
    ];

    await db.insert(projectTasks).values(sampleProjectTasks);
    console.log('✅ Project tasks seeded successfully');

    // RFQ REQUESTS (20 records)
    const sampleRfqRequests = [
        // Submitted RFQs (8 records)
        { catalogId: 1, consumerId: 'user_rajesh_01', providerId: null, quantity: 1200, unit: 'sqft', message: 'Need premium tiles for living room renovation', preferredDate: new Date('2024-02-25').toISOString(), status: 'submitted', createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { catalogId: 15, consumerId: 'user_priya_01', providerId: null, quantity: 180, unit: 'bags', message: 'Required for foundation work, please quote best price', preferredDate: new Date('2024-03-01').toISOString(), status: 'submitted', createdAt: new Date('2024-02-07').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },
        { catalogId: 22, consumerId: 'user_amit_01', providerId: null, quantity: 250, unit: 'liters', message: 'Interior and exterior painting for complete house', preferredDate: new Date('2024-02-28').toISOString(), status: 'submitted', createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { catalogId: 5, consumerId: 'user_sneha_01', providerId: null, quantity: 650, unit: 'sqft', message: 'Italian marble for kitchen countertop', preferredDate: new Date('2024-03-05').toISOString(), status: 'submitted', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },
        { catalogId: 8, consumerId: 'user_vikram_01', providerId: null, quantity: 4, unit: 'sets', message: 'Premium bathroom fixtures for apartment renovation', preferredDate: new Date('2024-03-10').toISOString(), status: 'submitted', createdAt: new Date('2024-02-10').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { catalogId: 10, consumerId: 'user_rajesh_01', providerId: null, quantity: 320, unit: 'sqft', message: 'Plywood for interior work and cabinets', preferredDate: new Date('2024-03-15').toISOString(), status: 'submitted', createdAt: new Date('2024-02-11').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },
        { catalogId: 3, consumerId: 'user_priya_01', providerId: null, quantity: 950, unit: 'sqft', message: 'Need premium office flooring tiles urgently', preferredDate: new Date('2024-03-20').toISOString(), status: 'submitted', createdAt: new Date('2024-02-12').toISOString(), updatedAt: new Date('2024-02-12').toISOString() },
        { catalogId: 16, consumerId: 'user_amit_01', providerId: null, quantity: 150, unit: 'bags', message: 'Cement required for villa construction', preferredDate: new Date('2024-03-25').toISOString(), status: 'submitted', createdAt: new Date('2024-02-13').toISOString(), updatedAt: new Date('2024-02-13').toISOString() },

        // Responded RFQs (6 records)
        { catalogId: 2, consumerId: 'user_rajesh_01', providerId: 'user_suresh_01', quantity: 2200, unit: 'kg', message: 'TMT bars needed for apartment construction', preferredDate: new Date('2024-02-25').toISOString(), status: 'responded', createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { catalogId: 7, consumerId: 'user_priya_01', providerId: 'user_kiran_01', quantity: 820, unit: 'sqft', message: 'Bathroom tiles for villa project', preferredDate: new Date('2024-03-01').toISOString(), status: 'responded', createdAt: new Date('2024-01-30').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { catalogId: 11, consumerId: 'user_amit_01', providerId: 'user_deepak_01', quantity: 280, unit: 'sqft', message: 'Plywood for office partitions and cabinets', preferredDate: new Date('2024-03-05').toISOString(), status: 'responded', createdAt: new Date('2024-02-01').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { catalogId: 23, consumerId: 'user_sneha_01', providerId: 'user_suresh_01', quantity: 190, unit: 'liters', message: 'Premium paint for complete house interior', preferredDate: new Date('2024-03-10').toISOString(), status: 'responded', createdAt: new Date('2024-02-03').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { catalogId: 6, consumerId: 'user_vikram_01', providerId: 'user_ramesh_01', quantity: 380, unit: 'sqft', message: 'Granite for kitchen countertop installation', preferredDate: new Date('2024-03-15').toISOString(), status: 'responded', createdAt: new Date('2024-02-05').toISOString(), updatedAt: new Date('2024-02-10').toISOString() },
        { catalogId: 14, consumerId: 'user_priya_01', providerId: 'user_suresh_01', quantity: 5, unit: 'sets', message: 'Modern bathroom fixtures for villa bathrooms', preferredDate: new Date('2024-03-20').toISOString(), status: 'responded', createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-11').toISOString() },

        // Accepted RFQs (4 records)
        { catalogId: 4, consumerId: 'user_rajesh_01', providerId: 'user_ramesh_01', quantity: 1100, unit: 'sqft', message: 'Kitchen floor and wall tiles for renovation', preferredDate: new Date('2024-02-20').toISOString(), status: 'accepted', createdAt: new Date('2024-01-25').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { catalogId: 18, consumerId: 'user_sneha_01', providerId: 'user_deepak_01', quantity: 120, unit: 'bags', message: 'Cement for kitchen remodeling work', preferredDate: new Date('2024-02-22').toISOString(), status: 'accepted', createdAt: new Date('2024-01-26').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },
        { catalogId: 12, consumerId: 'user_amit_01', providerId: 'user_kiran_01', quantity: 210, unit: 'sqft', message: 'Plywood for bedroom wardrobe construction', preferredDate: new Date('2024-02-28').toISOString(), status: 'accepted', createdAt: new Date('2024-01-27').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { catalogId: 9, consumerId: 'user_vikram_01', providerId: 'user_kiran_01', quantity: 3, unit: 'sets', message: 'Premium fixtures for bathroom upgrade', preferredDate: new Date('2024-03-02').toISOString(), status: 'accepted', createdAt: new Date('2024-01-29').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },

        // Rejected RFQ (1 record)
        { catalogId: 25, consumerId: 'user_priya_01', providerId: 'user_ramesh_01', quantity: 300, unit: 'liters', message: 'Exterior paint for complete villa', preferredDate: new Date('2024-03-08').toISOString(), status: 'rejected', createdAt: new Date('2024-01-20').toISOString(), updatedAt: new Date('2024-01-28').toISOString() },

        // Expired RFQ (1 record)
        { catalogId: 13, consumerId: 'user_amit_01', providerId: 'user_deepak_01', quantity: 180, unit: 'sqft', message: 'Plywood for storage solutions', preferredDate: new Date('2024-02-15').toISOString(), status: 'expired', createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-02-14').toISOString() },
    ];

    await db.insert(rfqRequests).values(sampleRfqRequests);
    console.log('✅ RFQ requests seeded successfully');

    // QUOTES (25 records - multiple quotes per responded/accepted/rejected RFQ)
    const sampleQuotes = [
        // Quotes for RFQ 9 (responded - steel bars)
        { rfqId: 9, providerId: 'user_suresh_01', price: 52.50, currency: 'INR', deliveryEtaDays: 5, notes: 'Free delivery for orders above ₹50,000. 10% bulk discount included. Premium quality TMT bars with BIS certification.', status: 'pending', createdAt: new Date('2024-01-29').toISOString(), updatedAt: new Date('2024-01-29').toISOString() },
        { rfqId: 9, providerId: 'user_ramesh_01', price: 54.80, currency: 'INR', deliveryEtaDays: 7, notes: 'Best quality steel at competitive rates. Payment terms: 50% advance, 50% on delivery. 2-year warranty included.', status: 'pending', createdAt: new Date('2024-01-30').toISOString(), updatedAt: new Date('2024-01-30').toISOString() },
        { rfqId: 9, providerId: 'user_kiran_01', price: 51.20, currency: 'INR', deliveryEtaDays: 4, notes: 'Express delivery available. Bulk discount of 12% applied. Free installation guidance provided.', status: 'pending', createdAt: new Date('2024-02-01').toISOString(), updatedAt: new Date('2024-02-01').toISOString() },

        // Quotes for RFQ 10 (responded - bathroom tiles)
        { rfqId: 10, providerId: 'user_kiran_01', price: 68.50, currency: 'INR', deliveryEtaDays: 6, notes: 'Premium quality bathroom tiles. Free delivery within 50km. 5-year warranty on tiles.', status: 'pending', createdAt: new Date('2024-01-31').toISOString(), updatedAt: new Date('2024-01-31').toISOString() },
        { rfqId: 10, providerId: 'user_suresh_01', price: 72.00, currency: 'INR', deliveryEtaDays: 8, notes: 'Italian design bathroom tiles. Best rates in market. Installation support available at extra cost.', status: 'pending', createdAt: new Date('2024-02-02').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },

        // Quotes for RFQ 11 (responded - plywood)
        { rfqId: 11, providerId: 'user_deepak_01', price: 85.60, currency: 'INR', deliveryEtaDays: 5, notes: 'Premium grade plywood. BWR and BWP both available. Free delivery for orders above ₹20,000.', status: 'pending', createdAt: new Date('2024-02-02').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { rfqId: 11, providerId: 'user_ramesh_01', price: 89.20, currency: 'INR', deliveryEtaDays: 7, notes: 'Best quality commercial grade plywood. 10-year warranty. Payment terms flexible.', status: 'pending', createdAt: new Date('2024-02-03').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },
        { rfqId: 11, providerId: 'user_kiran_01', price: 83.40, currency: 'INR', deliveryEtaDays: 4, notes: 'Greenply branded plywood. Special discount for bulk orders. Installation guidance included.', status: 'pending', createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },

        // Quotes for RFQ 12 (responded - paint)
        { rfqId: 12, providerId: 'user_suresh_01', price: 420.00, currency: 'INR', deliveryEtaDays: 3, notes: 'Premium emulsion paint. Free color consultation. Bulk discount of 15% applied.', status: 'pending', createdAt: new Date('2024-02-04').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { rfqId: 12, providerId: 'user_deepak_01', price: 445.00, currency: 'INR', deliveryEtaDays: 5, notes: 'Asian Paints premium range. 5-year warranty. Free delivery and application tips.', status: 'pending', createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },

        // Quotes for RFQ 13 (responded - granite)
        { rfqId: 13, providerId: 'user_ramesh_01', price: 175.00, currency: 'INR', deliveryEtaDays: 8, notes: 'Premium quality granite. Free cutting and polishing. Installation charges separate.', status: 'pending', createdAt: new Date('2024-02-06').toISOString(), updatedAt: new Date('2024-02-06').toISOString() },
        { rfqId: 13, providerId: 'user_kiran_01', price: 168.50, currency: 'INR', deliveryEtaDays: 6, notes: 'Best granite at competitive rates. Free delivery. Payment: 60% advance, 40% on installation.', status: 'pending', createdAt: new Date('2024-02-08').toISOString(), updatedAt: new Date('2024-02-08').toISOString() },
        { rfqId: 13, providerId: 'user_deepak_01', price: 172.80, currency: 'INR', deliveryEtaDays: 7, notes: 'Imported granite slabs. Professional installation team available. 10-year warranty.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },

        // Quotes for RFQ 14 (responded - bathroom fixtures)
        { rfqId: 14, providerId: 'user_suresh_01', price: 15800.00, currency: 'INR', deliveryEtaDays: 4, notes: 'Premium Jaquar fixtures. Free installation. 5-year manufacturer warranty included.', status: 'pending', createdAt: new Date('2024-02-07').toISOString(), updatedAt: new Date('2024-02-07').toISOString() },
        { rfqId: 14, providerId: 'user_ramesh_01', price: 16500.00, currency: 'INR', deliveryEtaDays: 6, notes: 'Kohler branded fixtures. Best quality and design. Free delivery within city limits.', status: 'pending', createdAt: new Date('2024-02-09').toISOString(), updatedAt: new Date('2024-02-09').toISOString() },

        // Quotes for RFQ 15 (accepted - kitchen tiles) - 1 accepted, 2 rejected
        { rfqId: 15, providerId: 'user_ramesh_01', price: 58.50, currency: 'INR', deliveryEtaDays: 5, notes: 'Premium kitchen tiles with anti-skid surface. Free delivery. 10% bulk discount applied.', status: 'accepted', createdAt: new Date('2024-01-26').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { rfqId: 15, providerId: 'user_suresh_01', price: 62.00, currency: 'INR', deliveryEtaDays: 7, notes: 'Italian design kitchen tiles. Best rates in market. Payment terms: 50% advance.', status: 'rejected', createdAt: new Date('2024-01-27').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },
        { rfqId: 15, providerId: 'user_kiran_01', price: 60.20, currency: 'INR', deliveryEtaDays: 6, notes: 'Designer kitchen tiles. Free installation guidance. 5-year warranty.', status: 'rejected', createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-02').toISOString() },

        // Quotes for RFQ 16 (accepted - cement) - 1 accepted, 1 rejected
        { rfqId: 16, providerId: 'user_deepak_01', price: 385.00, currency: 'INR', deliveryEtaDays: 3, notes: 'Ultratech cement. Free delivery for orders above 100 bags. Best price guaranteed.', status: 'accepted', createdAt: new Date('2024-01-27').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },
        { rfqId: 16, providerId: 'user_suresh_01', price: 395.00, currency: 'INR', deliveryEtaDays: 4, notes: 'Premium grade cement. Payment terms flexible. Free technical support.', status: 'rejected', createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-03').toISOString() },

        // Quotes for RFQ 17 (accepted - plywood) - 1 accepted, 2 rejected
        { rfqId: 17, providerId: 'user_kiran_01', price: 82.40, currency: 'INR', deliveryEtaDays: 4, notes: 'Greenply commercial grade plywood. Bulk discount of 8%. Free delivery and cutting.', status: 'accepted', createdAt: new Date('2024-01-28').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { rfqId: 17, providerId: 'user_ramesh_01', price: 86.50, currency: 'INR', deliveryEtaDays: 6, notes: 'Premium BWR plywood. 10-year warranty. Installation support available.', status: 'rejected', createdAt: new Date('2024-01-29').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },
        { rfqId: 17, providerId: 'user_deepak_01', price: 84.20, currency: 'INR', deliveryEtaDays: 5, notes: 'Century plywood. Best quality at competitive rates. Free delivery.', status: 'rejected', createdAt: new Date('2024-01-30').toISOString(), updatedAt: new Date('2024-02-04').toISOString() },

        // Quotes for RFQ 18 (accepted - bathroom fixtures) - 1 accepted, 1 rejected
        { rfqId: 18, providerId: 'user_kiran_01', price: 12800.00, currency: 'INR', deliveryEtaDays: 3, notes: 'Premium bathroom fixtures with lifetime warranty. Free installation. Best value for money.', status: 'accepted', createdAt: new Date('2024-01-30').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },
        { rfqId: 18, providerId: 'user_suresh_01', price: 14200.00, currency: 'INR', deliveryEtaDays: 5, notes: 'Jaquar premium fixtures. 5-year warranty. Free delivery within 50km.', status: 'rejected', createdAt: new Date('2024-01-31').toISOString(), updatedAt: new Date('2024-02-05').toISOString() },

        // Quotes for RFQ 19 (rejected - paint) - all rejected
        { rfqId: 19, providerId: 'user_ramesh_01', price: 465.00, currency: 'INR', deliveryEtaDays: 4, notes: 'Berger weatherproof exterior paint. Free color matching. Bulk discount available.', status: 'rejected', createdAt: new Date('2024-01-21').toISOString(), updatedAt: new Date('2024-01-28').toISOString() },
        { rfqId: 19, providerId: 'user_suresh_01', price: 458.00, currency: 'INR', deliveryEtaDays: 3, notes: 'Asian Paints apex exterior. 7-year warranty. Free delivery and application tips.', status: 'rejected', createdAt: new Date('2024-01-22').toISOString(), updatedAt: new Date('2024-01-28').toISOString() },
    ];

    await db.insert(quotes).values(sampleQuotes);
    console.log('✅ Quotes seeded successfully');

    console.log('✅ All comprehensive project data seeded successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});