```javascript
const menuPrices = {
    "Big Bites Zinger": 550,
    "Smash Beef Burger": 650,
    "Cheese-Loaded Burger": 600,

    "Crispy Wings (6pc)": 700,
    "Chicken Broast (2pc)": 550,

    "Zinger Roll": 400,
    "Shawarma Roll": 300,

    "Loaded Fries": 450,
    "Cheesy Fries": 400,
    "Regular Fries": 250,

    "Oreo Shake": 400,
    "Mango Shake": 350,
    "Soft Drink": 100
};

// Temporary storage
let orders = [];

export default async function handler(req, res) {

    // Allow requests from website
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // ==============================
    // GET ALL ORDERS
    // ==============================

    if (req.method === "GET") {
        return res.status(200).json(orders);
    }

    // ==============================
    // POST NEW ORDER
    // ==============================

    if (req.method === "POST") {

        try {

            const {
                name,
                customer,
                phone,
                quantity,
                item,
                items,
                address,
                notes
            } = req.body || {};

            const customerName =
                name || customer || "Unknown Customer";

            const selectedItem =
                item || items;

            if (!selectedItem) {
                return res.status(400).json({
                    success: false,
                    message: "Please select a menu item."
                });
            }

            const qty = Number(quantity) || 1;

            if (qty < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be at least 1."
                });
            }

            const price =
                menuPrices[selectedItem];

            if (!price) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid menu item selected."
                });
            }

            const total =
                price * qty;

            const order = {

                id: Date.now(),

                customer:
                    customerName,

                phone:
                    phone || "",

                item:
                    selectedItem,

                quantity:
                    qty,

                price:
                    price,

                address:
                    address || "",

                notes:
                    notes || "",

                total:
                    total,

                status:
                    "New",

                date:
                    new Date().toLocaleString()

            };

            orders.push(order);

            console.log(
                "NEW ORDER:",
                order
            );

            return res.status(200).json({

                success: true,

                message:
                    "Order received successfully!",

                order:
                    order

            });

        }

        catch (error) {

            console.error(
                "Order Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Server error while processing order."

            });
        }
    }

    // ==============================
    // OTHER METHODS
    // ==============================

    return res.status(405).json({

        success: false,

        message:
            "Method not allowed"

    });
}
```
