import mongoose from "mongoose";
import dotenv from "dotenv";
import Supplier from "./models/Supplier.js";
import Contractor from "./models/Contractor.js";
import Order from "./models/Order.js";
dotenv.config();
import Notification from "./models/Notification.js";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import Chat from "./models/Chat.js";
import {
  sendUSDC,
  checkUSDCBalance,
} from "./services/circleService.js";
import {
  createEscrowOrder
} from "./services/arcEscrowService.js";
const app = express();

app.use(cors());
app.use(express.json());

const suppliersFile = path.join(
  process.cwd(),
  "src/database/suppliers.json"
);

const ordersFile = path.join(
  process.cwd(),
  "src/database/orders.json"
);
const contractorsFile = path.join(
  process.cwd(),
  "src/database/contractors.json"
);
const chatsFile = path.join(
  process.cwd(),
  "src/database/chats.json"
);

function getSuppliers() {
  return JSON.parse(
    fs.readFileSync(suppliersFile, "utf-8")
  );
}


function getOrders() {
  return JSON.parse(
    fs.readFileSync(ordersFile, "utf-8")
  );
}
function getContractors() {
  return JSON.parse(
    fs.readFileSync(contractorsFile, "utf-8")
  );
}
function getChats() {
  return JSON.parse(
    fs.readFileSync(chatsFile, "utf-8")
  );
}


function saveChats(chats) {
  fs.writeFileSync(
    chatsFile,
    JSON.stringify(chats, null, 2)
  );
}
function saveContractors(contractors) {
  fs.writeFileSync(
    contractorsFile,
    JSON.stringify(contractors, null, 2)
  );
}

function saveOrders(orders) {
  fs.writeFileSync(
    ordersFile,
    JSON.stringify(orders, null, 2)
  );
}





app.get("/", (req, res) => {
  res.send("Backend running");
});



// ===============================
// SUPPLIERS
// ===============================


app.get("/suppliers", async (req, res) => {

  try {

    const suppliers = await Supplier.find();

    res.json(suppliers);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers"
    });

  }

});


app.post("/suppliers", async (req, res) => {

  console.log("NEW SUPPLIER RECEIVED:");
  console.log(req.body);

  try {

    const supplier = await Supplier.create({
      ...req.body,
      id: Date.now(),
      trusted: true,
      trustScore: 95,
    });

    res.json({
      success: true,
      message: "Supplier added successfully",
      supplier,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add supplier",
    });

  }

});


app.put("/suppliers/:id", async (req, res) => {

  try {

    const supplierId = Number(req.params.id);

    const supplier = await Supplier.findOneAndUpdate(
      { id: supplierId },
      req.body,
      { new: true }
    );


    if (!supplier) {

      return res.json({
        success: false,
        message: "Supplier not found",
      });

    }


    res.json({
      success: true,
      message: "Supplier updated successfully",
      supplier,
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update supplier",
    });

  }

});





// ===============================
// ORDERS
// ===============================


app.get("/orders", async (req, res) => {

  try {

    const orders = await Order.find();

    res.json(orders);


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to fetch orders",

    });

  }

});




app.post("/orders", async (req, res) => {
  console.log("ORDER ROUTE HIT");
console.log(req.body);

  try {

    console.log("POST /orders called");
    console.log(req.body);


    const duplicate = await Order.findOne({

      contractorId: req.body.contractorId,

      supplierId: req.body.supplierId,

      status: "Pending"

    });


    if (duplicate) {

      return res.json({

        success: false,

        message: "Pending order already exists.",

      });

    }



    const marketPrice = Number(
      req.body.marketPrice || req.body.amount || 0
    );


    const orderAmount = Number(
      req.body.amount || req.body.totalAmount || 0
    );


    const savings = marketPrice - orderAmount;



    const contractor = await Contractor.findOne({
  id: Number(req.body.contractorId)
});


const supplier = await Supplier.findOne({
  id: Number(req.body.supplierId)
});


const newOrder = await Order.create({

  id: Date.now(),

  ...req.body,


  contractorWallet:
    contractor?.wallet || "",


  supplierWallet:
    supplier?.wallet || "",

      amount: orderAmount,

      totalAmount:
        req.body.totalAmount || orderAmount,

      marketPrice,

      savings:
        savings > 0 ? savings : 0,

      status: "Pending",

      paymentStatus:
        req.body.paymentStatus || "Unpaid",

      createdAt:
        new Date().toISOString(),

    });



    console.log("Order saved to MongoDB");
    console.log(newOrder);
// CREATE ARC ESCROW ORDER
try {

  if (newOrder.supplierWallet) {

    const escrowTx =
      await createEscrowOrder(
        newOrder.supplierWallet
      );

    newOrder.escrowTransaction =
      escrowTx;

    await newOrder.save();

    console.log(
      "Arc escrow created:",
      escrowTx
    );

  }

} catch(error){

  console.error(
    "Escrow creation failed:",
    error.message
  );

}


    // Keep notification JSON temporarily
    await Notification.create({
  id: Date.now(),
  userId: Number(newOrder.supplierId),
  role: "supplier",
  type: "order",
  orderId: newOrder.id,
  message: `New order received from ${newOrder.contractorName || "Contractor"}`,
  read: false,
  createdAt: new Date(),
});



    res.json({

      success: true,

      message: "Order placed successfully.",

      order: newOrder,

    });



  } catch (error) {

    console.error(error);


    res.status(500).json({

      success: false,

      message: "Failed to create order",

    });

  }

});





