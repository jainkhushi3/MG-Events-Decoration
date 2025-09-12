class adminController {

    static admin_dashboard = async(req, res) => {
        try {
            res.render("admin/admin_dashboard");
        } catch (error) {
            console.log(error);
            
        }
    }

}

module.exports = adminController;