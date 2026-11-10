const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Policy = require('./models/Policy');
const UserPolicy = require('./models/UserPolicy');
const Claim = require('./models/Claim');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Policy.deleteMany({}),
      UserPolicy.deleteMany({}),
      Claim.deleteMany({}),
    ]);

    console.log('Seeding demo accounts...');
    // Create admin and customer accounts
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@insure.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin',
    });

    const customer = await User.create({
      name: 'Ankit',
      email: 'customer@insure.com',
      phone: '9123456780',
      password: 'customer123',
      role: 'customer',
    });

    console.log('Seeding 6 policies across all categories...');
    const policies = await Policy.create([
      {
        title: 'Gold Health Shield',
        category: 'Health',
        description: 'Comprehensive health coverage for individuals including cashless hospitalization and daycare.',
        basePremium: 5000,
        coverageAmount: 500000,
        durationInMonths: 12,
        features: [
          'Cashless Hospitalization',
          'Pre & Post Hospitalization',
          'No Claim Bonus',
          'Daycare Procedures Covered',
        ],
        isActive: true,
      },
      {
        title: 'Family Floater Plus',
        category: 'Health',
        description: 'Complete family healthcare plan covering spouse, children, and parents with maternity benefits.',
        basePremium: 8000,
        coverageAmount: 1000000,
        durationInMonths: 12,
        features: [
          'Covers up to 4 family members',
          'Maternity benefit',
          'Critical illness rider',
          'Annual health checkup',
        ],
        isActive: true,
      },
      {
        title: 'Comprehensive Motor Guard',
        category: 'Auto',
        description: 'Full-spectrum vehicle insurance covering accidents, theft, roadside aid, and third-party damages.',
        basePremium: 3500,
        coverageAmount: 300000,
        durationInMonths: 12,
        features: [
          'Zero Depreciation',
          '24x7 Roadside Assistance',
          'Engine Protection',
          'Third-party legal liability',
        ],
        isActive: true,
      },
      {
        title: 'Two-Wheeler Easy Protect',
        category: 'Auto',
        description: 'Affordable two-wheeler protection with instant cashless repairs and personal accident protection.',
        basePremium: 1200,
        coverageAmount: 100000,
        durationInMonths: 12,
        features: [
          'Personal accident cover',
          'Immediate cashless claim',
          'Theft & accidental damage protection',
        ],
        isActive: true,
      },
      {
        title: 'Term Life Supreme',
        category: 'Life',
        description: 'High-coverage term insurance ensuring financial security and peace of mind for your loved ones.',
        basePremium: 6000,
        coverageAmount: 2500000,
        durationInMonths: 36,
        features: [
          'High sum assured',
          'Terminal illness cover',
          'Tax saving benefits',
          'Flexible payout options',
        ],
        isActive: true,
      },
      {
        title: 'Home & Property Secure',
        category: 'Home',
        description: 'Protect your residence and valuables against fire, theft, natural disasters, and structural harm.',
        basePremium: 4500,
        coverageAmount: 1500000,
        durationInMonths: 24,
        features: [
          'Fire and lightning cover',
          'Burglary & theft protection',
          'Natural calamity cover',
          'Electrical breakdown cover',
        ],
        isActive: true,
      },
    ]);

    console.log('Seeding active purchased policy for customer...');
    const goldHealth = policies[0];
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + goldHealth.durationInMonths);

    const userPolicy = await UserPolicy.create({
      user: customer._id,
      policy: goldHealth._id,
      policyNumber: 'POL-2026-1001',
      startDate,
      endDate,
      premiumPaid: goldHealth.basePremium,
      remainingCoverage: goldHealth.coverageAmount,
      nomineeName: 'Jane Doe',
      nomineeRelation: 'Spouse',
      status: 'Active',
    });

    console.log('Seeding pending claim...');
    const incidentDate = new Date();
    incidentDate.setDate(incidentDate.getDate() - 3);

    await Claim.create({
      userPolicy: userPolicy._id,
      user: customer._id,
      claimNumber: 'CLM-2026-5001',
      incidentDate,
      claimAmount: 25000,
      reason: 'Emergency hospitalization due to acute food poisoning',
      status: 'Pending',
      adminRemarks: '',
    });

    console.log('\n=============================================');
    console.log('Seed data successfully loaded!');
    console.log('Admin account:    admin@insure.com / admin123');
    console.log('Customer account: customer@insure.com / customer123');
    console.log('Policies:         6 created across Health, Auto, Life, Home');
    console.log('Purchased:        1 active policy for customer (POL-2026-1001)');
    console.log('Claims:           1 pending claim (CLM-2026-5001 - ₹25,000)');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

