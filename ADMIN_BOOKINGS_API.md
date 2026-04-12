# Admin Bookings API

Base URL: `/api/admin-bookings`

> These endpoints manage manual booking records (admin panel entries). They are separate from the user-facing booking flow.

---

## Data Model

| Field | Type | Notes |
|---|---|---|
| `bookingId` | String | Auto-generated as `PS-YYYY-XXXX`. Can be supplied during import to override. |
| `customerName` | String | Default: `""` |
| `phoneNumber` | String | Default: `""` |
| `fullAddress` | String | Default: `""` |
| `bookingType` | String | `commission` \| `fixed`. Default: `null` |
| `bookingDate` | Date | Date the booking was placed. Default: `null` |
| `serviceDate` | Date | Date the service is performed. Default: `null` |
| `serviceTimeSlot` | String | e.g. `3 pm - 5 pm`. Default: `""` |
| `servicesBooked` | String | Free-text description. Default: `""` |
| `assignedBeauticianName` | String | Default: `""` |
| `bookingStatus` | String | `Pending` \| `Confirmed` \| `Completed` \| `Cancelled` \| `Rescheduled` \| `In progress`. Default: `Pending` |
| `beauticianPayout` | Number | Commission paid to beautician. `null` for `fixed` type. Default: `null` |
| `serviceAmount` | Number | Total customer payment. Default: `null` |
| `gstAmount` | Number | GST component. Default: `0` |
| `totalAmount` | Number | Our net profit. Default: `null` |
| `paymentMode` | String | `UPI` \| `COD` \| `Cash` \| `Card` \| `Online`. Default: `null` |
| `paymentStatus` | String | `Paid` \| `Pending` \| `Failed`. Default: `Pending` |
| `remarks` | String | Any additional notes. Default: `""` |

> No field is compulsory. All fields are optional.

---

## Earnings Logic

| Metric | Source Field | Description |
|---|---|---|
| **Total Earnings** | `serviceAmount` | What the customer paid |
| **Beautician Payout** | `beauticianPayout` | Commission paid out (commission bookings only) |
| **Our Profit** | `totalAmount` | Net amount retained after payout |

---

## Endpoints

### 1. Create Booking

**`POST /api/admin-bookings`**

Creates a single booking record. `bookingId` is auto-generated.

**Request Body** *(all fields optional)*
```json
{
  "customerName": "Punam Giri",
  "phoneNumber": "9871474248",
  "fullAddress": "ITC maurya chanakyapuri",
  "bookingType": "commission",
  "bookingDate": "2026-01-04",
  "serviceDate": "2026-01-04",
  "serviceTimeSlot": "3 pm - 5 pm",
  "servicesBooked": "Saree draping",
  "assignedBeauticianName": "Arti Mehta",
  "bookingStatus": "Completed",
  "beauticianPayout": 400,
  "serviceAmount": 558,
  "gstAmount": 148,
  "totalAmount": 706,
  "paymentMode": "UPI",
  "paymentStatus": "Paid",
  "remarks": ""
}
```

> For `bookingType: "fixed"`, `beauticianPayout` is automatically set to `null`.

**Responses**

| Status | Description |
|---|---|
| `201` | Booking created successfully |
| `500` | Server error |

**201 Response**
```json
{
  "success": true,
  "data": {
    "_id": "661f2c3e4d5e6f7a8b9c0d1e",
    "bookingId": "PS-2026-0001",
    "customerName": "Punam Giri",
    ...
  }
}
```

---

### 2. Get All Bookings

**`GET /api/admin-bookings`**

Returns all booking records sorted by creation date (newest first). Supports optional filters.

**Query Parameters**

| Param | Type | Description |
|---|---|---|
| `bookingStatus` | String | `Pending` \| `Confirmed` \| `Completed` \| `Cancelled` \| `Rescheduled` \| `In progress` |
| `paymentStatus` | String | `Paid` \| `Pending` \| `Failed` |
| `bookingType` | String | `commission` \| `fixed` |
| `from` | Date (`YYYY-MM-DD`) | `serviceDate >= from` |
| `to` | Date (`YYYY-MM-DD`) | `serviceDate <= to` |

**Examples**
```
GET /api/admin-bookings
GET /api/admin-bookings?bookingStatus=Completed
GET /api/admin-bookings?bookingType=commission&paymentStatus=Paid
GET /api/admin-bookings?from=2026-04-01&to=2026-04-30
```

**200 Response**
```json
{
  "success": true,
  "count": 22,
  "data": [ ...booking objects ]
}
```

---

### 3. Get Single Booking

**`GET /api/admin-bookings/:id`**

Fetch one booking by MongoDB `_id` or Booking ID (e.g. `PS-2026-0030`).

**Examples**
```
GET /api/admin-bookings/PS-2026-0030
GET /api/admin-bookings/661f2c3e4d5e6f7a8b9c0d1e
```

**Responses**

| Status | Description |
|---|---|
| `200` | Booking found |
| `404` | Booking not found |
| `500` | Server error |

---

### 4. Update Booking

**`PUT /api/admin-bookings/:id`**

Update any fields. Accepts MongoDB `_id` or Booking ID. Send only the fields you want to change.

> If `bookingType` is changed to `fixed`, `beauticianPayout` is automatically cleared to `null`.

**Request Body** *(partial update example)*
```json
{
  "bookingStatus": "Completed",
  "assignedBeauticianName": "Sakshi",
  "paymentStatus": "Paid"
}
```

**Responses**

