const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function createTable() {
    await sql`
        CREATE TABLE IF NOT EXISTS orders (
            id BIGSERIAL PRIMARY KEY,
            customer VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            item VARCHAR(255) NOT NULL,
            quantity INTEGER NOT NULL,
            price NUMERIC NOT NULL,
            address TEXT,
            notes TEXT,
            total NUMERIC NOT NULL,
            status VARCHAR(50) DEFAULT 'New',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
}

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

module.exports = async (req, res) => {

    try {

        await createTable();

        // ==============================
        // GET ALL ORDERS
        // ==============================

        if (req.method === "GET") {

            const orders = await sql`
                SELECT
                    id,
                    customer,
                    phone,
                    item,
                    quantity,
                    price,
                    address,
                    notes,
                    total,
                    status,
                    created_at
                FROM orders
                ORDER BY created_at DESC
            `;

            return res.status(200).json(orders);
        }


        // ==============================
        // CREATE ORDER
        // ==============================

        if (req.method === "POST") {

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


            const result = await sql`
                INSERT INTO orders
                (
                    customer,
                    phone,
                    item,
                    quantity,
                    price,
                    address,
                    notes,
                    total,
                    status
                )
                VALUES
                (
                    ${customerName},
                    ${phone || ""},
                    ${selectedItem},
                    ${qty},
                    ${price},
                    ${address || ""},
                    ${notes || ""},
                    ${total},
                    'New'
                )
                RETURNING *
            `;


            console.log("NEW ORDER:", result[0]);


            return res.status(201).json({

                success: true,

                message:
                    "Order received successfully!",

                order:
                    result[0]

            });

        }


        // ==============================
        // UPDATE ORDER
        // ==============================

        if (req.method === "PUT") {

            const {
                id,
                status
            } = req.body || {};

            if (!id) {

                return res.status(400).json({
                    success: false,
                    message: "Order ID is required."
                });

            }

            const result = await sql`
                UPDATE orders
                SET status = ${status || "New"}
                WHERE id = ${Number(id)}
                RETURNING *
            `;


            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Order status updated successfully.",

                order:
                    result[0]

            });

        }


        // ==============================
        // DELETE ORDER
        // ==============================

        if (req.method === "DELETE") {

            const id =
                Number(req.query.id);

            if (!id) {

                return res.status(400).json({
                    success: false,
                    message: "Order ID is required."
                });

            }

            const result = await sql`
                DELETE FROM orders
                WHERE id = ${id}
                RETURNING *
            `;


            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Order deleted successfully."

            });

        }


        return res.status(405).json({

            success: false,

            message:
                "Method not allowed."

        });

    }

    catch (error) {

        console.error(
            "DATABASE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Database error.",

            error:
                error.message

        });

    }

};
