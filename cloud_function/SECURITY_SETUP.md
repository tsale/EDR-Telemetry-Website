# 🔐 Security Setup Guide

This guide shows how to securely configure GitHub webhooks and secrets for the EDR Telemetry database updater.

## 📋 Overview

To securely trigger your Cloud Function from GitHub, you'll need:
1. **Webhook Secret**: For HMAC signature verification
2. **GitHub Repository Secrets**: To store sensitive URLs and keys
3. **Proper GitHub Actions Configuration**: Using encrypted secrets

## 🔧 Step-by-Step Setup

### Step 1: Generate a Webhook Secret

Choose one of these methods to generate a secure webhook secret:

```bash
# Method 1: Using OpenSSL
openssl rand -hex 32

# Method 2: Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"

# Method 3: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 4: Online generator (use reputable sites only)
# https://www.uuidgenerator.net/
```

**Example output**: `287998f9331f4971b55c94175ea2f980a1b2c3d4e5f6...`

### Step 2: Configure GitHub Repository Secrets

1. **Navigate to your repository settings**:
   ```
   GitHub Repository → Settings → Secrets and variables → Actions
   ```

2. **Add the following secrets**:

   | Secret Name | Value | Description |
   |-------------|-------|-------------|
   | `CLOUD_FUNCTION_URL` | `https://us-central1-your-project.cloudfunctions.net/edr-telemetry-updater` | Your deployed Cloud Function URL |
   | `WEBHOOK_SECRET` | `your-generated-secret-from-step-1` | Webhook authentication secret |

3. **Click "New repository secret" for each**:
   - Name: `CLOUD_FUNCTION_URL`
   - Secret: Your actual Cloud Function URL
   - Click "Add secret"

   - Name: `WEBHOOK_SECRET`  
   - Secret: Your generated webhook secret
   - Click "Add secret"

### Step 3: Update Cloud Function Environment

Make sure your Cloud Function's `.env.yaml` has the same webhook secret:

```yaml
# cloud_function/.env.yaml
SUPABASE_URL: "https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key"
WEBHOOK_SECRET: "287998f9331f4971b55c94175ea2f980a1b2c3d4e5f6..."  # Same as GitHub secret
```

### Step 4: Deploy Updated Cloud Function

```bash
cd cloud_function
./deploy.sh
```

### Step 5: Create Secure GitHub Actions Workflow

Copy the secure workflow to your EDR-Telemetry repository:

```bash
# In your EDR-Telemetry repository
mkdir -p .github/workflows
cp github-actions-secure.yml .github/workflows/update-database.yml
```

## 🔍 How the Security Works

### 1. **HMAC Signature Verification**

The workflow generates an HMAC-SHA256 signature:

```bash
# GitHub Actions generates this signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET")
```

The Cloud Function verifies it:

```python
# Cloud Function verifies the signature
expected_signature = 'sha256=' + hmac.new(
    webhook_secret.encode('utf-8'),
    request.get_data(),
    hashlib.sha256
).hexdigest()

return hmac.compare_digest(signature, expected_signature)
```

### 2. **GitHub Secrets Protection**

- ✅ **Encrypted at rest**: GitHub encrypts all secrets
- ✅ **Masked in logs**: Secrets never appear in workflow logs
- ✅ **Limited scope**: Only accessible within the repository
- ✅ **Audit trail**: All secret access is logged

### 3. **Request Headers**

The secure workflow sends these headers:

```http
Content-Type: application/json
X-GitHub-Event: push
X-Hub-Signature-256: sha256=abc123...
```

## 🧪 Testing the Secure Setup

### Test 1: Manual Workflow Trigger

1. Go to your repository → **Actions** → **Update EDR Telemetry Database (Secure)**
2. Click **Run workflow**
3. Select platform (windows/linux/both)
4. Click **Run workflow**

### Test 2: Automatic Trigger

1. Make a change to `EDR_telem_windows.json` or `EDR_telem_linux.json`
2. Commit and push to main branch
3. Check **Actions** tab for automatic workflow run

### Test 3: Local Verification

Test the signature generation locally:

