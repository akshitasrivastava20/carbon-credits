#!/bin/bash

# 🧪 Test script for Carbon Credits Payout Cron Job
# Run this to verify your cron job setup is working

echo "🚀 Testing Carbon Credits Payout Cron Job..."
echo "=============================================="

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
SECRET_TOKEN="${CRON_SECRET_TOKEN:-cron_secure_token_2025_carbon_credits_payouts_xyz123}"

echo "📍 Testing endpoint: $APP_URL/api/cron/process-payouts"
echo "🔐 Using token: ${SECRET_TOKEN:0:20}..."
echo ""

# Test 1: Manual test endpoint (development only)
echo "🧪 Test 1: Manual test (GET - dev only)"
echo "----------------------------------------"
response1=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$APP_URL/api/cron/process-payouts")
echo "$response1"
echo ""

# Test 2: Authenticated POST request (production)
echo "🔒 Test 2: Authenticated request (POST - production)"
echo "------------------------------------------------"
response2=$(curl -s -X POST \
  -H "Authorization: Bearer $SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_CODE:%{http_code}" \
  "$APP_URL/api/cron/process-payouts")
echo "$response2"
echo ""

# Test 3: Check if authentication works
echo "🚫 Test 3: Unauthorized request (should fail)"
echo "--------------------------------------------"
response3=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -w "\nHTTP_CODE:%{http_code}" \
  "$APP_URL/api/cron/process-payouts")
echo "$response3"
echo ""

# Test 4: Wrong token (should fail)
echo "❌ Test 4: Wrong token (should fail)"
echo "-----------------------------------"
response4=$(curl -s -X POST \
  -H "Authorization: Bearer wrong_token" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_CODE:%{http_code}" \
  "$APP_URL/api/cron/process-payouts")
echo "$response4"
echo ""

echo "✅ Cron job testing completed!"
echo ""
echo "📋 Expected results:"
echo "- Test 1: Should work in development (200)"
echo "- Test 2: Should work with correct token (200)" 
echo "- Test 3: Should fail without token (401)"
echo "- Test 4: Should fail with wrong token (401)"
echo ""
echo "🔧 If tests fail, check:"
echo "1. Your app is running"
echo "2. CRON_SECRET_TOKEN environment variable is set"
echo "3. The endpoint URL is correct"
echo "4. Database connection is working"
