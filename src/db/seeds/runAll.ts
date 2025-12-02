import { execSync } from 'child_process';

const seedFiles = [
  'user.ts',
  'profilesProvider.ts',
  'catalogs.ts',
  'projects.ts',
  'rfqs.ts',
  'blogs.ts',
  'social.ts',
  'cityKnowledge.ts'
];

console.log('🌱 Starting database seeding...\n');

for (const file of seedFiles) {
  try {
    console.log(`📦 Running: ${file}`);
    execSync(`bun run src/db/seeds/${file}`, { stdio: 'inherit' });
    console.log(`✅ Completed: ${file}\n`);
  } catch (error) {
    console.error(`❌ Failed: ${file}`, error);
    process.exit(1);
  }
}

console.log('🎉 All seeds completed successfully!');
console.log('\n📊 Summary:');
console.log('- 10 Users (5 consumers, 4 providers, 1 admin)');
console.log('- 4 Provider Profiles (verified businesses)');
console.log('- 30 Catalog Items (tiles, cement, steel, marble, fixtures, etc.)');
console.log('- 10 Projects (various construction/renovation projects)');
console.log('- 11 Project Tasks');
console.log('- 20 RFQ Requests (mix of statuses)');
console.log('- 12 Quotes (competitive pricing)');
console.log('- 6 Blog Posts (RERA, tiles, land conversion, GST, Vastu, prices)');
console.log('- 10 Social Posts');
console.log('- 10 Social Comments');
console.log('- 6 Social Groups');
console.log('- 10 Ratings');
console.log('- 10 Notifications');
console.log('- 4 City Knowledge Entries (Jaipur, Delhi, Mumbai, Bangalore)');
console.log('- 6 Verification Documents');
console.log('\n✨ Your Hub4Estate platform is now ready for testing!');