// UPDATE ORDER STATUS + PAYMENT
app.put("/orders/:id", async (req, res) => {

  const orderId = Number(req.params.id);

const order = await Order.findOne({
  id: orderId
});


if (!order) {

  return res.json({
    success: false,
    message: "Order not found",
  });

}

  // Update status/payment status
  if(req.body.status){
  order.status = req.body.status;
}


if(req.body.paymentStatus){
  order.paymentStatus = req.body.paymentStatus;
}

  // ==========================
// CONTRACTOR NOTIFICATIONS
// ==========================
console.log("STATUS RECEIVED:", req.body.status);
console.log("ORDER CONTRACTOR ID:", order.contractorId);
const statusMessages = {
  Accepted: `✅ ${order.supplierName} accepted your order`,
  Rejected: `❌ ${order.supplierName} rejected your order`,
  Completed: `🎉 ${order.supplierName} marked your order as completed`,
};

if (statusMessages[req.body.status]) {
  await Notification.create({
    id: Date.now(),
    userId: Number(order.contractorId),
    role: "contractor",
    type: "order",
    orderId: order.id,
    message: statusMessages[req.body.status],
    read: false,
    createdAt: new Date(),
  });
}

  // Release escrow when contractor confirms delivery
  if (req.body.status === "Completed") {
    try {

      const payment = await sendUSDC(
  order.supplierWallet,
  order.totalAmount || order.amount
);

      order.paymentStatus = "Paid";

order.transactionId = payment.id;

order.releasedAt = new Date().toISOString();

    } catch (error) {

      console.error(
  JSON.stringify(
    error.response?.data,
    null,
    2
  )
);

      return res.json({
        success: false,
        message: "Failed to release payment.",
      });

    }
  }

  await order.save();

res.json({
  success:true,
  message:"Order updated successfully",
  order
});

});


// ===============================
// NOTIFICATIONS
// ===============================

// Get notifications
app.get("/notifications/:userId", async (req, res) => {

  try {

    const notifications = await Notification.find({
      userId: Number(req.params.userId),
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });

  }

});

// Mark notifications as read
app.put("/notifications/:userId/read", async (req, res) => {

  try {

    await Notification.updateMany(
      {
        userId: Number(req.params.userId),
      },
      {
        read: true,
      }
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });

  }

});

// ===============================
// CONTRACTOR SETTINGS
// ===============================

// Update contractor wallet
app.put("/contractors/:id/wallet", async (req, res) => {

  try {

    const contractor = await Contractor.findOneAndUpdate(
      {
        id: Number(req.params.id)
      },
      {
        wallet: req.body.wallet
      },
      {
        new: true
      }
    );


    if (!contractor) {

      return res.json({
        success: false,
        message: "Contractor not found",
      });

    }


    res.json({

      success: true,

      message: "Wallet updated successfully",

      contractor,

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to update wallet",

    });

  }

});

// ===============================
// CONTRACTORS
// ===============================

// Register Contractor
app.post("/contractors/register", async (req, res) => {

  try {

    const {
      companyName,
      ownerName,
      email,
      password,
      location,
      wallet,
    } = req.body;


    const existing = await Contractor.findOne({
      email: email.toLowerCase()
    });


    if (existing) {

      return res.json({
        success: false,
        message: "Email already exists.",
      });

    }


    const newContractor = await Contractor.create({

      id: Date.now(),

      companyName,

      ownerName,

      email,

      password,

      location,

      wallet: wallet || "",

      trustScore: 95,

    });


    res.json({

      success: true,

      contractor: newContractor,

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to register contractor",

    });

  }

});


