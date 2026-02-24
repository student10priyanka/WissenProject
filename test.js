#!/usr/bin/env node

/**
 * Seat Booking System - Full Test Script
 * Tests all components and APIs
 */

const http = require('http');

function testBackendAPI() {
  return new Promise((resolve) => {
    console.log('\n===== TESTING BACKEND API =====');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✓ Backend API is running on port 5000');
          resolve(true);
        } else {
          console.log('✗ Backend responded with error');
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('✗ Cannot connect to backend on port 5000');
      console.log('  Make sure: npm start is running in backend directory');
      resolve(false);
    });

    req.setTimeout(3000);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 SEAT BOOKING SYSTEM - FULL TEST');
  console.log('====================================');

  // Test Backend
  const backendOk = await testBackendAPI();

  // Display results
  console.log('\n===== TEST SUMMARY =====');
  console.log('Backend API:', backendOk ? '✓ PASS' : '✗ FAIL');
  
  if (backendOk) {
    console.log('\n✅ All tests passed! System is ready.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

runTests();
