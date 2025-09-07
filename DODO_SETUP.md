# Dodo Payments Product Setup Guide

## 🚀 Quick Setup Instructions

Since Dodo Payments products are created through the dashboard UI (not API), you need to manually create the required product for your carbon credits platform.

### Step 1: Access Dodo Payments Dashboard

1. Go to [https://app.dodopayments.com/](https://app.dodopayments.com/)
2. Log in with your Dodo Payments account

### Step 2: Create the Carbon Credit Product

1. **Navigate to Products**
   - Click "Products" in the sidebar to view your catalogue

2. **Add New Product**
   - Click "Add New Product"
   - Select "One-Time Payment Product" from the dropdown

3. **Fill in Product Details**
   ```
   Product Name: Carbon Credit Investment
   Description: Investment in verified carbon offset projects for environmental sustainability
   Price: $25.00
   Product Category: Digital Products
   ```

   **🔍 IMPORTANT: Finding the Product ID Field**
   - Look for an "Advanced Settings" or "Developer Settings" section
   - The Product ID field might be labeled as:
     - "Product ID" 
     - "SKU"
     - "Product Code"
     - "Custom ID"
   - If you don't see it initially, try:
     - Clicking "Show Advanced Options"
     - Looking in a "Developer" or "API" tab
     - Scrolling down to find additional fields

   **✅ Set the Product ID to: `prod_carbon_credit_001`**

4. **Optional Settings**
   - Discount: Leave as 0% (no discount)
   - Upload an image if desired (carbon credit or environmental theme)

5. **Save Product**
   - Click "Save" to create the product
   - You should see "prod_carbon_credit_001" in your products list

### Step 3: Verify Setup

After creating the product, run this command to test the connection:

```bash
npm run test-dodo
```

If you see "Successfully created test payment", your setup is complete! 🎉

### Step 4: Test Your Platform

1. Visit your deployed platform: https://carbon-credits-qxg8zz844-akshita-srivastavas-projects.vercel.app
2. Try creating an investment to test the payment flow
3. Use test card: `4242 4242 4242 4242` with any future expiry and CVV

## 🔧 Alternative Product IDs (Optional)

If you want to create additional product types later, use these IDs:

```
prod_carbon_credit_forestry - For forestry projects ($30.00)
prod_carbon_credit_renewable - For renewable energy projects ($20.00)
```

## ✅ Expected Result

Once the product is created, your platform will:
- ✅ Process investor payments successfully
- ✅ Calculate fees automatically (5% platform fee)
- ✅ Schedule payouts to project holders
- ✅ Run daily automated payout processing

## 🆘 Troubleshooting

If you still get "Product does not exist" errors:
1. Double-check the Product ID is exactly: `prod_carbon_credit_001`
2. Ensure the product is "Active" in your dashboard
3. Verify you're using the correct API key environment (test/live)

## 🔧 Troubleshooting: Can't Find Product ID Field?

### Option 1: Auto-Generated ID
Some Dodo interfaces auto-generate product IDs. If you can't find the Product ID field:

1. **Create the product first** with just the name, description, and price
2. **Note the auto-generated ID** (it will show after creation)
3. **Contact me with the generated ID** - I can update the code to use that ID instead

### Option 2: Alternative Product ID Locations
Try looking in these areas of the Dodo dashboard:

- **After creating the product**: The ID might appear in the product list view
- **Product settings page**: Click on the created product to see more details
- **Developer/API section**: Some platforms have a separate developer area
- **Product URL**: The ID might be visible in the browser URL when viewing the product

### Option 3: Use API to Check Product IDs
If you've created any products, we can check what IDs exist:

```bash
# This will show all your existing products and their IDs
npm run test-dodo
```

### Option 4: Create with Different Name
If the Product ID field is truly not available:

1. Create the product with name: **"Carbon Credit Investment"**
2. Let me know what ID gets generated
3. I'll update the code to match your actual product ID

## 📞 Need Help?

If you encounter any issues:
1. Check the [Dodo Payments Documentation](https://docs.dodopayments.com/)
2. Contact Dodo Payments support through their dashboard
3. Verify your API credentials are correct

---

**🎯 Next Steps After Setup:**
Your carbon credits payment system will be fully operational with automated daily payouts to project holders!
