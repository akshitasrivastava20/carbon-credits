/**
 * Alternative approach: Create a test payment instead of products
 * Since products are typically created through the dashboard
 */

// Load environment variables
require('dotenv').config();

const { DodoPayments } = require('dodopayments');

async function testDodoConnection() {
  try {
    const dodo = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY,
      environment: process.env.NEXT_PUBLIC_DODO_MODE === 'live' ? 'live_mode' : 'test_mode'
    });

    console.log('🚀 Testing Dodo Payments connection...');

    // Try to create a test payment link to verify our setup
    const testPayment = await dodo.payments.create({
      payment_link: true,
      billing: { 
        city: 'Test City', 
        country: 'US', 
        state: 'CA', 
        street: '123 Test St', 
        zipcode: 12345 
      },
      customer: { 
        email: 'test@example.com', 
        name: 'Test User' 
      },
      product_cart: [{ 
        product_id: 'pdt_pTi3uI8TBUHEgRTqXT9Ep', // Your actual product ID 
        quantity: 1 
      }],
    });

    console.log('✅ Successfully created test payment:', testPayment.payment_id);
    console.log('Payment link:', testPayment.payment_link);
    console.log('\n🎉 Dodo Payments connection is working!');
    console.log('The product pdt_pTi3uI8TBUHEgRTqXT9Ep exists and can be used for payments.');

  } catch (error) {
    if (error.message?.includes('pdt_pTi3uI8TBUHEgRTqXT9Ep does not exist')) {
      console.log('❌ Product pdt_pTi3uI8TBUHEgRTqXT9Ep does not exist.');
      console.log('\n📝 Please create the product manually in your Dodo Payments dashboard:');
      console.log('1. Go to https://app.dodopayments.com/');
      console.log('2. Navigate to Products section');
      console.log('3. Click "Add New Product"');
      console.log('4. Select "One-Time Payment Product"');
      console.log('5. Fill in the details:');
      console.log('   - Product ID: pdt_pTi3uI8TBUHEgRTqXT9Ep');
      console.log('   - Product Name: Carbon Credit Investment');
      console.log('   - Description: Investment in verified carbon offset projects');
      console.log('   - Price: $25.00 (or any amount)');
      console.log('   - Category: Digital Products');
      console.log('6. Save the product');
      console.log('\nAfter creating the product, your payment system will work correctly!');
    } else {
      console.error('❌ Error testing Dodo connection:', error);
      console.error('Error details:', error.message);
    }
  }
}

// Run the test
testDodoConnection();
