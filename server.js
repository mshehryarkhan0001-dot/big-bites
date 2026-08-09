const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =====================================
// PORT
// =====================================

const PORT = process.env.PORT || 5000;

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// WEBSITE FILES
// =====================================

app.use(express.static(__dirname));

// =====================================
// HOME PAGE
// =====================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// =====================================
// ADMIN PAGE
// =====================================

app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

// =====================================
// BACKEND TEST
// =====================================

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Big Bites Backend is Working!"
    });
});

// =====================================
// MENU PRICES
// =====================================

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

// =====================================
// ORDERS
// =====================================

let orders = [];

// =====================================
// NEW ORDER
// =====================================

app.post("/api/orders", (req, res) => {

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
        } = req.body;

        // =================================
        // CUSTOMER NAME
        // =================================

        const customerName =
            name || customer || "Unknown Customer";

        // =================================
        // SELECTED ITEM
        // =================================

        const selectedItem =
            item || items;

        // =================================
        // CHECK ITEM
        // =================================

        if (!selectedItem) {

            return res.status(400).json({
                success: false,
                message: "Please select a menu item."
            });

        }

        // =================================
        // QUANTITY
        // =================================

        const qty = Number(quantity) || 1;

        if (qty < 1) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1."
            });

        }

        // =================================
        // FIND PRICE
        // =================================

        const price =
            menuPrices[selectedItem];

        // =================================
        // CHECK MENU ITEM
        // =================================

        if (!price) {

            return res.status(400).json({
                success: false,
                message: "Invalid menu item selected."
            });

        }

        // =================================
        // CALCULATE TOTAL
        // =================================

        const total = price * qty;

        // =================================
        // CREATE ORDER
        // =================================

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

        // =================================
        // SAVE ORDER
        // =================================

        orders.push(order);

        // =================================
        // SHOW ORDER IN CMD
        // =================================

        console.log("\n==============================");
        console.log("          NEW ORDER");
        console.log("==============================");

        console.log("Order ID:", order.id);
        console.log("Customer:", order.customer);
        console.log("Phone:", order.phone);
        console.log("Item:", order.item);
        console.log("Quantity:", order.quantity);
        console.log("Price:", "Rs.", order.price);
        console.log("TOTAL:", "Rs.", order.total);
        console.log("Address:", order.address);
        console.log("Notes:", order.notes);
        console.log("Status:", order.status);

        console.log("==============================\n");

        // =================================
        // SEND RESPONSE
        // =================================

        res.json({

            success:
                true,

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

        res.status(500).json({

            success:
                false,

            message:
                "Server error while processing order."

        });

    }

});

// =====================================
// GET ALL ORDERS
// =====================================

app.get("/api/orders", (req, res) => {

    res.json(orders);

});

// =====================================
// GET SINGLE ORDER
// =====================================

app.get("/api/orders/:id", (req, res) => {

    const id =
        Number(req.params.id);

    const order =
        orders.find(
            o => o.id === id
        );

    if (!order) {

        return res.status(404).json({

            success:
                false,

            message:
                "Order not found"

        });

    }

    res.json({

        success:
            true,

        order:
            order

    });

});

// =====================================
// UPDATE ORDER STATUS
// =====================================

app.put("/api/orders/:id", (req, res) => {

    const id =
        Number(req.params.id);

    const order =
        orders.find(
            o => o.id === id
        );

    if (!order) {

        return res.status(404).json({

            success:
                false,

            message:
                "Order not found"

        });

    }

    order.status =
        req.body.status || order.status;

    res.json({

        success:
            true,

        message:
            "Order status updated successfully",

        order:
            order

    });

});

// =====================================
// DELETE ORDER
// =====================================

app.delete("/api/orders/:id", (req, res) => {

    const id =
        Number(req.params.id);

    const oldLength =
        orders.length;

    orders =
        orders.filter(
            o => o.id !== id
        );

    if (orders.length === oldLength) {

        return res.status(404).json({

            success:
                false,

            message:
                "Order not found"

        });

    }

    res.json({

        success:
            true,

        message:
            "Order deleted successfully"

    });

});

// =====================================
// 404 API HANDLER
// =====================================

app.use("/api", (req, res) => {

    res.status(404).json({

        success:
            false,

        message:
            "API endpoint not found"

    });

});

// =====================================
// SERVER START
// =====================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Big Bites server running on port ${PORT}`
        );

    }
);