// Get all contractors
app.get("/contractors", async (req, res) => {

  try {

    const contractors = await Contractor.find();

    res.json(contractors);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contractors",
    });

  }

});


// Get contractor by ID
app.get("/contractors/:id", async (req, res) => {

  try {

    const contractor = await Contractor.findOne({
      id: Number(req.params.id)
    });


    if (!contractor) {

      return res.json({
        success: false,
        message: "Contractor not found",
      });

    }


    res.json(contractor);


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contractor",
    });

  }

});


// Update contractor
app.put("/contractors/:id", async (req, res) => {

  try {

    const contractor = await Contractor.findOneAndUpdate(
      {
        id: Number(req.params.id)
      },
      req.body,
      {
        new: true
      }
    );


    if (!contractor) {

      return res.json({
        success: false,
        message: "Contractor not found",
      });

    }


    res.json({
      success: true,
      contractor,
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update contractor",
    });

  }

});

// ===============================
// TRUSTED SUPPLIERS
// ===============================


app.get("/trusted-suppliers", async (req, res) => {

  try {

    const suppliers = await Supplier.find();

    const orders = await Order.find();

  const trustedSuppliers = suppliers
    .filter(
      (supplier) =>
        supplier.trusted === true ||
        Number(supplier.trustScore || 0) >= 80
    )
    .map((supplier) => {

      const completedOrders = orders.filter(
        (order) =>
          Number(order.supplierId) === Number(supplier.id) &&
          order.status === "Completed"
      );

      return {
        id: supplier.id,
        companyName: supplier.companyName,
        location: supplier.location,
        materials: supplier.materials,
        completedOrders: completedOrders.length,
        trustScore: supplier.trustScore || 95,
      };

    });

      res.json(trustedSuppliers);

  } catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch trusted suppliers"
    });

  }

});







// ===============================
// AI PROCUREMENT AGENT
// ===============================


app.post("/procurement", async (req, res) => {

const suppliers = await Supplier.find();



  const quantities =
    req.body.quantities || {};



  const cementQty =
    Number(quantities.cement || 0);


  const steelQty =
    Number(quantities.steel || 0);


  const blockQty =
    Number(quantities.blocks || 0);




  if (
    cementQty === 0 &&
    steelQty === 0 &&
    blockQty === 0
  ) {

    return res.json({

      success: false,

      message:
        "Please enter at least one material.",

    });

  }





  const quotations = suppliers

    .filter(

      (supplier) =>

        supplier.materials &&

        supplier.materials.length > 0

    )

    .map((supplier) => {



      let cementPrice = 0;

      let steelPrice = 0;

      let blockPrice = 0;




      supplier.materials.forEach((item) => {



        const name = (

          item.category ||

          item.name ||

          ""

        )

          .toLowerCase()

          .trim();





        if (name === "cement") {

          cementPrice =
            Number(item.price);

        }





        if (name === "steel") {

          steelPrice =
            Number(item.price);

        }





        if (
          name === "block" ||
          name === "blocks"
        ) {

          blockPrice =
            Number(item.price);

        }



      });





      const totalCost =

        cementQty * cementPrice +

        steelQty * steelPrice +

        blockQty * blockPrice;





      return {


        id: supplier.id,


        companyName:
          supplier.companyName,


        wallet:
          supplier.wallet,


        trusted:
          supplier.trusted,


        trustScore:
          supplier.trustScore || 95,


        totalCost,


      };



    });





  quotations.sort(

    (a, b) =>

      a.totalCost - b.totalCost

  );





  if (quotations.length === 0) {


    return res.json({

      success: false,

      message:
        "No suppliers available.",

    });


  }





  const bestSupplier =
  quotations[0];


// Highest supplier quotation = market reference price
const marketPrice = Math.max(
  ...quotations.map(
    (supplier) => supplier.totalCost
  )
);


const savings =
  marketPrice - bestSupplier.totalCost;



res.json({

  success: true,

  savings,

  marketPrice,

  supplier: {


      id:
        bestSupplier.id,


      name:
        bestSupplier.companyName,


      walletAddress:
        bestSupplier.wallet,


      trusted:
        bestSupplier.trusted,


      trustScore:
        bestSupplier.trustScore,


      totalCost:
        bestSupplier.totalCost,


    },



    quotations,


  });


});




// ===============================
// CHAT SYSTEM
// ===============================


app.get("/chats/:orderId", (req, res) => {

  const chats = getChats();


  const chat = chats.find(
    (item) =>
      String(item.orderId) === String(req.params.orderId)
  );


  if (chat) {

    return res.json(chat.messages);

  }


  res.json([]);

});








