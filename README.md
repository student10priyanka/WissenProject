# 🪑 Intelligent Seat Booking System

A comprehensive office space management solution designed to maximize seat utilization with smart batch scheduling and flexible allocation.

## ✨ Key Features

- **50 Total Seats**: 40 designated + 10 floater seats
- **10 Teams**: 8 members each capacity
- **Smart Batch Schedule**: 2-week rotating schedule for 2 batches
- **Real-time Dashboard**: Live occupancy statistics
- **Flexible Booking**: Designated and non-designated day options
- **Admin Panel**: Team and employee management
- **Responsive UI**: Works on desktop, tablet, and mobile

## 🎯 System Specifications

### Seating Structure
- **Total**: 50 seats
- **Designated**: 40 seats (Batch allocation)
- **Floaters**: 10 seats (Flexible use)
- **Daily Capacity**: 40 employees max

### Batch Schedule (2 Weeks)
| Batch | Week 1 | Week 2 |
|-------|--------|--------|
| Batch 1 | Mon, Tue, Wed | Thu, Fri |
| Batch 2 | Thu, Fri | Mon, Tue, Wed |

### Booking Rules
✓ **Designated Day**: Full access to assigned seats (9 AM - 6 PM)
✓ **Non-Designated Day**: Floater seats only (3 PM - 6 PM)
✓ **Weekends/Holidays**: No bookings allowed
✓ **One Booking Per Day**: Per employee
✓ **Week-wise Allocation**: Organized by batch schedule

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Architecture**: RESTful API

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: React Icons
- **Styling**: CSS3

### Tools & Services
- **Package Manager**: npm
- **VCS**: Git
- **Version Control**: GitHub
- **Environment**: `.env` configuration

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- Git

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/seat-booking" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start server
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

### MongoDB Setup
```bash
# Using MongoDB Community
mongod --dbpath /path/to/data

# Or use MongoDB Atlas (Cloud)
# Update MONGO_URI in .env with connection string
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Booking API
```
POST   /bookings/book                 - Create booking
GET    /bookings/available            - Get available seats
POST   /bookings/cancel/:id           - Cancel booking
GET    /bookings/employee/:id         - Get user bookings
GET    /bookings/stats                - Dashboard stats
```

### Employee API
```
GET    /employees                     - List all
POST   /employees                     - Create new
GET    /employees/:id                 - Get details
PUT    /employees/:id                 - Update
DELETE /employees/:id                 - Delete
```

### Team API
```
GET    /teams                         - List all
POST   /teams                         - Create new
GET    /teams/:id                     - Get details
PUT    /teams/:id                     - Update
DELETE /teams/:id                     - Delete
```

### Seat API
```
GET    /seats                         - List all seats
GET    /seats/:id                     - Get seat details
PUT    /seats/:id                     - Update seat status
```

## 🖥️ User Interface

### Pages

1. **Dashboard**
   - System statistics and KPIs
   - Visual seat grid (1-50)
   - Date-wise occupancy
   - Batch information

2. **Book Seat**
   - Employee selection
   - Date & time picker
   - Available seat grid
   - Real-time validation
   - Booking confirmation

3. **My Bookings**
   - View active bookings
   - Booking details
   - Cancel functionality
   - Historical view

4. **Admin Panel**
   - Employee management
   - Team management
   - CRUD operations
   - Batch assignment

## 📊 Database Schema

### Collections

```json
Employee
{
  _id: ObjectId,
  name: String,
  email: String,
  batch: "Batch1" | "Batch2",
  teamId: ObjectId (ref: Team),
  isActive: Boolean,
  createdAt: Date
}

Seat
{
  _id: ObjectId,
  seatNumber: Number (1-50),
  isFloater: Boolean,
  isBooked: Boolean,
  bookedBy: ObjectId | null,
  batch: String | null
}

Booking
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee),
  seatId: ObjectId (ref: Seat),
  bookingDate: String,
  bookingTime: String,
  isDesignatedDay: Boolean,
  status: "active" | "cancelled" | "completed",
  createdAt: Date,
  cancelledAt: Date | null
}

