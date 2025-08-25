# EDR Telemetry Database Updater - Google Cloud Function

This Google Cloud Function automatically updates your Supabase database with the latest EDR telemetry data from GitHub when triggered by a webhook.

## 🚀 Features

- **Automatic Database Updates**: Syncs data from GitHub JSON files to Supabase
- **Incremental Updates**: Only updates changed records for efficiency  
- **New EDR Detection**: Automatically adds new EDR vendors
- **Error Handling**: Comprehensive logging and graceful error recovery
- **Webhook Security**: Optional signature verification for secure triggers
- **Platform Selection**: Update Windows, Linux, or both platforms
- **Audit Logging**: Detailed logs of all changes and operations

## 📁 Project Structure

```
cloud_function/
├── main.py              # Main webhook handler and database logic
├── requirements.txt     # Python dependencies
├── .env.yaml           # Environment variables for GCP
├── deploy.sh           # Deployment script
└── README.md           # This documentation
```

## 🛠️ Prerequisites

1. **Google Cloud Platform**:
   - GCP project with billing enabled
   - Google Cloud SDK installed and authenticated
   - Cloud Functions API enabled

2. **Supabase Database**:
   - Supabase project running (local or hosted)
   - Database schema created (from main project)
   - Service role key with admin permissions

## 📦 Installation & Setup

### 1. Configure Environment Variables

Edit `.env.yaml` with your actual credentials:

```yaml
# Supabase Configuration  
SUPABASE_URL: "https://your-project.supabase.co"  # Your Supabase URL
SUPABASE_SERVICE_ROLE_KEY: "eyJ..."               # Your service role key

# Webhook Security (recommended)
WEBHOOK_SECRET: "your-secure-random-string"       # For signature verification
```

### 2. Deploy to Google Cloud

```bash
# Make sure you're in the cloud_function directory
cd cloud_function

# Set your GCP project
gcloud config set project YOUR_PROJECT_ID

# Deploy the function
./deploy.sh
```

The deployment script will:
- Enable required GCP APIs
- Deploy the Cloud Function
- Configure environment variables
- Display the function URL and usage examples

## 🔗 Usage

### Manual Triggers

Once deployed, you can trigger updates manually:

```bash
# Update both Windows and Linux data
curl -X POST "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/edr-telemetry-updater"

# Update only Windows data
curl -X POST "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/edr-telemetry-updater?platform=windows"

# Update only Linux data  
curl -X POST "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/edr-telemetry-updater?platform=linux"
```

### Webhook Integration

#### GitHub Webhook Setup

1. Go to your EDR-Telemetry repository on GitHub
2. Navigate to Settings → Webhooks
3. Click "Add webhook"
4. Configure:
   - **Payload URL**: Your Cloud Function URL
   - **Content type**: `application/json`
   - **Secret**: Your `WEBHOOK_SECRET` (if configured)
   - **Events**: Choose "Push" or specific events
   - **Active**: ✅

#### GitHub Actions Integration

Create `.github/workflows/update-database.yml` in your repository:

```yaml
name: Update Database
on:
  push:
    branches: [main]
    paths:
      - 'EDR_telem_windows.json'
      - 'EDR_telem_linux.json'
      - 'partially_value_explanations_windows.json'

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger database update
        run: |
          curl -X POST "${{ secrets.CLOUD_FUNCTION_URL }}" \
            -H "Content-Type: application/json" \
            -d '{"source": "github_actions", "ref": "${{ github.ref }}"}'
```

## 📊 Response Format

The function returns JSON responses with detailed information:

### Success Response (200)
```json
{
  "timestamp": "2025-01-20T10:30:00Z",
  "platform": "both",
  "status": "success",
  "windows_stats": {
    "categories_added": 2,
    "categories_updated": 0,
    "scores_added": 0,
    "scores_updated": 156,
    "errors": 0
  },
  "linux_stats": {
    "categories_added": 1,
    "categories_updated": 0,
    "scores_added": 0,
    "scores_updated": 84,
    "errors": 0
  },
  "duration_seconds": 4.2,
  "errors": []
}
```

