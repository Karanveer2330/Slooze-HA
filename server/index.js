require("dotenv").config();
const express = require('express')
const app = express()
const cors = require("cors");
const pool = require("./db");
const authorization = require("./middleware/authorization");


const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.post("/logins",async(req,res)=>{
try{
const {user_name,user_email,user_password,adr,adr1,city,state,zip,user_lname} = req.body;
const newLogins = await pool.query("INSERT INTO logins(user_name,user_email,user_password,adr,adr1,city,state,zip,user_lname) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
[user_name,user_email,user_password,adr,adr1,city,state,zip,user_lname]);
res.json(newLogins);
}catch(err){
    console.error(err.message);
}
});

app.post("/menu", authorization, async(req,res)=>{
  try{
    if (!req.user || !req.user.user) {
      return res.status(403).json({ error: "Authorization denied. Please authenticate first." });
    }

    const {name,ing,size,count,price} = req.body;
    const userId = req.user.user;
    
    if (!name || !ing || !size || !count || price === undefined) {
      return res.status(400).json({ error: "Missing required fields: name, ing, size, count, price" });
    }
    
    const newMenu = await pool.query("INSERT INTO menu(name,ing,size,count,price,user_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
    [name,ing,size,count,price,userId]);
    res.json(newMenu.rows[0]);
  }catch(err){
      console.error(err.message);
      res.status(500).json({ error: err.message || "Server error" });
  }
  });
  
  
  app.post("/food",async(req,res)=>{
    try{

    const newFood = await pool.query("INSERT INTO food(name,ing,size,count,price) SELECT name,ing,size,count,price FROM menu;");
    res.json(newFood);
    }catch(err){
        console.error(err.message);
    }
    });
  
    
  app.post("/busi",async (req,res)=>{
    try{

      const {bname,description,pic,location} = req.body;
    const newBusi = await pool.query("INSERT INTO busi(bname,description,pic,location) VALUES($1,$2,$3,$4) RETURNING *;",
    [bname,description,pic,location]
   );
    res.json(newBusi);
    }catch(err){
        console.error(err.message);
    }
    });
    app.post("/items",async (req,res)=>{
      try{
  
        const {fname,f_ing,f_img,f_price} = req.body;
      const newItems = await pool.query("INSERT INTO items(fname,f_ing,f_img,f_price) VALUES($1,$2,$3,$4) RETURNING *;",
      [fname,f_ing,f_img,f_price]
     );
      res.json(newItems);
      }catch(err){
          console.error(err.message);
      }
      });
app.get("/menu", authorization, async(req,res)=>{
try {
  const userId = req.user.user;
  const userRole = (req.user.role || 'member').toLowerCase();
  const userCountry = req.user.country || 'India';
  
  let query;
  let params;
  
  if (userRole === 'admin') {
    query = `
      SELECT m.*, l.user_name, l.country as user_country
      FROM menu m 
      LEFT JOIN logins l ON m.user_id = l.user_id 
      ORDER BY l.country, m.id DESC
    `;
    params = [];
  } 
  else if (userRole === 'manager') {
    const managerInfo = await pool.query(
      "SELECT country FROM logins WHERE user_id = $1",
      [userId]
    );
    
    const dbCountry = managerInfo.rows[0]?.country;
    
    if (!dbCountry) {
      return res.status(500).json({ error: "Manager country not set in database" });
    }
    
    query = `
      SELECT m.*, l.user_name, l.country as user_country
      FROM menu m 
      INNER JOIN logins l ON m.user_id = l.user_id 
      WHERE l.country = $1
      ORDER BY m.id DESC
    `;
    params = [dbCountry];
    
    const allMenu = await pool.query(query, params);
    return res.json(allMenu.rows);
  } 
  else {
    query = `
      SELECT m.*, l.user_name, l.country as user_country
      FROM menu m 
      LEFT JOIN logins l ON m.user_id = l.user_id 
      WHERE m.user_id = $1 
      ORDER BY m.id DESC
    `;
    params = [userId];
  }
  
  if (userRole !== 'manager') {
    const allMenu = await pool.query(query, params);
    res.json(allMenu.rows);
  }
} catch (err) {
  console.error('GET /menu error:', err.message);
  res.status(500).json({ error: err.message || "Server error" });
}
});

app.get("/items", async(req,res)=>{
  try {
    const allItems = await pool.query("SELECT * FROM items");
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message)
  }
  });

app.get("/food", async(req,res)=>{
  try {
    const allFood = await pool.query("SELECT * FROM food");
    res.json(allFood.rows);
  } catch (err) {
    console.error(err.message)
  }
  });
  app.get("/logins", async(req,res)=>{
    try {
      const alllogin = await pool.query("SELECT * FROM logins");
      res.json(alllogin.row[4]);
    } catch (err) {
      console.error(err.message)
    }
    });
