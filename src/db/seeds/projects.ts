import { db } from '@/db';
import { projects, projectItems, projectTasks, projectMembers } from '@/db/schema';

async function main() {
    // Create 10 projects
    const sampleProjects = [
        {
            ownerId: 'user_rajesh_01',
            title: '2BHK Apartment Renovation - Vaishali Nagar',
            address: 'Flat 304, Green Valley Apartments, Vaishali Nagar, Jaipur',
            city: 'Jaipur',
            budget: 350000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-02-10T00:00:00Z',
        },
        {
            ownerId: 'user_priya_01',
            title: 'Villa Construction - Mansarovar Extension',
            address: 'Plot 45, Mansarovar Extension, Jaipur',
            city: 'Jaipur',
            budget: 4500000,
            currency: 'INR',
            status: 'planning',
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-10T00:00:00Z',
        },
        {
            ownerId: 'user_amit_01',
            title: 'Office Interior - MG Road',
            address: 'Office 502, Tech Park, MG Road, Bangalore',
            city: 'Bangalore',
            budget: 1200000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-02-12T00:00:00Z',
        },
        {
            ownerId: 'user_sneha_01',
            title: 'Kitchen Remodeling - Malviya Nagar',
            address: 'House 23, Malviya Nagar, Jaipur',
            city: 'Jaipur',
            budget: 250000,
            currency: 'INR',
            status: 'completed',
            createdAt: '2024-01-05T00:00:00Z',
            updatedAt: '2024-02-15T00:00:00Z',
        },
        {
            ownerId: 'user_vikram_01',
            title: 'Bathroom Upgrade - Sector 18',
            address: 'Flat 201, DLF Complex, Sector 18, Delhi',
            city: 'Delhi',
            budget: 180000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: '2024-01-18T00:00:00Z',
            updatedAt: '2024-02-08T00:00:00Z',
        },
        {
            ownerId: 'user_rajesh_01',
            title: 'Living Room Flooring - Civil Lines',
            address: 'Bungalow 7, Civil Lines, Jaipur',
            city: 'Jaipur',
            budget: 120000,
            currency: 'INR',
            status: 'planning',
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-02-01T00:00:00Z',
        },
        {
            ownerId: 'user_priya_01',
            title: 'Terrace Waterproofing - Andheri West',
            address: 'Building A, 12th Floor, Andheri West, Mumbai',
            city: 'Mumbai',
            budget: 85000,
            currency: 'INR',
            status: 'completed',
            createdAt: '2024-01-08T00:00:00Z',
            updatedAt: '2024-01-28T00:00:00Z',
        },
        {
            ownerId: 'user_amit_01',
            title: 'Bedroom Interior - Whitefield',
            address: 'Villa 12, Whitefield, Bangalore',
            city: 'Bangalore',
            budget: 320000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: '2024-01-25T00:00:00Z',
            updatedAt: '2024-02-14T00:00:00Z',
        },
        {
            ownerId: 'user_sneha_01',
            title: 'Complete House Painting',
            address: '301 Vaishali Nagar, Jaipur',
            city: 'Jaipur',
            budget: 95000,
            currency: 'INR',
            status: 'planning',
            createdAt: '2024-02-05T00:00:00Z',
            updatedAt: '2024-02-05T00:00:00Z',
        },
        {
            ownerId: 'user_vikram_01',
            title: 'Modular Kitchen Setup - Karol Bagh',
            address: '3rd Floor, Karol Bagh, Delhi',
            city: 'Delhi',
            budget: 420000,
            currency: 'INR',
            status: 'in_progress',
            createdAt: '2024-01-22T00:00:00Z',
            updatedAt: '2024-02-11T00:00:00Z',
        }
    ];

    await db.insert(projects).values(sampleProjects);
    console.log('✅ Projects seeded: 10 projects created');

    // Create project tasks (4-6 per project)
    const sampleTasks = [
        // Project 1 tasks
        { projectId: 1, title: 'Select tiles design', description: 'Choose floor and wall tiles', status: 'completed', assignedTo: 'user_rajesh_01', dueDate: '2024-01-20', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        { projectId: 1, title: 'Order materials', description: 'Purchase tiles, cement, and paint', status: 'completed', assignedTo: 'user_rajesh_01', dueDate: '2024-01-25', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-22T00:00:00Z' },
        { projectId: 1, title: 'Labor arrangement', description: 'Hire mason and helpers', status: 'in_progress', assignedTo: null, dueDate: '2024-02-15', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z' },
        { projectId: 1, title: 'Quality inspection', description: 'Final quality check', status: 'pending', assignedTo: null, dueDate: '2024-02-28', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
        
        // Project 2 tasks
        { projectId: 2, title: 'Architect drawings approval', description: 'Get municipal approval', status: 'in_progress', assignedTo: 'user_priya_01', dueDate: '2024-02-20', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z' },
        { projectId: 2, title: 'Site preparation', description: 'Clear and level the plot', status: 'pending', assignedTo: null, dueDate: '2024-03-01', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z' },
        { projectId: 2, title: 'Foundation work', description: 'Excavation and foundation', status: 'pending', assignedTo: null, dueDate: '2024-03-15', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z' },
        
        // Project 3 tasks
        { projectId: 3, title: 'Design consultation', description: 'Meet interior designer', status: 'completed', assignedTo: 'user_amit_01', dueDate: '2024-01-25', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-23T00:00:00Z' },
        { projectId: 3, title: 'Furniture order', description: 'Order office furniture', status: 'in_progress', assignedTo: 'user_amit_01', dueDate: '2024-02-15', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-02-12T00:00:00Z' },
        { projectId: 3, title: 'Electrical work', description: 'Install lights and switches', status: 'in_progress', assignedTo: null, dueDate: '2024-02-20', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-02-12T00:00:00Z' },
        { projectId: 3, title: 'Final setup', description: 'Arrange furniture and decor', status: 'pending', assignedTo: null, dueDate: '2024-02-25', createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
    ];

    await db.insert(projectTasks).values(sampleTasks);
    console.log('✅ Project tasks seeded: 11 tasks created');

    // Create project members
    const sampleMembers = [
        { projectId: 1, userId: 'user_rajesh_01', role: 'owner', joinedAt: '2024-01-15T00:00:00Z' },
        { projectId: 2, userId: 'user_priya_01', role: 'owner', joinedAt: '2024-01-10T00:00:00Z' },
        { projectId: 3, userId: 'user_amit_01', role: 'owner', joinedAt: '2024-01-20T00:00:00Z' },
        { projectId: 3, userId: 'user_vikram_01', role: 'member', joinedAt: '2024-01-25T00:00:00Z' },
    ];

    await db.insert(projectMembers).values(sampleMembers);
    console.log('✅ Project members seeded: 4 members created');
}

main().catch((error) => {
    console.error('❌ Projects seeder failed:', error);
});
