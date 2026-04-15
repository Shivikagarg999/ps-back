# Admin Booking APIs - Complete Documentation

## Overview
Admin Booking APIs allow admins to create, view, update, and delete manual booking records. These are used for tracking beautician services, commissions, and payments from a business perspective.

---

## Admin Booking Model

### Fields
```javascript
{
  _id: ObjectId,
  bookingId: String (unique, required),     // e.g., "PS-2026-0032"
  name: String,                             // Customer name
  phoneNumber: String,                      // Customer phone
  address: String,                          // Service address
  type: String,                             // "commission" or "fixed"
  bookingDate: String,                      // Format: "04-01-26"
  serviceDate: String,                      // Format: "04-01-26"
  serviceTimeSlot: String,                  // Format: "2 pm - 4 pm"
  services: String,                         // Description of services
  beautician: String,                       // Beautician name
  status: String,                           // "Pending", "Confirmed", "Completed", etc.
  amount: Number,                           // Total booking amount
  beauticianPayout: Number|String|null,     // Commission amount or "N/A"
  companyAmount: Number,                    // Company earnings
  paymentMode: String,                      // "UPI", "COD", "Cash", "Card", "Online"
  paymentStatus: String,                    // "Paid", "Pending", "Failed"
  remarks: String,                          // Optional notes
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## API Endpoints

### 1. CREATE Admin Booking

**Route**: `POST /api/admin-bookings`

**Request Body**:
```json
{
  "bookingId": "PS-2026-0032",
  "name": "Kanika",
  "phoneNumber": "9289214121",
  "address": "Ace divino T10, 002 noida",
  "type": "commission",
  "bookingDate": "04-01-26",
  "serviceDate": "04-01-26",
  "serviceTimeSlot": "2 pm - 4 pm",
  "services": "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…",
  "beautician": "Deepika",
  "status": "Completed",
  "amount": 649,
  "beauticianPayout": 340,
  "companyAmount": 309,
  "paymentMode": "UPI",
  "paymentStatus": "Paid",
  "remarks": ""
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "_id": "69dfd9229d294a16c1b575e9",
    "bookingId": "PS-2026-0032",
    "name": "Kanika",
    "phoneNumber": "9289214121",
    "address": "Ace divino T10, 002 noida",
    "type": "commission",
    "bookingDate": "04-01-26",
    "serviceDate": "04-01-26",
    "serviceTimeSlot": "2 pm - 4 pm",
    "services": "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…",
    "beautician": "Deepika",
    "status": "Completed",
    "amount": 649,
    "beauticianPayout": 340,
    "companyAmount": 309,
    "paymentMode": "UPI",
    "paymentStatus": "Paid",
    "remarks": "",
    "createdAt": "2026-04-16T10:30:00.000Z",
    "updatedAt": "2026-04-16T10:30:00.000Z"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "bookingId, type, and amount are required"
}
```

**Status**: ✅ Implemented

---

### 2. GET All Admin Bookings

**Route**: `GET /api/admin-bookings`

**Query Parameters** (all optional):
- `status` - Filter by booking status (Pending, Confirmed, Completed, Cancelled, Rescheduled, In progress)
- `paymentStatus` - Filter by payment status (Paid, Pending, Failed)
- `type` - Filter by booking type (commission, fixed)
- `from` - Start date filter (format: "04-01-26")
- `to` - End date filter (format: "04-01-26")

**Example URL**:
```
GET /api/admin-bookings?status=Completed&type=commission&paymentStatus=Paid
```

**Response (200)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "69dfd9229d294a16c1b575e9",
      "bookingId": "PS-2026-0032",
      "name": "Kanika",
      "phoneNumber": "9289214121",
      "address": "Ace divino T10, 002 noida",
      "type": "commission",
      "bookingDate": "04-01-26",
      "serviceDate": "04-01-26",
      "serviceTimeSlot": "2 pm - 4 pm",
      "services": "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…",
      "beautician": "Deepika",
      "status": "Completed",
      "amount": 649,
      "beauticianPayout": 340,
      "companyAmount": 309,
      "paymentMode": "UPI",
      "paymentStatus": "Paid",
      "remarks": "",
      "createdAt": "2026-04-16T10:30:00.000Z",
      "updatedAt": "2026-04-16T10:30:00.000Z"
    },
    {
      "_id": "69dfd9229d294a16c1b575ea",
      "bookingId": "PS-2026-0033",
      "name": "Sakshi",
      "phoneNumber": "9287654321",
      "address": "Laxmi Nagar",
      "type": "fixed",
      "bookingDate": "04-01-26",
      "serviceDate": "04-01-26",
      "serviceTimeSlot": "2:30 pm - 4:30 pm",
      "services": "Full body wax",
      "beautician": "Sakshi",
      "status": "Completed",
      "amount": 999,
      "beauticianPayout": null,
      "companyAmount": 999,
      "paymentMode": "UPI",
      "paymentStatus": "Paid",
      "remarks": "",
      "createdAt": "2026-04-16T11:00:00.000Z",
      "updatedAt": "2026-04-16T11:00:00.000Z"
    }
  ]
}
```