```bash
# Set your webhook secret
export WEBHOOK_SECRET="your-webhook-secret-here"

# Create test payload
PAYLOAD='{"test": "data"}'

# Generate signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | sed 's/^.* //')

# Test with curl
curl -X POST "https://your-function-url" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

## 🚨 Security Best Practices

### ✅ Do's

- **Use unique secrets**: Generate a new webhook secret for each repository
- **Rotate secrets regularly**: Update webhook secrets every 3-6 months
- **Monitor access**: Review GitHub audit logs for secret access
- **Use least privilege**: Only grant necessary permissions to secrets
- **Validate signatures**: Always verify webhook signatures in your Cloud Function

### ❌ Don'ts

- **Don't hardcode secrets**: Never put secrets directly in code or workflow files
- **Don't log secrets**: Avoid logging request payloads that might contain secrets
- **Don't share secrets**: Each repository should have its own webhook secret
- **Don't use weak secrets**: Use cryptographically secure random generation
- **Don't skip verification**: Always verify signatures even if inconvenient

## 🔧 Troubleshooting

### Issue: "Invalid signature" (401 error)

**Causes**:
- Webhook secret mismatch between GitHub and Cloud Function
- Signature generation error
- Character encoding issues

**Solutions**:
```bash
# 1. Verify secrets match exactly
# Safer: derive and compare HMACs of a known payload; print only HMACs
TEST_PAYLOAD='{"ping":true}'
GH_HMAC=$(printf '%s' "$TEST_PAYLOAD" | openssl dgst -sha256 -hmac "${{ secrets.WEBHOOK_SECRET }}" -binary | xxd -p -c 256)
CF_HMAC=$(printf '%s' "$TEST_PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 256)
echo "Derived HMACs match? $([ "$GH_HMAC" = "$CF_HMAC" ] && echo yes || echo no)"
# 2. Regenerate webhook secret
openssl rand -hex 32

# 3. Update both GitHub secret AND Cloud Function .env.yaml
# 4. Redeploy Cloud Function
```

### Issue: "WEBHOOK_SECRET not found"

**Cause**: Secret not configured in GitHub repository

**Solution**:
1. Go to repository Settings → Secrets and variables → Actions
2. Verify `WEBHOOK_SECRET` exists
3. If missing, add it with your webhook secret value

### Issue: Workflow runs but function returns 500

**Causes**:
- Supabase connection issues
- Database schema mismatch  
- Network connectivity problems

**Solutions**:
```bash
# Check Cloud Function logs
gcloud functions logs read edr-telemetry-updater --region=us-central1 --limit=50

# Test function directly
curl -X POST "your-function-url" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📊 Security Monitoring

### Monitor These Metrics

1. **Failed Authentication Attempts**:
   ```bash
   gcloud functions logs read edr-telemetry-updater \
     --filter="textPayload:Invalid signature" \
     --limit=100
   ```

2. **Successful Updates**:
   ```bash
   gcloud functions logs read edr-telemetry-updater \
     --filter="textPayload:success" \
     --limit=50
   ```

3. **GitHub Actions Status**:
   - Repository → Actions → Workflow runs
   - Look for failed runs or unusual patterns

### Set Up Alerts (Optional)

```bash
# Create alert policy for function errors
gcloud alpha monitoring policies create \
  --policy-from-file=function-error-policy.yaml
```

## 🔄 Secret Rotation Process

### Monthly/Quarterly Rotation

1. **Generate new webhook secret**:
   ```bash
   NEW_SECRET=$(openssl rand -hex 32)
   echo "New secret: $NEW_SECRET"
   ```

2. **Update GitHub repository secret**:
   - Settings → Secrets → Edit `WEBHOOK_SECRET`
   - Enter new secret value

3. **Update Cloud Function**:
   ```bash
   # Update .env.yaml
   sed -i 's/WEBHOOK_SECRET: ".*"/WEBHOOK_SECRET: "'$NEW_SECRET'"/' .env.yaml
   
   # Redeploy
   ./deploy.sh
   ```

4. **Test the rotation**:
   - Trigger manual workflow run
   - Verify successful authentication
   - Monitor logs for issues

## 📞 Support

If you encounter issues:

1. **Check GitHub Actions logs** in your repository's Actions tab
2. **Review Cloud Function logs** using `gcloud functions logs read`
3. **Verify all secrets** are correctly configured
4. **Test signature generation** locally using the examples above

For additional security questions, refer to:
- [GitHub Actions Security Guide](https://docs.github.com/en/actions/security-guides)
- [Google Cloud Function Security](https://cloud.google.com/functions/docs/securing)
- [OWASP Webhook Security](https://owasp.org/www-project-web-security-testing-guide/)