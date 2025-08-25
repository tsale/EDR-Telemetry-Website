"""
Google Cloud Function for EDR Telemetry Database Updates

This function handles webhook triggers to update the Supabase database
with the latest EDR telemetry data from GitHub.

Author: EDR Telemetry Project
"""

import os
import json
import logging
import hashlib
import hmac
from typing import Dict, List, Optional, Tuple
from datetime import datetime

import requests
from supabase import create_client, Client
from flask import Request

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
WINDOWS_JSON_URL = "https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json"
LINUX_JSON_URL = "https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json"
WINDOWS_EXPLANATIONS_URL = "https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/partially_value_explanations_windows.json"

# Initialize Supabase client
def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        raise ValueError("Missing Supabase configuration")
    
    return create_client(url, key)


def verify_webhook_signature(request: Request) -> bool:
    """Verify webhook signature for security"""
    webhook_secret = os.environ.get('WEBHOOK_SECRET')
    if not webhook_secret:
        # Check for explicit opt-in override for development/testing
        allow_insecure = os.environ.get('WEBHOOK_ALLOW_INSECURE')
        if allow_insecure and allow_insecure.lower() == 'true':
            logger.warning("SECURITY WARNING: Webhook signature verification disabled via WEBHOOK_ALLOW_INSECURE override")
            return True
        
        logger.error("WEBHOOK_SECRET not configured and no insecure override present - failing webhook verification")
        return False
    
    signature = request.headers.get('X-Hub-Signature-256')
    if not signature:
        logger.error("No signature provided in webhook")
        return False
    
    expected_signature = 'sha256=' + hmac.new(
        webhook_secret.encode('utf-8'),
        request.get_data(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)


def fetch_json_data(url: str) -> List[Dict]:
    """Fetch JSON data from URL with error handling"""
    try:
        logger.info(f"Fetching data from {url}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Error fetching data from {url}: {str(e)}")
        raise
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing JSON from {url}: {str(e)}")
        raise


def update_windows_data(supabase: Client) -> Dict[str, int]:
    """Update Windows telemetry data"""
    logger.info("Starting Windows data update")
    
    # Fetch latest data
    telemetry_data = fetch_json_data(WINDOWS_JSON_URL)
    explanations_data = fetch_json_data(WINDOWS_EXPLANATIONS_URL)
    
    stats = {
        'categories_added': 0,
        'categories_updated': 0,
        'scores_added': 0,
        'scores_updated': 0,
        'errors': 0
    }
    
    try:
        # Get existing categories to avoid duplicates
        existing_categories = {}
        categories_response = supabase.table('windows_telemetry').select('id,category,subcategory').execute()
        
        for cat in categories_response.data:
            key = f"{cat['category']}-{cat['subcategory']}"
            existing_categories[key] = cat['id']
        
        # Process each entry
        last_category = ''
        
        for entry in telemetry_data:
            try:
                category = entry.get('Telemetry Feature Category') or last_category
                subcategory = entry.get('Sub-Category')
                
                if category:
                    last_category = category
                
                if not category or not subcategory:
                    logger.warning(f"Skipping entry with missing category/subcategory: {entry}")
                    continue
                
                category_key = f"{category}-{subcategory}"
                
                # Insert or get telemetry category
                if category_key not in existing_categories:
                    cat_result = supabase.table('windows_telemetry').insert({
                        'category': category,
                        'subcategory': subcategory
                    }).execute()
                    
                    if cat_result.data:
                        telemetry_id = cat_result.data[0]['id']
                        existing_categories[category_key] = telemetry_id
                        stats['categories_added'] += 1
                        logger.info(f"Added new category: {category}/{subcategory}")
                    else:
                        logger.error(f"Failed to insert category: {category}/{subcategory}")
                        stats['errors'] += 1
                        continue
                else:
                    telemetry_id = existing_categories[category_key]
                
                # Update scores for each EDR
                for edr_name, status in entry.items():
                    if edr_name in ['Telemetry Feature Category', 'Sub-Category'] or status is None:
                        continue
                    
                    # Get explanation for "Partially" status
                    explanation = None
                    if status == 'Partially':
                        explanation_entry = next(
                            (exp for exp in explanations_data 
                             if exp.get('Telemetry Feature Category') == category 
                             and exp.get('Sub-Category') == subcategory), 
                            None
                        )
                        if explanation_entry and edr_name in explanation_entry and \
                           isinstance(explanation_entry[edr_name], dict) and \
                           'Partially' in explanation_entry[edr_name]:
                            explanation = explanation_entry[edr_name]['Partially']
                    
                    # Upsert score
                    score_result = supabase.table('windows_table_results').upsert({
                        'telemetry_id': telemetry_id,
                        'edr_name': edr_name,
                        'status': status,
                        'explanation': explanation
                    }, on_conflict='telemetry_id,edr_name').execute()
                    
                    if score_result.data:
                        stats['scores_updated'] += 1
                    else:
                        logger.error(f"Failed to upsert score for {edr_name}: {category}/{subcategory}")
                        stats['errors'] += 1
            
            except Exception as e:
                logger.error(f"Error processing entry {entry}: {str(e)}")
                stats['errors'] += 1
                continue
    
    except Exception as e:
        logger.error(f"Error in Windows data update: {str(e)}")
        stats['errors'] += 1
        raise
    
    logger.info(f"Windows update completed: {stats}")
    return stats


def update_linux_data(supabase: Client) -> Dict[str, int]:
    """Update Linux telemetry data"""
    logger.info("Starting Linux data update")
    
    # Fetch latest data
    telemetry_data = fetch_json_data(LINUX_JSON_URL)
    
    stats = {
        'categories_added': 0,
        'categories_updated': 0,
        'scores_added': 0,
        'scores_updated': 0,
        'errors': 0
    }
    
    try:
        # Get existing categories to avoid duplicates
        existing_categories = {}
        categories_response = supabase.table('linux_telemetry').select('id,category,subcategory').execute()
        
        for cat in categories_response.data:
            key = f"{cat['category']}-{cat['subcategory']}"
            existing_categories[key] = cat['id']
        
        # Process each entry
        last_category = ''
        
        for entry in telemetry_data:
            try:
                category = entry.get('Telemetry Feature Category') or last_category
                subcategory = entry.get('Sub-Category')
                
                if category:
                    last_category = category
                
                if not category or not subcategory:
                    logger.warning(f"Skipping entry with missing category/subcategory: {entry}")
                    continue
                
                category_key = f"{category}-{subcategory}"
                
                # Insert or get telemetry category
                if category_key not in existing_categories:
                    cat_result = supabase.table('linux_telemetry').insert({
                        'category': category,
                        'subcategory': subcategory
                    }).execute()
                    
                    if cat_result.data:
                        telemetry_id = cat_result.data[0]['id']
                        existing_categories[category_key] = telemetry_id
                        stats['categories_added'] += 1
                        logger.info(f"Added new Linux category: {category}/{subcategory}")
                    else:
                        logger.error(f"Failed to insert Linux category: {category}/{subcategory}")
                        stats['errors'] += 1
                        continue
                else:
                    telemetry_id = existing_categories[category_key]
                
                # Update scores for each EDR
                for edr_name, status in entry.items():
                    if edr_name in ['Telemetry Feature Category', 'Sub-Category'] or status is None:
                        continue
                    
                    # Upsert score (Linux doesn't have explanations currently)
                    score_result = supabase.table('linux_table_results').upsert({
                        'telemetry_id': telemetry_id,
                        'edr_name': edr_name,
                        'status': status,
                        'explanation': None
                    }, on_conflict='telemetry_id,edr_name').execute()
                    
                    if score_result.data:
                        stats['scores_updated'] += 1
                    else:
                        logger.error(f"Failed to upsert Linux score for {edr_name}: {category}/{subcategory}")
                        stats['errors'] += 1
            
            except Exception as e:
                logger.error(f"Error processing Linux entry {entry}: {str(e)}")
                stats['errors'] += 1
                continue
    
    except Exception as e:
        logger.error(f"Error in Linux data update: {str(e)}")
        stats['errors'] += 1
        raise
    
    logger.info(f"Linux update completed: {stats}")
    return stats


def update_telemetry_data(request: Request) -> Tuple[Dict, int]:
    """
    Main function for Google Cloud Function
    
    Args:
        request: Flask request object
        
    Returns:
        Tuple of (response_dict, status_code)
    """
    start_time = datetime.now()
    
    try:
        # Verify webhook signature
        if not verify_webhook_signature(request):
            return {'error': 'Invalid signature'}, 401
        
        # Parse request data
        request_json = request.get_json(silent=True)
        platform = request.args.get('platform', 'both')
        
        logger.info(f"Processing update request for platform: {platform}")
        
        # Initialize Supabase client
        supabase = get_supabase_client()
        
        results = {
            'timestamp': start_time.isoformat(),
            'platform': platform,
            'status': 'success',
            'windows_stats': None,
            'linux_stats': None,
            'duration_seconds': None,
            'errors': []
        }
        
        # Update data based on platform parameter
        if platform in ['windows', 'both']:
            try:
                results['windows_stats'] = update_windows_data(supabase)
            except Exception as e:
                error_msg = f"Windows update failed: {str(e)}"
                logger.error(error_msg)
                results['errors'].append(error_msg)
                results['status'] = 'partial_failure'
        
        if platform in ['linux', 'both']:
            try:
                results['linux_stats'] = update_linux_data(supabase)
            except Exception as e:
                error_msg = f"Linux update failed: {str(e)}"
                logger.error(error_msg)
                results['errors'].append(error_msg)
                results['status'] = 'partial_failure'
        
        # Calculate duration
        end_time = datetime.now()
        results['duration_seconds'] = (end_time - start_time).total_seconds()
        
        # Determine final status
        if results['errors']:
            if results['windows_stats'] or results['linux_stats']:
                results['status'] = 'partial_success'
                status_code = 200
            else:
                results['status'] = 'failure'
                status_code = 500
        else:
            results['status'] = 'success'
            status_code = 200
        
        logger.info(f"Update completed with status: {results['status']}")
        return results, status_code
    
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg)
        
        end_time = datetime.now()
        return {
            'timestamp': start_time.isoformat(),
            'status': 'failure',
            'error': error_msg,
            'duration_seconds': (end_time - start_time).total_seconds()
        }, 500


# Entry point for Google Cloud Functions
def main(request: Request):
    """Cloud Function entry point"""
    response_data, status_code = update_telemetry_data(request)
    return response_data, status_code