### Error Response (500)
```json
{
  "timestamp": "2025-01-20T10:30:00Z",
  "status": "failure", 
  "error": "Failed to connect to database",
  "duration_seconds": 1.5
}
```

## 🔍 Monitoring & Debugging

### View Logs
```bash
# Recent logs
gcloud functions logs read edr-telemetry-updater --region=us-central1 --limit=50

# Follow logs in real-time
gcloud functions logs tail edr-telemetry-updater --region=us-central1
```

### Function Metrics
```bash
# Get function details
gcloud functions describe edr-telemetry-updater --region=us-central1

# List all functions
gcloud functions list
```

### Common Issues

**1. Authentication Errors**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase URL format
- Ensure service role has proper permissions

**2. Network Timeouts**
- GitHub URLs may be temporarily unavailable
- Increase function timeout in deploy.sh
- Check Supabase connectivity

**3. Data Format Changes**
- Monitor logs for JSON parsing errors
- GitHub JSON structure may have changed
- Update parsing logic in main.py if needed

## 🔐 Security Considerations

1. **Environment Variables**: Never commit actual credentials to version control
2. **Webhook Security**: Use `WEBHOOK_SECRET` for signature verification
3. **Function Permissions**: Use least-privilege service accounts
4. **Network Security**: Consider VPC restrictions for production

## ⚙️ Configuration Options

### Function Settings (in deploy.sh)

```bash
TIMEOUT="300s"        # Maximum execution time
MEMORY="512MB"        # Memory allocation
MAX_INSTANCES=10      # Maximum concurrent instances
MIN_INSTANCES=0       # Minimum warm instances
```

### Platform Selection

Use the `platform` query parameter:
- `both` (default): Updates Windows and Linux
- `windows`: Updates only Windows data  
- `linux`: Updates only Linux data

## 🔄 Data Flow

1. **Webhook Trigger**: GitHub sends webhook to Cloud Function
2. **Signature Verification**: Validates webhook authenticity (if configured)
3. **Data Fetching**: Downloads latest JSON files from GitHub
4. **Database Comparison**: Compares with existing database records
5. **Incremental Updates**: Updates only changed data
6. **Logging**: Records all operations and results
7. **Response**: Returns detailed status information

## 📈 Performance Optimization

- **Cold Start**: Function may take 2-5 seconds on first call
- **Warm Instances**: Configure min instances for consistent performance
- **Batch Updates**: Uses upsert operations for efficiency
- **Connection Pooling**: Supabase client handles connection management

## 🧪 Testing

### Local Testing
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export SUPABASE_URL="your-url"
export SUPABASE_SERVICE_ROLE_KEY="your-key"

# Run locally (requires Flask)
functions-framework --target=main --debug
```

### Unit Tests
```bash
# Test with different platforms
curl -X POST "http://localhost:8080?platform=windows"
curl -X POST "http://localhost:8080?platform=linux"
curl -X POST "http://localhost:8080"  # both
```

## 🚨 Troubleshooting

If deployment fails:

1. **Check Authentication**:
   ```bash
   gcloud auth list
   gcloud config list project
   ```

2. **Enable Required APIs**:
   ```bash
   gcloud services enable cloudfunctions.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

3. **Verify Permissions**:
   - Cloud Functions Admin
   - Cloud Build Editor
   - Logs Writer

4. **Check Quotas**:
   - Cloud Functions deployments
   - Cloud Build minutes
   - Network egress

## 📞 Support

For issues related to:
- **Cloud Function**: Check GCP logs and documentation
- **Database Schema**: Refer to main project's Supabase setup
- **GitHub Integration**: Verify webhook configuration and secrets

## 🔄 Updates & Maintenance

To update the function:

1. Modify `main.py` with your changes
2. Run `./deploy.sh` to redeploy
3. Monitor logs to ensure everything works correctly

The function will automatically handle:
- New EDR vendors in the JSON files
- New telemetry categories
- Status changes for existing entries
- Explanation updates for "Partially" entries