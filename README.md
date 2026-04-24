# Reactivux

A **TypeScript-based food ordering dashboard** (admin/store panel) built with **React.ts** and **tailwindcss/ui**. The project integrates with a REST API backend — likely **LivCollect** — that manages stores, orders, customers, and delivery.

---

## Project Structure

```
Reactivux/
├── myshadcn-app/          # Main React.ts + tailwind/ui frontend application
├── forsignin.txt          # Sample API authentication response (sign-in payload)
├── order.txt              # Sample API response — paginated list of orders (66 KB)
├── status.txt             # API endpoint reference for updating order status
├── undert.txt             # Partial order data snippet (unstructured draft)
└── unstructed.txt         # Empty file (placeholder / work in progress)
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | [React.js](https://react.dev/)      |
| Language   | TypeScript (98.3%)                  |
| UI Library | [tailwind/ui](https://tailwindcss.com) |
| API        | AXIOS (LivCollect backend)           |

---

## Authentication

The app authenticates against the backend API and receives a JWT `accessToken` along with user profile data.

**Sign-in response shape:**
```json
{
  "message": "User signin successfully",
  "data": {
    "id": 1,
    "first_name": "...",
    "last_name": "...",
    "email": "superadmin@livcollect.com",
    "roles": "[\"super-admin\"]",
    "store_id": 1,
    "uuid": "..."
  },
  "accessToken": "<token>"
}
```

---

## Orders API

### List Orders

`GET {{apiUrl}}/orders`

Returns a paginated list of orders. Each order contains:

- **Order metadata**: `id`, `type` (`liv` = delivery, `cac` = click & collect, `at_place` = dine-in), `status`, `total_amount`, `fees`, `is_paid`
- **Order statuses**: `pending`, `accepted`, `delivered`, `canceled`
- **Order sources**: `website`, `borne` (kiosk)
- **Line items** (`elements_order`): product name, quantity, price, size variants via `sub_elements_order`
- **Customer info**: name, email, phone
- **Address info**: delivery address or click & collect address with GPS coordinates
- **Flags**: `planified` (scheduled order), `isRefund`, `isRead`, `printed`

**Example product in an order:**
```json
{
  "name": "La Margarita",
  "description": "Mozzarella, olives, origan",
  "category": "Nos pizzas Sauce Tomate",
  "sub_product": { "name": "Junior 26 CM", "price": 7 }
}
```

### Update Order Status

`POST {{apiUrl}}/orders/{{uuid}}/status`

**Request body:**
```json
{
  "order_id": 1175,
  "status": "canceled"
}
```

**Accepted values for `status`:** `accepted` | `delivered` | `pending` | `canceled`

---

## Order Types

| Type       | Description                              |
|------------|------------------------------------------|
| `liv`      | Home delivery (with delivery address)    |
| `cac`      | Click & collect (customer picks up)      |
| `at_place` | Dine-in (linked to a table)              |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ilyas11-03/Reactivux.git
cd Reactivux/myshadcn-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Notes

- The `.txt` files at the root are **API response samples and endpoint references** used during development — they are not production files.
- The `unstructed.txt` file is currently empty (likely a placeholder for future documentation).
- The `myshadcn-app/` folder contains the full Next.js application source code.

---

## Author

**Ilyas11-03** — [GitHub Profile](https://github.com/Ilyas11-03)
