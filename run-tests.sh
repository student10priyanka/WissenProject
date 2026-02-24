#!/bin/bash
# Seat Booking System - Final Testing Commands
# Run these commands to verify everything works

echo "🚀 SEAT BOOKING SYSTEM - FINAL TEST COMMANDS"
echo "=============================================="
echo ""

# Test 1: Backend Dependencies
echo "TEST 1: Checking Backend Dependencies..."
cd backend
npm list cors > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Backend dependencies installed"
else
  echo "✗ Installing missing dependencies..."
  npm install cors
fi
echo ""

# Test 2: Backend Startup
echo "TEST 2: Testing Backend Server..."
echo "Starting backend on port 5000 (will run for 3 seconds)..."
timeout 3 npm start > /tmp/backend.log 2>&1
if grep -q "Server running" /tmp/backend.log; then
  echo "✓ Backend server starts successfully"
else
  echo "✗ Backend server failed to start"
  cat /tmp/backend.log
fi
echo ""

# Test 3: Frontend Dependencies
echo "TEST 3: Checking Frontend Dependencies..."
cd ../frontend
npm list react > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Frontend dependencies installed"
else
  echo "✗ Installing frontend dependencies..."
  npm install
fi
echo ""

# Test 4: File Structure
echo "TEST 4: Verifying Project Structure..."
cd ..
FILES=(
  "backend/server.js"
  "backend/package.json"
  "backend/models/Seat.js"
  "backend/models/Employee.js"
  "backend/models/Booking.js"
  "backend/controllers/bookingController.js"
  "frontend/src/App.js"
  "frontend/package.json"
  "DOCUMENTATION.md"
  "README.md"
)

count=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    ((count++))
  fi
done

echo "✓ Found $count/$((${#FILES[@]})) required files"
echo ""

# Test 5: Documentation
echo "TEST 5: Checking Documentation..."
if [ -f "DOCUMENTATION.md" ] && [ -f "TECHNICAL_FLOW.md" ] && [ -f "PPT_OUTLINE.md" ]; then
  echo "✓ All documentation files present"
else
  echo "✗ Some documentation files missing"
fi
echo ""

echo "=============================================="
echo "✅ TEST COMPLETE"
echo ""
echo "Next steps:"
echo "1. Terminal 1: cd backend && npm start"
echo "2. Terminal 2: cd frontend && npm start"
echo "3. Open browser: http://localhost:3000"
echo ""