Team
{
  _id: ObjectId,
  name: String,
  squadNumber: Number (1-10),
  memberCount: Number,
  createdAt: Date
}
```

## 🚀 Deployment

### Deploy to GitHub

1. **Initialize Git**
```bash
cd /path/to/seat-booking-app
git init
git add .
git commit -m "Initial commit: Seat booking system"
```

2. **Create GitHub Repository**
   - Go to github.com
   - Create new repository: `seat-booking-app`
   - Note the repository URL

3. **Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/seat-booking-app.git
git branch -M main
git push -u origin main
```

4. **Deploy Frontend** (Example: Vercel)
```bash
npm install -g vercel
cd frontend
vercel
```

5. **Deploy Backend** (Example: Railway/Heroku)
   - Connect your GitHub repo
   - Set environment variables
   - Deploy!

## 📋 Project Structure

```
seat-booking-app/
├── backend/
│   ├── models/
│   │   ├── Employee.js
│   │   ├── Seat.js
│   │   ├── Booking.js
│   │   ├── Team.js
│   │   └── SeatAllocation.js
│   ├── controllers/
│   │   ├── bookingController.js
│   │   ├── employeeController.js
│   │   ├── seatController.js
│   │   └── teamController.js
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── seatRoutes.js
│   │   └── teamRoutes.js
│   ├── utils/
│   │   └── dateUtils.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── SeatGrid.js
│   │   │   ├── StatsCard.js
│   │   │   ├── EmployeeManager.js
│   │   │   └── TeamManager.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── BookingSeat.js
│   │   │   ├── MyBookings.js
│   │   │   └── AdminPanel.js
│   │   ├── styles/
│   │   │   ├── Navbar.css
│   │   │   ├── Dashboard.css
│   │   │   ├── BookingSeat.css
│   │   │   ├── StatsCard.css
│   │   │   ├── SeatGrid.css
│   │   │   ├── MyBookings.css
│   │   │   ├── EmployeeManager.css
│   │   │   ├── AdminPanel.css
│   │   │   └── TeamManager.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── DOCUMENTATION.md
├── TECHNICAL_FLOW.md
├── README.md
└── .gitignore
```

## 🔧 Configuration

### Environment Variables (Backend)

```env
# .env file
MONGO_URI=mongodb://localhost:27017/seat-booking
PORT=5000
NODE_ENV=development
```

### CORS Configuration
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create employees and teams
- [ ] Book seats on designated days
- [ ] Book floater seats on non-designated days
- [ ] Verify time restrictions (3 PM)
- [ ] Cancel bookings
- [ ] View dashboard statistics
- [ ] Check responsive design

### Test Data
```javascript
// Sample team data (auto-initialized)
- 10 Squads with 8 members each

// Sample employees can be added via admin panel
- Batch 1 & Batch 2 employees
- Multiple teams
```

## 📱 UI Features

- **Modern Design**: Purple gradient theme
- **Responsive**: Mobile-first approach
- **Real-time Updates**: Instant feedback
- **Visual Indicators**: Color-coded seats
- **Intuitive Navigation**: Clean menu structure
- **Form Validation**: Client-side validation
- **Error Handling**: User-friendly messages

## 🔐 Security Considerations

- Input validation on backend
- CORS configuration
- Environment variables for secrets
- MongoDB connection string security
- Error message sanitization

## 🐛 Debugging

### Backend Logs
```bash
# Check server logs for errors
npm start

# Enable debug mode
DEBUG=* npm start
```

### Browser DevTools
```javascript
// Check network requests
// Monitor console for errors
// Use Redux DevTools for state
```

### MongoDB
```bash
# Connect to MongoDB
mongo seed-booking

# Query collections
db.Employees.find()
db.Bookings.find()
```

## 📄 Documentation

- **DOCUMENTATION.md**: Complete system documentation
- **TECHNICAL_FLOW.md**: Architecture and flow diagrams
- **README.md**: This file (Project overview)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/name`
5. Submit pull request

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review API responses
3. Check MongoDB connection
4. Verify environment variables
5. Check CORS configuration

## 📄 License

MIT License - Open for educational and commercial use

## 👨‍💻 Author

Your Name / Organization
Created: February 24, 2026
Version: 1.0.0

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/seat-booking-app.git
cd seat-booking-app

# Install and run backend
cd backend && npm install && npm start

# In another terminal, install and run frontend
cd frontend && npm install && npm start

# Open browser
http://localhost:3000
```

---

**Happy Booking! 🎉**
