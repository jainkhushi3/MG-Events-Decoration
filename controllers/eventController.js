const { pool } = require("../db/connectDB");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dnbp9iukb",
  api_key: "493671338579299",
  api_secret: "Eiofofuq9JxHS7NhTEAH3DZtXJ0",
});

class eventController{

    static add_event = async (req, res) => {
        try {
            res.render("events/add_event");
        } catch (error) {
            console.log(error);
        }  
    }  
    
    static create_event = async (req,res) => {
        try {
            const {event_name, event_description, base_price} = req.body;

            const file = req.files.event_file;
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
             folder: "MGEventManagement/events",
            });

            const sql = `INSERT INTO events (event_name, event_description, base_price, event_file_url, event_file_public_id) VALUES (?, ?, ?, ?, ?)`;

            const [result] = await pool.query(sql, [event_name, event_description, base_price, myCloud.secure_url, myCloud.public_id]);

            if (result.affectedRows > 0) {
                 return res.redirect("/");
            } else {
             return res.redirect("/add_event");
             console.log(error);
             
            }


        } catch (error) {
            console.log(error);
            
        }
    }
}

module.exports = eventController