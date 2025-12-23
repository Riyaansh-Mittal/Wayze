/**
 * Fetch-based API Client
 * More reliable than axios on React Native Android
 */

import { Platform } from 'react-native';
import { BASE_URL } from '../../config/api.config';
import SecureStorage from '../storage/SecureStorage';
import { APIError } from '../../utils/error.handler';

class FetchClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.timeout = 30000;
  }

  /**
   * Make HTTP request using native fetch
   */
  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🚀 Fetch Request:', {
      method,
      url,
      platform: Platform.OS,
      data,
    });

    try {
      // Get auth token
      const token = await SecureStorage.getAuthToken();

      // Build headers
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Build request options
      const requestOptions = {
        method,
        headers,
      };

      // Add body for POST/PUT/PATCH
      if (data && method !== 'GET' && method !== 'HEAD') {
        requestOptions.body = JSON.stringify(data);
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        // Make request
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response
        const responseText = await response.text();
        let responseData;

        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          responseData = { message: responseText };
        }

        console.log('✅ Fetch Response:', {
          status: response.status,
          ok: response.ok,
          url,
          data: responseData,
        });

        // Handle non-2xx responses
        if (!response.ok) {
          throw new APIError(
            responseData?.message || responseData?.error || `HTTP ${response.status}`,
            response.status,
            responseData
          );
        }

        return responseData;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new APIError('Request timeout. Please try again.', 408);
        }

        throw error;
      }
    } catch (error) {
      console.error('❌ Fetch Error:', {
        message: error.message,
        url,
        method,
      });

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        'Network connection failed. Please check your internet and try again.',
        0,
        { originalError: error.message }
      );
    }
  }

  // Convenience methods
  get(endpoint, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request('GET', url, null, options);
  }

  post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }
}

export default new FetchClient(BASE_URL);
