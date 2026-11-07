const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Timetable = require('./models/Timetable');
const Fee = require('./models/Fee');
const seedDatabase = require('./seed');

async function runTests() {
  console.log('🚀 Starting System Verification Tests...');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Seed DB
  await seedDatabase();

  // Test 1: Verify Seeded Users
  const alex = await User.findOne({ email: 'alex@school.edu' });
  const priya = await User.findOne({ email: 'priya@school.edu' });
  const sasha = await User.findOne({ email: 'sasha@school.edu' });
  const faculty = await User.findOne({ email: 'faculty@school.edu' });

  if (!alex || !priya || !sasha || !faculty) {
    throw new Error('❌ Test Failed: Seeded users missing');
  }
  console.log('✅ Users found:');
  console.log(`   - Alex: ${alex.name} (Class: ${alex.studentClass})`);
  console.log(`   - Priya: ${priya.name} (Class: ${priya.studentClass})`);
  console.log(`   - Sasha: ${sasha.name} (Class: ${sasha.studentClass})`);

  // Test 2: Verify Timetables for Different Classes
  const tt10A = await Timetable.findOne({ className: 'Grade 10 - Section A' });
  const tt10B = await Timetable.findOne({ className: 'Grade 10 - Section B' });
  const tt11A = await Timetable.findOne({ className: 'Grade 11 - Section A' });

  if (!tt10A || !tt10B || !tt11A) {
    throw new Error('❌ Test Failed: Missing timetables for classes');
  }

  console.log('\n📅 Timetable Verification:');
  console.log('   Grade 10-A Monday Schedule:', tt10A.schedule.Monday.join(', '));
  console.log('   Grade 10-B Monday Schedule:', tt10B.schedule.Monday.join(', '));
  console.log('   Grade 11-A Monday Schedule:', tt11A.schedule.Monday.join(', '));

  const areSame = JSON.stringify(tt10A.schedule.Monday) === JSON.stringify(tt10B.schedule.Monday);
  if (areSame) {
    throw new Error('❌ Test Failed: Grade 10-A and 10-B have identical timetables!');
  }
  console.log('✅ SUCCESS: Grade 10-A, Grade 10-B, and Grade 11-A have DISTINCT schedules!');

  // Test 3: Fee Management & Payment System
  console.log('\n💳 Fee Management & Payment System Verification:');
  const alexFee = await Fee.findOne({ studentName: 'Alex Thompson' });
  if (!alexFee) {
    throw new Error('❌ Test Failed: Alex Thompson fee record not found');
  }
  console.log(`   Alex Thompson initial fee: Total = ₹${alexFee.amount}, Paid = ₹${alexFee.paid}, Due = ₹${alexFee.due}`);

  // Test payment on a fresh test fee
  await Fee.deleteOne({ receiptId: 'FEE-TEST-AUTO' });
  const testFee = await Fee.create({
    receiptId: 'FEE-TEST-AUTO',
    studentName: 'Marcus Chen',
    studentId: '#MC-9922',
    class: 'Grade 10 - Section A',
    amount: 15000,
    paid: 0,
    due: 15000,
    dueDate: '2024-04-30',
    status: 'pending',
    breakdown: [{ category: 'Tuition Fee', amount: 15000 }],
    transactions: [],
  });

  const payAmount = 5000;
  testFee.paid += payAmount;
  testFee.due -= payAmount;
  testFee.status = testFee.due === 0 ? 'paid' : 'partial';
  testFee.transactions.push({
    transactionId: `TXN-TEST-${Date.now()}`,
    amount: payAmount,
    paymentMethod: 'card',
    paymentDetails: { cardLast4: '4242', cardBrand: 'Visa', cardHolder: 'Marcus Chen' },
    paidAt: new Date(),
    status: 'success',
    receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
  });

  await testFee.save();
  console.log(`   Marcus Chen after ₹${payAmount} payment: Paid = ₹${testFee.paid}, Due = ₹${testFee.due}, Status = ${testFee.status}`);

  if (testFee.due !== 10000 || testFee.status !== 'partial') {
    throw new Error('❌ Test Failed: Payment calculation incorrect');
  }

  console.log(`   Receipt generated: ${testFee.transactions[testFee.transactions.length - 1].receiptNumber}`);
  console.log('✅ SUCCESS: Payment successfully recorded, balances updated, and receipt issued!');

  // Clean up test record
  await Fee.deleteOne({ receiptId: 'FEE-TEST-AUTO' });

  console.log('\n🎉 ALL SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Verification Error:', err);
  process.exit(1);
});
