const bcrypt = require("bcrypt");
const { pool } = require("../db/connectDB");
const jwt = require("jsonwebtoken");

class userController {
  static home = async (req, res) => {
    try {
      res.render("home/home.ejs");
    } catch (error) {
      console.log(error);
    }
  };

  static signup = async (req, res) => {
    try {
      res.render("home/signup.ejs");
    } catch (error) {
      console.log(error);
    }
  };

  static signup_insert = async (req, res) => {
    try {
      const { user_role, name, email, phone, password } = req.body;
      console.log(req.body);
      if (user_role == "" || name == "" || email == "" || phone == "" || password == "") {
        req.flash("error", "All fields are required.");
        res.redirect("/signup");
      } else {
        const [user] = await pool.query(
          `SELECT * FROM users WHERE email = '${email}'`
        );

        if (user.length > 0) {
          req.flash("error", "User already exists...");
          res.redirect("/signup");
        } else {
          const hashPassword = await bcrypt.hash(password, 10); //bcrypt librabry -> hash function  and password is a parameter

          const sql = `INSERT INTO users( user_role, name, email, phone, password) VALUES(?, ?, ?, ?, ?)`;
          const saved = await pool.query(sql, [
            user_role,
            name,
            email,
            phone,
            hashPassword,
          ]);

          if (saved.length > 0) {
            req.flash("successMsg", "Registration Successful...");
            res.redirect("/login");
          } else {
            req.flash("error", "Something went wrong...");
            res.redirect("/signup");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("home/login.ejs");
    } catch (error) {
      console.log(error);
    }
  };

  static login_insert = async (req, res) => {
    try {
      const { email, password } = req.body;
    //   console.log(req.body);
      

      if (email == "" || password == "") {
        req.flash("error", "All fields are required.");
        res.redirect("/login");
      } else {
        // const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        const [user] = await pool.query(
          `SELECT * FROM users WHERE email = '${email}'`
        );
        //console.log(user)

        if (user.length > 0) {
          const isPasswordMatched = await bcrypt.compare(
            password,
            user[0].password
          );

          if (isPasswordMatched) {
            const token = jwt.sign(
              { userId: user[0].user_id },
              "HelloWorld....."
            ); //jwt secret key
            res.cookie("jwt", token);
            // console.log('generated token', token);
            if (user[0].user_role == "customer") {
              res.redirect("/user_dashboard");
            } else {
              res.redirect("/admin_dashboard");
            }
          } else {
            req.flash("error", "Incorrect Password...");
            res.redirect("/login");
          }
        } else {
          req.flash("error", "User not found...");
          res.redirect("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      // Get user role before destroying session
      const userRole = req.user?.user_role;

      // Clear JWT cookie with same options used when setting it
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Set cache-control headers
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      // Destroy session
      req.session.destroy((error) => {
        if (error) {
          console.error("Session destruction error:", error);
          // Role-based error fallback
          const redirectPath =
            userRole === "admin"
              ? "/admin_dashboard"
              : "/user_dashboard";
          return res.redirect(redirectPath);
        }

        // Role-specific logout landing pages if needed
        // (or use a unified login page as below)
        res.redirect("/login");

        // Alternative: Role-specific logout confirmation pages
        /*
                if (userRole === 'admin') {
                    res.redirect('/admin-logout');
                } else if (userRole === 'freelancer') {
                    res.redirect('/freelancer-logout');
                } else {
                    res.redirect('/client-logout');
                }
                */
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect based on original role
      const redirectPath =
        req.user?.role === "admin"
          ? "/admin_dashboard"
          : "/user_dashboard";
      res.redirect(redirectPath);
    }
  };

  static user_dashboard = async(req, res) => {
    try {
        res.render("home/user_dashboard");
    } catch (error) {
        console.log(error);
        
    }
  }
}

module.exports = userController;