**Status**: ✅ Implemented

---

### 3. GET Admin Booking by ID

**Route**: `GET /api/admin-bookings/:id`

**Parameters**:
- `id` - MongoDB ObjectId OR bookingId (e.g., "PS-2026-0032")

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "69dfd9229d294a16c1b575e9",
    "bookingId": "PS-2026-0032",
    "name": "Kanika",
    "phoneNumber": "9289214121",
    "address": "Ace divino T10, 002 noida",
    "type": "commission",
    "bookingDate": "04-01-26",
    "serviceDate": "04-01-26",
    "serviceTimeSlot": "2 pm - 4 pm",
    "services": "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…",
    "beautician": "Deepika",
    "status": "Completed",
    "amount": 649,
    "beauticianPayout": 340,
    "companyAmount": 309,
    "paymentMode": "UPI",
    "paymentStatus": "Paid",
    "remarks": "",
    "createdAt": "2026-04-16T10:30:00.000Z",
    "updatedAt": "2026-04-16T10:30:00.000Z"
  }
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Booking not found"
}
```

**Status**: ✅ Implemented

---

### 4. UPDATE Admin Booking

**Route**: `PUT /api/admin-bookings/:id`

**Parameters**:
- `id` - MongoDB ObjectId OR bookingId

**Request Body** (all fields optional):
```json
{
  "status": "In progress",
  "beauticianPayout": 350,
  "paymentStatus": "Paid",
  "remarks": "Updated booking status"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "69dfd9229d294a16c1b575e9",
    "bookingId": "PS-2026-0032",
    "name": "Kanika",
    "phoneNumber": "9289214121",
    "address": "Ace divino T10, 002 noida",
    "type": "commission",
    "bookingDate": "04-01-26",
    "serviceDate": "04-01-26",
    "serviceTimeSlot": "2 pm - 4 pm",
    "services": "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…",
    "beautician": "Deepika",
    "status": "In progress",
    "amount": 649,
    "beauticianPayout": 350,
    "companyAmount": 309,
    "paymentMode": "UPI",
    "paymentStatus": "Paid",
    "remarks": "Updated booking status",
    "createdAt": "2026-04-16T10:30:00.000Z",
    "updatedAt": "2026-04-16T11:45:00.000Z"
  }
}
```

**Status**: ✅ Implemented

---

### 5. DELETE Admin Booking

**Route**: `DELETE /api/admin-bookings/:id`

**Parameters**:
- `id` - MongoDB ObjectId OR bookingId

**Response (200)**:
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Booking not found"
}
```

**Status**: ✅ Implemented

---

### 6. IMPORT Admin Bookings (CSV/TSV)

**Route**: `POST /api/admin-bookings/import`

**Request Type**: `multipart/form-data`

**Form Fields**:
- `file` - CSV or TSV file containing booking records

**CSV/TSV Headers** (case-insensitive):
```
booking id, name, phone number, address, type, booking date, service date, service time slot, services, beautician, status, amount, beautician payout, company amount, payment mode, payment status, remarks
```

**CSV Example**:
```
booking id,name,phone number,address,type,booking date,service date,service time slot,services,beautician,status,amount,beautician payout,company amount,payment mode,payment status,remarks
PS-2026-0032,Kanika,9289214121,"Ace divino T10, 002 noida",commission,04-01-26,04-01-26,2 pm - 4 pm,"Honey wax, threading",Deepika,Completed,649,340,309,UPI,Paid,
PS-2026-0033,Sakshi,9287654321,Laxmi Nagar,fixed,04-01-26,04-01-26,"2:30 pm - 4:30 pm",Full body wax,Sakshi,Completed,999,N/A,999,UPI,Paid,
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Import complete — 10 created, 5 updated, 2 skipped",
  "created": 10,
  "updated": 5,
  "skipped": 2,
  "errors": [
    "Row PS-2026-0050: Duplicate entry"
  ]
}
```