app.post("/chats/:orderId", async (req, res) => {


  const chats = getChats();

const orderId = String(req.params.orderId);

console.log("URL ORDER ID:", req.params.orderId);
console.log("NUMBER ORDER ID:", Number(req.params.orderId));

const order = await Order.findOne({
  id: Number(req.params.orderId),
});

console.log("ORDER FROM MONGODB:");
console.log(order);

const message = req.body;


  



  
console.log("CHAT RECEIVED");
console.log(message);
// ==========================
// CREATE CHAT NOTIFICATION
// ==========================



console.log("ORDER FOUND:");
console.log(order);
console.log("Supplier ID:", order.supplierId);
console.log("Contractor ID:", order.contractorId);
console.log("Sender Role:", message.senderRole);
if (order) {

  let receiverId;
  let receiverRole;


  // If sender is contractor, notify supplier
  if (message.senderRole === "contractor") {

    receiverId = order.supplierId;
    receiverRole = "supplier";

  }


  // If sender is supplier, notify contractor
  if (message.senderRole === "supplier") {

    receiverId = order.contractorId;
    receiverRole = "contractor";

  }



  if (receiverId) {

console.log("Receiver ID:", receiverId);
console.log("Receiver Role:", receiverRole);

await Notification.create({

  id: Date.now(),

  userId: Number(receiverId),

  role: receiverRole,

  type: "chat",

  orderId: order.id,

  message:
    message.senderRole === "contractor"
      ? `💬 New message from ${order.contractorName || "Contractor"}`
      : `💬 New message from ${order.supplierName || "Supplier"}`,

  read: false,

  createdAt: new Date(),

});

}

}


  const chatIndex = chats.findIndex(
    (item) =>
      String(item.orderId) === orderId
  );



  if(chatIndex === -1){


    chats.push({

      orderId,

      messages:[
        message
      ]

    });


  } else {


    chats[chatIndex].messages.push(message);


  }





  // ==========================
  // ADD DELIVERY FEE TO ORDER
  // ==========================


  if (message.type === "delivery_fee") {

  if (order) {

    order.deliveryFee = Number(message.amount);

    order.totalAmount =
      Number(order.amount || 0) +
      Number(message.amount);

    await order.save();

    // ==========================
    // Notify Contractor
    // ==========================

    

    
    await Notification.create({

  id: Date.now(),

  userId: Number(order.contractorId),

  role: "contractor",

  type: "delivery_fee",

  orderId: order.id,

  message:
    `🚚 ${order.supplierName} requested a delivery fee of ${message.amount} USDC`,

  read: false,

  createdAt: new Date(),

});

  }

}

saveChats(chats);

res.json({
  success: true,
  message
});
});
 // ===============================
// WALLET BALANCE
// ===============================

app.get("/wallet/balance", async (req, res) => {

  try {

    const balance = await checkUSDCBalance();

    res.json(balance);

  } catch (error) {

    console.error(
      "Wallet balance error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet balance",
    });

  }
 });


// ===============================
// AI ASSISTANT
// ===============================

