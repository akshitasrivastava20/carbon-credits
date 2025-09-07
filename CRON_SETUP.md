# 🕐 Carbon Credits Payout Cron Job Setup Guide

This guide shows you how to set up automated payout processing for your carbon credits platform.

## 📋 Prerequisites

1. **Environment Variable Required:**
   ```bash
   CRON_SECRET_TOKEN=cron_secure_token_2025_carbon_credits_payouts_xyz123
   ```

2. **API Endpoint:**
   ```
   POST /api/cron/process-payouts
   Authorization: Bearer cron_secure_token_2025_carbon_credits_payouts_xyz123
   ```

## 🚀 Option 1: Vercel Cron Jobs (Recommended)

**Best for:** Vercel deployments, simple setup, no external dependencies

### Setup:
1. **Add vercel.json to your project root:**
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/process-payouts",
         "schedule": "*/5 * * * *"
       }
     ]
   }
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Verify in Vercel Dashboard:**
   - Go to your project → Functions → Cron Jobs
   - Should show: "process-payouts" running every 5 minutes

**Schedule Options:**
- `*/5 * * * *` - Every 5 minutes
- `*/15 * * * *` - Every 15 minutes  
- `0 */2 * * *` - Every 2 hours
- `0 9,17 * * *` - 9 AM and 5 PM daily

---

## 🌐 Option 2: GitHub Actions (Free)

**Best for:** Any hosting platform, version control integration

### Setup:
1. **Create `.github/workflows/process-payouts.yml`:**
   ```yaml
   name: Process Carbon Credit Payouts
   
   on:
     schedule:
       - cron: '*/5 * * * *'  # Every 5 minutes
     workflow_dispatch:  # Allow manual trigger
   
   jobs:
     process-payouts:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger Payout Processing
           run: |
             curl -X POST \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}" \
               -H "Content-Type: application/json" \
               "${{ secrets.APP_URL }}/api/cron/process-payouts"
   ```

2. **Add GitHub Secrets:**
   - Go to repository → Settings → Secrets → Actions
   - Add: `CRON_SECRET_TOKEN` = `cron_secure_token_2025_carbon_credits_payouts_xyz123`
   - Add: `APP_URL` = `https://your-app.vercel.app`

---

## ☁️ Option 3: External Cron Services

### 3a. Cron-job.org (Free)
1. Go to https://cron-job.org
2. Create account and new cron job:
   - **URL:** `https://your-app.vercel.app/api/cron/process-payouts`
   - **Schedule:** `*/5 * * * *`
   - **Method:** POST
   - **Headers:** `Authorization: Bearer cron_secure_token_2025_carbon_credits_payouts_xyz123`

### 3b. EasyCron (Free tier available)
1. Go to https://www.easycron.com
2. Create cron job:
   - **URL:** `https://your-app.vercel.app/api/cron/process-payouts`
   - **Execution:** Every 5 minutes
   - **HTTP Method:** POST
   - **HTTP Headers:** `Authorization: Bearer cron_secure_token_2025_carbon_credits_payouts_xyz123`

### 3c. AWS CloudWatch Events
```bash
# Create CloudWatch rule
aws events put-rule \
  --name carbon-credits-payouts \
  --schedule-expression "rate(5 minutes)"

# Add target (Lambda function that calls your API)
aws events put-targets \
  --rule carbon-credits-payouts \
  --targets "Id"="1","Arn"="arn:aws:lambda:region:account:function:trigger-payouts"
```

---

## 🖥️ Option 4: Self-Hosted Server

**Best for:** Full control, existing server infrastructure

### Using PM2 with Node.js:
1. **Create `scripts/cron-runner.js`:**
   ```javascript
   const https = require('https');
   
   const options = {
     hostname: 'your-app.vercel.app',
     path: '/api/cron/process-payouts',
     method: 'POST',
     headers: {
       'Authorization': 'Bearer cron_secure_token_2025_carbon_credits_payouts_xyz123',
       'Content-Type': 'application/json'
     }
   };
   
   const req = https.request(options, (res) => {
     console.log(`Payout processing: ${res.statusCode}`);
   });
   
   req.on('error', (error) => {
     console.error('Cron job error:', error);
   });
   
   req.end();
   ```

2. **Setup with PM2:**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Create ecosystem file
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'carbon-credits-cron',
       script: 'scripts/cron-runner.js',
       cron_restart: '*/5 * * * *',
       autorestart: false,
       watch: false
     }]
   };
   EOF
   
   # Start the cron job
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Using Traditional Cron:
```bash
# Edit crontab
crontab -e

# Add this line:
*/5 * * * * curl -X POST -H "Authorization: Bearer cron_secure_token_2025_carbon_credits_payouts_xyz123" https://your-app.vercel.app/api/cron/process-payouts
```

---

## 🧪 Testing Your Cron Job

### Manual Test (Development):
```bash
# Test the endpoint directly
curl -X GET http://localhost:3000/api/cron/process-payouts

# Test with authentication
curl -X POST \
  -H "Authorization: Bearer cron_secure_token_2025_carbon_credits_payouts_xyz123" \
  https://your-app.vercel.app/api/cron/process-payouts
```

### Check Logs:
1. **Vercel:** Dashboard → Functions → View Logs
2. **GitHub Actions:** Actions tab → Workflow runs
3. **External services:** Check their dashboards
4. **Self-hosted:** `pm2 logs` or server logs

---

## 📊 Monitoring Your Cron Jobs

### Add to your dashboard:
```typescript
// Create admin endpoint to check cron status
GET /api/admin/cron-status

Response:
{
  "lastRun": "2025-09-07T10:35:00Z",
  "nextRun": "2025-09-07T10:40:00Z",
  "successfulRuns": 1440,  // Last 24 hours
  "failedRuns": 2,
  "pendingPayouts": 5
}
```

### Set up alerts:
- **Slack/Discord webhook** when payouts fail
- **Email notifications** for large payout batches
- **Database monitoring** for stuck payouts

---

## 🔧 Troubleshooting

### Common Issues:

1. **Authentication fails:**
   ```bash
   # Check if secret matches
   echo $CRON_SECRET_TOKEN
   ```

2. **Cron not running:**
   ```bash
   # Verify schedule syntax at crontab.guru
   # Check timezone settings
   ```

3. **API timeouts:**
   ```bash
   # Increase timeout for large payout batches
   # Process in smaller batches
   ```

4. **Database connection issues:**
   ```bash
   # Check connection pool limits
   # Monitor concurrent connections
   ```

---

## 🎯 Recommended Setup

**For Production:**
1. **Primary:** Vercel Cron (if using Vercel)
2. **Backup:** GitHub Actions (redundancy)
3. **Monitoring:** Custom admin dashboard

**Schedule:**
- **High volume:** Every 5 minutes
- **Medium volume:** Every 15 minutes  
- **Low volume:** Every hour

**Security:**
- Use environment variables for secrets
- Implement IP whitelisting if possible
- Log all cron executions
- Set up failure alerts

---

This setup ensures your carbon credit payouts are processed automatically and reliably! 🌱💰