**Status**: ✅ Implemented

---

### 7. GET Admin Booking Stats

**Route**: `GET /api/admin-bookings/stats`

**Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalBookings": 150,
    "completedBookings": 120,
    "pendingBookings": 20,
    "cancelledBookings": 10,
    "totalRevenue": 85000,
    "totalBeauticianPayout": 42500,
    "totalCompanyAmount": 42500,
    "commission_bookings": 75,
    "fixed_bookings": 75,
    "paidBookings": 140,
    "pendingPayments": 10
  }
}
```

**Status**: ✅ Implemented

---

## cURL Examples

### Create Booking
```bash
curl -X POST "http://localhost:5000/api/admin-bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "PS-2026-0032",
    "name": "Kanika",
    "phoneNumber": "9289214121",
    "address": "Ace divino T10, 002 noida",
    "type": "commission",
    "bookingDate": "04-01-26",
    "serviceDate": "04-01-26",
    "serviceTimeSlot": "2 pm - 4 pm",
    "services": "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…",
    "beautician": "Deepika",
    "status": "Completed",
    "amount": 649,
    "beauticianPayout": 340,
    "companyAmount": 309,
    "paymentMode": "UPI",
    "paymentStatus": "Paid"
  }'
```

### Get All Bookings with Filters
```bash
curl -X GET "http://localhost:5000/api/admin-bookings?status=Completed&type=commission&paymentStatus=Paid" \
  -H "Content-Type: application/json"
```

### Get Booking by ID
```bash
curl -X GET "http://localhost:5000/api/admin-bookings/PS-2026-0032" \
  -H "Content-Type: application/json"
```

### Update Booking
```bash
curl -X PUT "http://localhost:5000/api/admin-bookings/PS-2026-0032" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In progress",
    "paymentStatus": "Paid"
  }'
```

### Delete Booking
```bash
curl -X DELETE "http://localhost:5000/api/admin-bookings/PS-2026-0032" \
  -H "Content-Type: application/json"
```

### Import from CSV
```bash
curl -X POST "http://localhost:5000/api/admin-bookings/import" \
  -F "file=@bookings.csv"
```

---

## Booking Type Logic

### Commission Type
- `beauticianPayout`: Calculated commission amount (e.g., 340)
- `companyAmount`: Company profit (e.g., 309)
- Formula: `amount = beauticianPayout + companyAmount`

### Fixed Type
- `beauticianPayout`: Always `null` or "N/A" (no commission)
- `companyAmount`: Full amount goes to company (e.g., 999)
- Formula: `amount = companyAmount`

---

## Date Formats

- **Booking Date**: "04-01-26" (MM-DD-YY format)
- **Service Date**: "04-01-26" (MM-DD-YY format)
- **Time Slot**: "2 pm - 4 pm" (text format)

---

## Valid Enum Values

### Status
- Pending
- Confirmed
- Completed
- Cancelled
- Rescheduled
- In progress

### Payment Mode
- UPI
- COD
- Cash
- Card
- Online

### Payment Status
- Paid
- Pending
- Failed

### Type
- commission
- fixed

---

## Files Modified

1. ✅ [models/adminBooking/adminBooking.js](models/adminBooking/adminBooking.js) - Updated model schema
2. ✅ [controllers/adminBookingController/adminBooking.js](controllers/adminBookingController/adminBooking.js) - Updated CRUD operations
3. ✅ [routes/adminBooking/adminBooking.js](routes/adminBooking/adminBooking.js) - Updated Swagger docs

---

## Summary

| Operation | Status | Details |
|-----------|--------|---------|
| Create | ✅ | POST with all fields |
| Read All | ✅ | With filtering & sorting |
| Read One | ✅ | By ID or bookingId |
| Update | ✅ | Partial updates supported |
| Delete | ✅ | Hard delete |
| Import CSV/TSV | ✅ | Bulk import with create/update logic |
| Stats | ✅ | Business metrics |

**Overall Status**: 🟢 **Fully Implemented** - All APIs are ready for production use!