| Status | Description |
|---|---|
| `200` | Booking updated successfully |
| `404` | Booking not found |
| `500` | Server error |

---

### 5. Delete Booking

**`DELETE /api/admin-bookings/:id`**

Permanently deletes a booking. Accepts MongoDB `_id` or Booking ID.

**Responses**

| Status | Description |
|---|---|
| `200` | Booking deleted successfully |
| `404` | Booking not found |
| `500` | Server error |

---

### 6. Import from CSV / Google Sheets

**`POST /api/admin-bookings/import`**

Bulk-import booking records from a `.csv` or `.tsv` file.

**Content-Type:** `multipart/form-data`
**Form field name:** `file`

#### How to export from Google Sheets
**File → Download → Comma Separated Values (.csv)**

The file must have a header row with the following column names (extra columns ignored, order does not matter):

```
S no, Booking ID, Customer Name, Phone Number, Full Address, Booking Type,
Booking Date, Service Date, Service Time Slot, Services Booked,
Assigned Beautician Name, Booking Status, Beautician payout,
Service Amount, GST Amount, Total Amount, Payment Mode, Payment Status, Remarks
```

#### Import rules

| Column | Behaviour |
|---|---|
| `Booking Date` / `Service Date` | Accepts `MM-DD-YY` (e.g. `04-01-26`) or `YYYY-MM-DD` |
| `Beautician payout` | `N/A`, `-`, or blank → stored as `null` |
| `bookingType = fixed` | `beauticianPayout` forced to `null` |
| `Booking Status` | Unrecognised values default to `Pending` |
| `Payment Mode` | Unrecognised values default to `UPI` |
| Existing `Booking ID` | Record is **updated** |
| New `Booking ID` | Record is **created** |
| Missing `Booking ID` | Row is **skipped** (nothing to key on) |

> All other missing fields are saved as `null` / `""` — no row is skipped due to missing data fields.

**200 Response**
```json
{
  "success": true,
  "message": "Import complete — 18 created, 2 updated, 1 skipped",
  "created": 18,
  "updated": 2,
  "skipped": 1,
  "errors": [
    "Row PS-2026-0046: missing required numeric/date fields"
  ]
}
```

**Error Responses**

| Status | Description |
|---|---|
| `400` | No file uploaded |
| `400` | CSV parse error (malformed file) |
| `500` | Server error |

---

### 7. Stats

**`GET /api/admin-bookings/stats`**

Returns aggregated financial and booking statistics. All query filters are optional and can be combined.

**Query Parameters**

| Param | Type | Description |
|---|---|---|
| `from` | Date (`YYYY-MM-DD`) | Filter by `serviceDate >= from` |
| `to` | Date (`YYYY-MM-DD`) | Filter by `serviceDate <= to` |
| `bookingType` | String | `commission` \| `fixed` — restrict to one type only |

**Examples**
```
GET /api/admin-bookings/stats
GET /api/admin-bookings/stats?from=2026-04-01&to=2026-04-30
GET /api/admin-bookings/stats?bookingType=commission
GET /api/admin-bookings/stats?from=2026-04-01&to=2026-04-30&bookingType=fixed
```

**200 Response**
```json
{
  "success": true,
  "filters": {
    "from": "2026-04-01",
    "to": "2026-04-30",
    "bookingType": "all"
  },
  "summary": {
    "totalEarnings": 24000,
    "totalBeauticianPayout": 8500,
    "totalProfit": 15500,
    "totalGst": 3200,
    "totalBookings": 22,
    "paidBookings": 19
  },
  "byStatus": [
    { "status": "Completed", "count": 18 },
    { "status": "Pending", "count": 2 },
    { "status": "Cancelled", "count": 1 },
    { "status": "Rescheduled", "count": 1 }
  ],
  "byType": [
    {
      "type": "commission",
      "count": 10,
      "totalEarnings": 12000,
      "totalBeauticianPayout": 8500,
      "totalProfit": 3500
    },
    {
      "type": "fixed",
      "count": 12,
      "totalEarnings": 12000,
      "totalBeauticianPayout": 0,
      "totalProfit": 12000
    }
  ],
  "byBeautician": [
    {
      "_id": "Arti Mehta",
      "bookings": 3,
      "totalPayout": 2763,
      "totalEarnings": 3947
    },
    {
      "_id": "Priya",
      "bookings": 2,
      "totalPayout": 1995,
      "totalEarnings": 2850
    }
  ],
  "byMonth": [
    {
      "year": 2026,
      "month": 4,
      "bookings": 15,
      "totalEarnings": 18000,
      "totalBeauticianPayout": 6000,
      "totalProfit": 12000
    }
  ]
}
```

#### Summary fields explained

| Field | Formula | Description |
|---|---|---|
| `totalEarnings` | `Σ serviceAmount` | Total amount collected from customers |
| `totalBeauticianPayout` | `Σ beauticianPayout` | Total commission paid out to beauticians |
| `totalProfit` | `Σ totalAmount` | Our net retained amount |
| `totalGst` | `Σ gstAmount` | Total GST across all bookings |
| `totalBookings` | count of all records | Total booking records in the filtered set |
| `paidBookings` | count where `paymentStatus = Paid` | Bookings with confirmed payment |

#### `byBeautician` section
Only includes **commission** bookings where `beauticianPayout > 0`. Sorted by `totalPayout` descending.

#### `byMonth` section
Grouped by `serviceDate` month. Sorted chronologically (oldest → newest).

---

## Swagger UI

Interactive docs available at:
```
http://localhost:5000/api/docs
```
Tag: **AdminBookings**
