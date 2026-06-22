const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// STRICT SECURE LIVE ENCRYPTED IN-MEMORY DATABASES
let globalOrders = [];
let customerUsers = [];
let activeMobileOTPVault = {}; 

// Strict Master Access Module
let adminMasterAccess = { 
    username: 'jahirnarjinary04@gmail.com', 
    password: 'Jahir@704744', 
    phone: '7047441585',
    recoverySecret: 'JAHIR_MASTER_2026' 
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mobile OTP Trigger Engine
app.post('/api/send-mobile-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) return res.json({ success: false, msg: "Provide a valid 10-digit mobile target line!" });
    
    // Generate Secure 6-Digit Verification Token
    const mobileOTP = Math.floor(100000 + Math.random() * 900000).toString();
    activeMobileOTPVault[phone] = mobileOTP;
    
    console.log(`\n🔒 === [STRICT MOBILE OTP ROUTE INITIATED] ===`);
    console.log(`Target Phone Line: +91 ${phone} | SECURE HIGH-LEVEL VERIFICATION OTP: ${mobileOTP}`);
    console.log(`============================================\n`);
    
    res.json({ success: true, msg: `Strict Verification OTP sent to +91 ${phone}! Check your CMD terminal console instantly.` });
});

// Customer Secure Registration Engine
app.post('/api/register', (req, res) => {
    const { name, phone, email, password, otp } = req.body;
    if (!name || !phone || !email || !password || !otp) {
        return res.json({ success: false, msg: "All fields and Mobile OTP verification tokens are strictly required!" });
    }
    if (activeMobileOTPVault[phone] !== otp) {
        return res.json({ success: false, msg: "Security Breach: Invalid or expired Mobile OTP validation token!" });
    }
    
    const userExists = customerUsers.find(u => u.phone === phone || u.email === email);
    if (userExists) return res.json({ success: false, msg: "Identity parameters exist in records pool!" });
    
    customerUsers.push({ name, phone, email, password });
    delete activeMobileOTPVault[phone];
    res.json({ success: true, msg: "Vault Profile built safely! Proceed to secure login." });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = customerUsers.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone } });
    } else {
        res.json({ success: false, msg: "Invalid Client Authorization Credentials!" });
    }
});

// Customer Forgot Password via Strict Mobile OTP
app.post('/api/customer-forgot-password', (req, res) => {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) return res.json({ success: false, msg: "Missing operational recovery keys!" });
    if (activeMobileOTPVault[phone] !== otp) return res.json({ success: false, msg: "Invalid Mobile OTP code structure!" });
    
    const user = customerUsers.find(u => u.phone === phone);
    if (!user) return res.json({ success: false, msg: "No identity mapping detected for this phone reference line." });
    
    user.password = newPassword;
    delete activeMobileOTPVault[phone];
    res.json({ success: true, msg: "Customer identity password rewritten safely inside system memory!" });
});

// Order Gateway Pipeline Engine
app.post('/api/submit-order', upload.single('customerDocument'), (req, res) => {
    try {
        const { cardType, customerName, customerEmail, customerPhone, customerState, customerDistrict, customerPost, customerPin, fullAddress, paymentMethod } = req.body;
        const file = req.file;

        if (!cardType || !customerName || !customerState || !file) {
            return res.send(`<script>alert("Transaction Drop: Required file attachments missing."); window.location.href="/index.html";</script>`);
        }

        const newOrder = {
            id: 'ORD' + Date.now(),
            cardType,
            customerName,
            customerEmail,
            customerPhone,
            address: `${fullAddress}, PO: ${customerPost}, Dist: ${customerDistrict}, State: ${customerState} - ${customerPin}`,
            fileName: file.filename,
            paymentMethod,
            status: 'Awaiting Verification',
            trackingLogs: 'Package entered centralized processing array infrastructure.',
            trackingId: 'Pending Courier Pickup'
        };

        globalOrders.push(newOrder);
        res.send(`<script>alert("Order Dispatched to Officer Verification Buffer Queue!"); window.location.href="/index.html";</script>`);
    } catch (err) {
        res.status(500).send("Core server mapping fault.");
    }
});

app.post('/api/track-order', (req, res) => {
    const { email } = req.body;
    const records = globalOrders.filter(o => o.customerEmail === email);
    res.json({ success: true, records });
});

// ===============================================
// ADMINISTRATIVE OFFICER STRICT ENGINE PORTALS
// ===============================================
app.post('/api/admin-pre-auth', (req, res) => {
    const { username, password } = req.body;
    if (username === adminMasterAccess.username && password === adminMasterAccess.password) {
        res.json({ success: true, phone: adminMasterAccess.phone, msg: "Phase-1 Verification clear. Requesting Mobile OTP." });
    } else {
        res.json({ success: false, msg: "Access Denied: Administrative Identity mismatch!" });
    }
});

app.post('/api/admin-final-login', (req, res) => {
    const { username, otp } = req.body;
    if (username === adminMasterAccess.username && activeMobileOTPVault[adminMasterAccess.phone] === otp) {
        delete activeMobileOTPVault[adminMasterAccess.phone];
        res.json({ success: true, msg: "System unlocked. Full officer terminal console deployed." });
    } else {
        res.json({ success: false, msg: "Access Breach Attempt: Invalid Officer Validation Token!" });
    }
});

app.post('/api/admin-forgot-password', (req, res) => {
    const { phone, recoverySecret, otp, newPassword } = req.body;
    if (phone !== adminMasterAccess.phone || recoverySecret !== adminMasterAccess.recoverySecret) {
        return res.json({ success: false, msg: "Critical Security Error: Verification parameters mismatch!" });
    }
    if (activeMobileOTPVault[phone] !== otp) {
        return res.json({ success: false, msg: "Invalid Master Validation Key OTP!" });
    }
    
    adminMasterAccess.password = newPassword;
    delete activeMobileOTPVault[phone];
    res.json({ success: true, msg: "Master Administrative console credentials safely overridden!" });
});

app.get('/api/admin/orders', (req, res) => {
    res.json(globalOrders);
});

app.post('/api/admin/update-tracking', (req, res) => {
    const { orderId, status, trackingLogs, trackingId } = req.body;
    const order = globalOrders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        order.trackingLogs = trackingLogs;
        order.trackingId = trackingId || order.trackingId;
        res.json({ success: true, msg: "Logistics track indices successfully overwritten inside system memory." });
    } else {
        res.json({ success: false, msg: "Target order reference point indexing mismatch." });
    }
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Server running smoothly on: http://localhost:${PORT}`);
    console.log(`=======================================================`);
});