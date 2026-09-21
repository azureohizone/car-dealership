const nodemailer = require('nodemailer');

// In-memory store for recent dispatched emails for instant in-app portfolio preview
const recentDispatchedEmails = [];

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const cleanPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    if (process.env.SMTP_SERVICE) {
      // e.g. SMTP_SERVICE=gmail
      transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPass
        }
      });
    } else if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPass
        }
      });
    }
  }

  if (!transporter) {
    // Generate test account automatically for local development / portfolio demonstration
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[EmailService] Ethereal test mailbox initialized: ${testAccount.user}`);
    } catch (err) {
      console.warn('[EmailService] Failed to create Ethereal account, using fallback json transporter', err.message);
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporter;
}

function generateLuxuryEmailHtml({ order, customer, vehicle, garage }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(order.price);

  const purchaseDateStr = new Date(order.purchaseDate || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Legendary Motors — Purchase Confirmation ${order.orderNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0b0e;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e5e7eb;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 640px;
      margin: 30px auto;
      background-color: #121217;
      border: 1px solid #272732;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(229, 9, 20, 0.15);
    }
    .header {
      background: linear-gradient(180deg, #1f1416 0%, #121217 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 2px solid #e50914;
      position: relative;
    }
    .brand-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 11px;
      letter-spacing: 3px;
      color: #e50914;
      margin-top: 6px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge {
      display: inline-block;
      background-color: rgba(229, 9, 20, 0.15);
      border: 1px solid #e50914;
      color: #ff4d4d;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      padding: 6px 14px;
      border-radius: 999px;
      text-transform: uppercase;
      margin-top: 14px;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 18px;
      color: #ffffff;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .lead-text {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .card {
      background-color: #17171e;
      border: 1px solid #2d2d3a;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #e50914;
      text-transform: uppercase;
      margin-top: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
    }
    .vehicle-img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 16px;
      border: 1px solid #2d2d3a;
    }
    .vehicle-name {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    .vehicle-price {
      font-size: 24px;
      font-weight: 900;
      color: #22c55e;
      margin: 0 0 16px 0;
    }
    .specs-grid {
      display: table;
      width: 100%;
      margin-top: 12px;
      border-top: 1px solid #262633;
      padding-top: 12px;
    }
    .spec-row {
      display: table-row;
    }
    .spec-cell {
      display: table-cell;
      padding: 6px 0;
      font-size: 13px;
    }
    .spec-label {
      color: #6b7280;
      width: 45%;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
    }
    .spec-value {
      color: #e5e7eb;
      font-weight: 600;
    }
    .garage-highlight {
      background: linear-gradient(135deg, #181419 0%, #17171e 100%);
      border-left: 4px solid #e50914;
      padding: 16px;
      border-radius: 4px;
    }
    .garage-name {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px 0;
    }
    .garage-location {
      font-size: 13px;
      color: #9ca3af;
      margin: 0 0 8px 0;
    }
    .security-tag {
      display: inline-block;
      background-color: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #4ade80;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .order-meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .order-meta-table td {
      padding: 8px 0;
      font-size: 13px;
      border-bottom: 1px solid #23232e;
    }
    .footer {
      background-color: #0b0b0e;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #22222c;
      font-size: 11px;
      color: #6b7280;
      line-height: 1.6;
    }
    .footer strong {
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">LEGENDARY MOTORS</h1>
      <div class="brand-subtitle">PREMIUM VEHICLES &bull; CAMBODIA VAULTS &bull; DIGITAL OWNERSHIP</div>
      <div class="badge">Official Acquisition Deed</div>
    </div>

    <div class="content">
      <div class="greeting">Hello ${customer.name || 'Esteemed Collector'},</div>
      <p class="lead-text">
        Thank you for purchasing from <strong>Legendary Motors</strong>. Your transaction has been approved and registered on our high-security collector registry. Below are the full details and storage coordinates of your new vehicle.
      </p>

      <!-- VEHICLE CARD -->
      <div class="card">
        <div class="card-title">&#9670; PURCHASED VEHICLE</div>
        ${vehicle.image || (vehicle.images && vehicle.images[0]) ? `
          <img src="${vehicle.image || vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-img" />
        ` : ''}
        <h2 class="vehicle-name">${vehicle.brand} ${vehicle.model}</h2>
        <div class="vehicle-price">${formattedPrice}</div>

        <div class="specs-grid">
          <div class="spec-row">
            <div class="spec-cell spec-label">Order ID</div>
            <div class="spec-cell spec-value">${order.orderNumber}</div>
          </div>
          <div class="spec-row">
            <div class="spec-cell spec-label">Acquisition Date</div>
            <div class="spec-cell spec-value">${purchaseDateStr}</div>
          </div>
          ${vehicle.engine || (vehicle.specifications && vehicle.specifications.engine) ? `
          <div class="spec-row">
            <div class="spec-cell spec-label">Engine Architecture</div>
            <div class="spec-cell spec-value">${vehicle.engine || vehicle.specifications.engine}</div>
          </div>
          ` : ''}
          ${vehicle.horsepower || (vehicle.specifications && vehicle.specifications.horsepower) ? `
          <div class="spec-row">
            <div class="spec-cell spec-label">Output Power</div>
            <div class="spec-cell spec-value">${vehicle.horsepower || vehicle.specifications.horsepower} HP</div>
          </div>
          ` : ''}
          ${vehicle.topSpeed || (vehicle.specifications && vehicle.specifications.topSpeed) ? `
          <div class="spec-row">
            <div class="spec-cell spec-label">Top Velocity</div>
            <div class="spec-cell spec-value">${vehicle.topSpeed || vehicle.specifications.topSpeed}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- GARAGE CARD -->
      <div class="card">
        <div class="card-title">&#9670; CAMBODIA VAULT & STORAGE ASSIGNMENT</div>
        <div class="garage-highlight">
          <div class="garage-name">${garage.name}</div>
          <div class="garage-location">${garage.locationDescription || garage.city + ', Cambodia'}</div>
          <div class="security-tag">&#10003; ${garage.securityInformation || '24/7 Armed Guard & Climate Control'}</div>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin: 12px 0 0 0; line-height: 1.5;">
          Your vehicle is securely parked in your allocated climate-controlled bay. You can schedule VIP inspection, vehicle relocation, or track-day transport anytime through your <strong>My Garage</strong> dashboard.
        </p>
      </div>

      <!-- SUMMARY META -->
      <div class="card" style="margin-bottom: 0;">
        <div class="card-title">&#9670; TRANSACTION OVERVIEW</div>
        <table class="order-meta-table">
          <tr>
            <td style="color: #6b7280; text-transform: uppercase; font-size: 11px;">Customer Email</td>
            <td style="text-align: right; color: #ffffff; font-weight: 600;">${customer.email}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; text-transform: uppercase; font-size: 11px;">Total Amount Paid</td>
            <td style="text-align: right; color: #22c55e; font-weight: 700;">${formattedPrice} (Simulated)</td>
          </tr>
          <tr>
            <td style="color: #6b7280; text-transform: uppercase; font-size: 11px;">Status</td>
            <td style="text-align: right; color: #38bdf8; font-weight: 600;">Secured in Vault &bull; Registered</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>LEGENDARY MOTORS PRIVATE VAULTS &bull; CAMBODIA</strong></p>
      <p style="margin: 0 0 10px 0;">This email serves as your official digital deed of acquisition for portfolio simulation.</p>
      <p style="margin: 0; font-size: 10px; color: #4b5563;">&copy; 2026 Legendary Motors Inc. All Rights Reserved. Inspired by GTA V Motorsport aesthetic.</p>
    </div>
  </div>
</body>
</html>
  `;
}

async function sendOrderConfirmationEmail({ order, customer, vehicle, garage }) {
  try {
    const mailTransporter = await getTransporter();
    const htmlContent = generateLuxuryEmailHtml({ order, customer, vehicle, garage });
    const fromAddress = process.env.SMTP_FROM || (process.env.SMTP_USER ? `"Legendary Motors" <${process.env.SMTP_USER}>` : '"Legendary Motors" <concierge@legendarymotors.vip>');

    const mailOptions = {
      from: fromAddress,
      to: customer.email,
      subject: `Legendary Motors — Purchase Confirmation #${order.orderNumber}`,
      text: `Thank you for purchasing from Legendary Motors.\n\n` +
        `PURCHASE DETAILS\n` +
        `Vehicle: ${vehicle.brand} ${vehicle.model}\n` +
        `Price: $${order.price.toLocaleString()}\n` +
        `Order ID: ${order.orderNumber}\n\n` +
        `GARAGE ASSIGNMENT\n` +
        `${garage.name}\n` +
        `${garage.locationDescription || garage.city + ', Cambodia'}\n\n` +
        `Your vehicle has been assigned to your selected garage.\n` +
        `Thank you for choosing Legendary Motors.`,
      html: htmlContent
    };

    const info = await mailTransporter.sendMail(mailOptions);
    const etherealUrl = nodemailer.getTestMessageUrl(info);

    const emailRecord = {
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      to: customer.email,
      recipientName: customer.name || 'Valued Collector',
      subject: mailOptions.subject,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      garageName: garage.name,
      price: order.price,
      sentAt: new Date(),
      etherealUrl: etherealUrl || null,
      messageId: info.messageId,
      htmlContent
    };

    recentDispatchedEmails.unshift(emailRecord);
    if (recentDispatchedEmails.length > 50) {
      recentDispatchedEmails.pop();
    }

    console.log(`[EmailService] Confirmation email successfully sent to ${customer.email} for order ${order.orderNumber}`);
    if (etherealUrl) {
      console.log(`[EmailService] Ethereal Preview URL: ${etherealUrl}`);
    }

    return {
      success: true,
      previewUrl: etherealUrl,
      messageId: info.messageId,
      htmlContent
    };
  } catch (error) {
    console.error('[EmailService] Error sending purchase confirmation email:', error);
    // Still record to in-memory store so user can inspect it in UI
    const fallbackHtml = generateLuxuryEmailHtml({ order, customer, vehicle, garage });
    recentDispatchedEmails.unshift({
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      to: customer.email,
      recipientName: customer.name || 'Valued Collector',
      subject: `Legendary Motors — Purchase Confirmation #${order.orderNumber}`,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      garageName: garage.name,
      price: order.price,
      sentAt: new Date(),
      etherealUrl: null,
      htmlContent: fallbackHtml
    });

    return {
      success: false,
      error: error.message,
      htmlContent: fallbackHtml
    };
  }
}

function getRecentEmails() {
  return recentDispatchedEmails;
}

module.exports = {
  sendOrderConfirmationEmail,
  generateLuxuryEmailHtml,
  getRecentEmails
};
