#!/usr/bin/env python3
"""
Local testing script for the EDR Telemetry Cloud Function

This script simulates webhook requests for testing the function locally
before deploying to Google Cloud Platform.

Usage:
    python test_local.py [platform]
    
Arguments:
    platform: windows, linux, or both (default: both)
"""

import json
import os
import sys
from unittest.mock import Mock
from main import update_telemetry_data


def create_mock_request(platform='both', webhook_data=None):
    """Create a mock Flask request object"""
    request = Mock()
    
    # Mock query arguments
    request.args = Mock()
    request.args.get = lambda key, default=None: platform if key == 'platform' else default
    
    # Mock JSON data
    if webhook_data is None:
        webhook_data = {
            'source': 'local_test',
            'timestamp': '2025-01-20T10:30:00Z'
        }
    
    request.get_json = Mock(return_value=webhook_data)
    
    # Mock headers and data for webhook verification
    request.headers = Mock()
    request.headers.get = Mock(return_value=None)  # No signature for local testing
    request.get_data = Mock(return_value=json.dumps(webhook_data).encode('utf-8'))
    
    return request


def test_function(platform='both'):
    """Test the function with the specified platform"""
    print(f"🧪 Testing EDR Telemetry updater with platform: {platform}")
    print("=" * 50)
    
    # Create mock request
    request = create_mock_request(platform)
    
    try:
        # Call the function
        response_data, status_code = update_telemetry_data(request)
        
        # Display results
        print(f"📊 Status Code: {status_code}")
        print(f"📄 Response:")
        print(json.dumps(response_data, indent=2))
        
        if status_code == 200:
            print("✅ Test completed successfully!")
            
            # Display statistics
            if response_data.get('windows_stats'):
                ws = response_data['windows_stats']
                print(f"\n📈 Windows Stats:")
                print(f"   Categories added: {ws.get('categories_added', 0)}")
                print(f"   Scores updated: {ws.get('scores_updated', 0)}")
                print(f"   Errors: {ws.get('errors', 0)}")
            
            if response_data.get('linux_stats'):
                ls = response_data['linux_stats']
                print(f"\n📈 Linux Stats:")
                print(f"   Categories added: {ls.get('categories_added', 0)}")
                print(f"   Scores updated: {ls.get('scores_updated', 0)}")
                print(f"   Errors: {ls.get('errors', 0)}")
                
            print(f"\n⏱️ Duration: {response_data.get('duration_seconds', 0):.2f} seconds")
        else:
            print("❌ Test failed!")
            
    except Exception as e:
        print(f"💥 Test failed with exception: {str(e)}")
        return False
    
    return status_code == 200


def main():
    """Main function for command-line usage"""
    # Get platform from command line argument
    platform = sys.argv[1] if len(sys.argv) > 1 else 'both'
    
    if platform not in ['windows', 'linux', 'both']:
        print("❌ Invalid platform. Use: windows, linux, or both")
        sys.exit(1)
    
    # Check environment variables
    required_vars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set them before running the test:")
        print("export SUPABASE_URL='your-url'")
        print("export SUPABASE_SERVICE_ROLE_KEY='your-key'")
        sys.exit(1)
    
    print("🔧 Environment variables:")
    print(f"   SUPABASE_URL: {os.environ.get('SUPABASE_URL', 'Not set')}")
    print(f"   SERVICE_ROLE_KEY: {'Set' if os.environ.get('SUPABASE_SERVICE_ROLE_KEY') else 'Not set'}")
    print(f"   WEBHOOK_SECRET: {'Set' if os.environ.get('WEBHOOK_SECRET') else 'Not set (optional)'}")
    print()
    
    # Run the test
    success = test_function(platform)
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n💥 Tests failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()