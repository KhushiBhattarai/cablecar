const  isLoggedIn = (req,res,next)=> {
    if(req.isAuthenticated()) {
        next();
        res.redirect("/login");
    }
        
  }

  export default isLoggedIn



  