app.post("/ai-assistant", (req, res) => {

  const { message, userType, user } = req.body;


  const suppliers = getSuppliers();
  const orders = getOrders();


  const question = message.toLowerCase();



  let reply = "";



  // ==========================
  // SUPPLIER COUNT
  // ==========================

  if(
    question.includes("how many suppliers") ||
    question.includes("number of suppliers") ||
    question.includes("suppliers do we have")
  ){


    reply = `
🏗 Supplier Overview


Total Suppliers:
${suppliers.length}


${suppliers.map((supplier,index)=>`

${index + 1}. ${supplier.companyName}

⭐ Trust Score:
${supplier.trustScore || 95}/100

Materials:
${
supplier.materials
?.map(item=>item.name)
.join(", ")
}

`).join("")}

`;

  }




// ==========================
// CHEAPEST SUPPLIER
// ==========================

else if(
  question.includes("cheapest") ||
  question.includes("lowest price") ||
  question.includes("best price")
){

  let requestedMaterial = null;


  if(question.includes("cement")){
    requestedMaterial = "cement";
  }

  else if(question.includes("steel")){
    requestedMaterial = "steel";
  }

  else if(
    question.includes("block") ||
    question.includes("blocks")
  ){
    requestedMaterial = "blocks";
  }



  let cheapest = null;



  suppliers.forEach((supplier)=>{


    supplier.materials?.forEach((material)=>{


      const materialName =
      material.name.toLowerCase();



      if(
        requestedMaterial &&
        !materialName.includes(requestedMaterial)
      ){
        return;
      }



      if(
        !cheapest ||
        Number(material.price) <
        Number(cheapest.price)
      ){

        cheapest = {

          supplier:
          supplier.companyName,

          material:
          material.name,

          price:
          material.price,

          trustScore:
          supplier.trustScore || 95

        };

      }


    });


  });



  if(cheapest){

    reply = `
🏆 Cheapest Supplier Recommendation


Supplier:
${cheapest.supplier}


Material:
${cheapest.material}


Price:
${cheapest.price} USDC/unit


Trust Score:
${cheapest.trustScore}/100


AI Recommendation:
This supplier offers the best available price for this material.

`;

  }


}




  // ==========================
  // PRICE INFORMATION
  // ==========================


  else if(
    question.includes("price") ||
    question.includes("cost") ||
    question.includes("expensive")
  ){


    let priceList = "";


    suppliers.forEach((supplier)=>{


      priceList += `

${supplier.companyName}

`;

      supplier.materials?.forEach((item)=>{


        priceList +=
        `${item.name}: ${item.price} USDC/unit\n`;


      });


    });



    reply = `
💰 Current Material Prices


${priceList}


`;

  }





  // ==========================
  // TRUSTED SUPPLIERS
  // ==========================


  else if(
    question.includes("trusted") ||
    question.includes("verified")
  ){


    const trusted =
    suppliers.filter(
      supplier =>
      supplier.trusted === true ||
      Number(supplier.trustScore) >= 80
    );



    reply = `
⭐ Trusted Suppliers


${trusted.map((supplier)=>`

${supplier.companyName}

Trust Score:
${supplier.trustScore || 95}/100

`).join("")}

`;

  }





  // ==========================
  // ORDERS
  // ==========================


  else if(
    question.includes("order")
  ){


    let myOrders = orders;



    if(user){

      if(userType==="contractor"){

        myOrders =
        orders.filter(
          order =>
          Number(order.contractorId) ===
          Number(user.id)
        );

      }



      if(userType==="supplier"){

        myOrders =
        orders.filter(
          order =>
          Number(order.supplierId) ===
          Number(user.id)
        );

      }

    }



    reply = `
📦 Order Summary


Total Orders:
${myOrders.length}


Completed:
${
myOrders.filter(
order=>order.status==="Completed"
).length
}


Pending:
${
myOrders.filter(
order=>order.status==="Pending"
).length
}

`;

  }





  // ==========================
  // PAYMENTS
  // ==========================


  else if(
    question.includes("payment") ||
    question.includes("paid") ||
    question.includes("spent")
  ){


    const paid =
    orders
    .filter(
      order =>
      order.paymentStatus==="Paid"
    )
    .reduce(
      (sum,order)=>
      sum +
      Number(order.totalAmount || 0),
      0
    );



    reply = `
💳 Payment Summary


Completed Payments:

${paid.toFixed(5)} USDC


Transactions:

${
orders.filter(
order=>order.paymentStatus==="Paid"
).length
}

`;

  }





  // ==========================
  // SAVINGS
  // ==========================


  else if(
    question.includes("save") ||
    question.includes("saving")
  ){


    const saved =
    orders.reduce(
      (sum,order)=>
      sum +
      Number(order.savings || 0),
      0
    );



    reply = `
💰 Procurement Savings


You have saved:


${saved.toFixed(5)} USDC


through AI supplier comparison.

`;

  }





  // ==========================
  // MATERIALS
  // ==========================


  else if(
    question.includes("material")
  ){


    const materials =
    suppliers.flatMap(
      supplier =>
      supplier.materials?.map(
        item=>item.name
      ) || []
    );



    reply = `
🏗 Available Materials


${
[...new Set(materials)].join(", ")
}

`;

  }





  // ==========================
  // DEFAULT
  // ==========================


  else {


    reply = `
🤖 BuildProcure AI Assistant


I can help with:


✅ Cheapest supplier

✅ Supplier information

✅ Trusted suppliers

✅ Material prices

✅ Orders

✅ Payments

✅ Savings


Try asking:

"Who is the cheapest cement supplier?"

"How many suppliers do we have?"

"Show trusted suppliers"

"Tell me about prices"

"How much did I save?"

`;

  }




  res.json({
    reply
  });


});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {

    console.log("✅ MongoDB Connected");

    console.log(
      "CONNECTED DATABASE:",
      mongoose.connection.name
    );

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });

  })
  .catch((err) => {

    console.error(
      "MongoDB Error:",
      err
    );

  });