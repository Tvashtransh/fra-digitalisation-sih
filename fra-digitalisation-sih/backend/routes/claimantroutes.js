const express = require('express');
const Router = express.Router();
const {Signup,Login,Logout,getProfile,updateProfile}  = require("../controller/Auth");
const upload = require("../middlewares/upload");
const {createClaim,fileupload,getUserClaims,getClaimDetails,canSubmitClaim} = require("../controller/claim");
const { getCommunityStats } = require("../controller/statisticsController");
const verify = require('../middlewares/verifyclaimant');
const requireAuth = require('../middlewares/ClaimantAuth');
Router.post("/claim/upload-patta", upload.single("patta"),fileupload); 
Router.post('/create-claim',verify,createClaim);
Router.post('/claimant/register',Signup);
Router.post('/claimant/login',Login);
Router.post('/claimant/logout',Logout);

// Statistics routes
Router.get('/claimant/statistics', verify, getCommunityStats);
Router.get('/claimant/profile',verify,getProfile);
Router.put('/claimant/profile',verify,updateProfile);
Router.get('/claims',verify,getUserClaims);
Router.get('/claim/:claimId',verify,getClaimDetails);
Router.get('/claim-eligibility',verify,canSubmitClaim);
module.exports = Router;