app.get("/users/:email",async(req,res)=>{
try {
 const {email}=req.params;
 const users = await pool.query("SELECT * FROM resert WHERE email=$1",[email]);
res.json(users.rows[0])
} catch (err) {
  console.error(err.message)
  
}
})


app.put("/users/:email", async(req,res)=>{
try {
  const {email} = req.params
  const {fname, lname,password,adr,adr2,city,state,zip}= req.body;
const updateUsers = await pool.query("UPDATE resert SET password =$1 WHERE email =$2",[password,email])
res.json("updated")
} catch (err) {
  console.error(err.message)
  
}
})

app.delete("/menu/:id", authorization, async(req,res)=>{
try {
 const {id}= req.params;
 const userId = req.user.user;
 const userRole = req.user.role || 'member';
 
 // Check if user owns the item or is admin/manager
 let query;
 let params;
 
 if (userRole === 'admin' || userRole === 'manager') {
   query = "DELETE FROM menu WHERE id = $1 RETURNING *";
   params = [id];
 } else {
   query = "DELETE FROM menu WHERE id = $1 AND user_id = $2 RETURNING *";
   params = [id, userId];
 }
 
 const deleteResult = await pool.query(query, params);
 
 if (deleteResult.rows.length === 0) {
   return res.status(404).json({ error: "Item not found or you don't have permission" });
 }
 
 res.json({ message: "DELETED" });
} catch (err) {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Server error" });
}
})


app.delete("/food/:id",async(req,res)=>{
  try {
   const {id}= req.params;
  
   const deleteUsers = await pool.query("DELETE FROM food WHERE id =$1",[id]) 
  res.json("DELETED");
  } catch (err) {
    console.error(err.message)
    
  }
  })
  
  
  app.use("/authentication", require("./Routes/jwtAuth"));
  app.use("/dashboard", require("./Routes/dashboard"));
  app.use("/api/orders", require("./Routes/orders"));
  app.use("/api/payment-methods", require("./Routes/paymentMethods"));
  app.use("/api/restaurants", require("./Routes/restaurants"));
  app.use("/api/food-items", require("./Routes/foodItems"));
  app.use("/api/users", require("./Routes/users"));
  app.use("/api/dashboard", require("./Routes/dashboardStats"));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (err) {
    console.error(err.message)
  }
  });

app.get("/food", async(req,res)=>{
  try {
    const allFood = await pool.query("SELECT * FROM food");
    res.json(allFood.rows);
  } catch (err) {
    console.error(err.message)
  }
  });
  app.get("/logins", async(req,res)=>{
    try {
      const alllogin = await pool.query("SELECT * FROM logins");
      res.json(alllogin.row[4]);
    } catch (err) {
      console.error(err.message)
    }
    });
app.get("/users/:email",async(req,res)=>{
try {
 const {email}=req.params;
 const users = await pool.query("SELECT * FROM resert WHERE email=$1",[email]);
res.json(users.rows[0])
} catch (err) {
  console.error(err.message)
  
}
})


app.put("/users/:email", async(req,res)=>{
try {
  const {email} = req.params
  const {fname, lname,password,adr,adr2,city,state,zip}= req.body;
const updateUsers = await pool.query("UPDATE resert SET password =$1 WHERE email =$2",[password,email])
res.json("updated")
} catch (err) {
  console.error(err.message)
  
}
})

app.delete("/menu/:id", authorization, async(req,res)=>{
try {
 const {id}= req.params;
 const userId = req.user.user;
 const userRole = req.user.role || 'member';
 
 // Check if user owns the item or is admin/manager
 let query;
 let params;
 
 if (userRole === 'admin' || userRole === 'manager') {
   query = "DELETE FROM menu WHERE id = $1 RETURNING *";
   params = [id];
 } else {
   query = "DELETE FROM menu WHERE id = $1 AND user_id = $2 RETURNING *";
   params = [id, userId];
 }
 
 const deleteResult = await pool.query(query, params);
 
 if (deleteResult.rows.length === 0) {
   return res.status(404).json({ error: "Item not found or you don't have permission" });
 }
 
 res.json({ message: "DELETED" });
} catch (err) {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Server error" });
}
})


app.delete("/food/:id",async(req,res)=>{
  try {
   const {id}= req.params;
  
   const deleteUsers = await pool.query("DELETE FROM food WHERE id =$1",[id]) 
  res.json("DELETED");
  } catch (err) {
    console.error(err.message)
    
  }
  })
  
  
  app.use("/authentication", require("./Routes/jwtAuth"));
  app.use("/dashboard", require("./Routes/dashboard"));
  app.use("/api/orders", require("./Routes/orders"));
  app.use("/api/payment-methods", require("./Routes/paymentMethods"));
  app.use("/api/restaurants", require("./Routes/restaurants"));
  app.use("/api/food-items", require("./Routes/foodItems"));
  app.use("/api/users", require("./Routes/users"));
  app.use("/api/dashboard", require("./Routes/dashboardStats"));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});