const http = require('http');

async function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING LEGENDARY MOTORS API VERIFICATION ---');

  // 1. Fetch Vehicles
  const vehiclesRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/vehicles',
    method: 'GET'
  });
  console.log(`[Test 1] Fetch Vehicles: Status ${vehiclesRes.status}, Count: ${vehiclesRes.body.total}`);
  if (!vehiclesRes.body.data || vehiclesRes.body.data.length === 0) throw new Error('No vehicles found');

  const testVehicle = vehiclesRes.body.data.find(v => v.model === 'Revuelto') || vehiclesRes.body.data[0];
  console.log(`[Test 1] Selected Test Vehicle: ${testVehicle.brand} ${testVehicle.model} ($${testVehicle.price})`);

  // 2. Fetch Garages
  const garagesRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/garages',
    method: 'GET'
  });
  console.log(`[Test 2] Fetch Cambodia Garages: Status ${garagesRes.status}, Found: ${garagesRes.body.count}`);
  const testGarage = garagesRes.body.data.find(g => g.city === 'Phnom Penh') || garagesRes.body.data[0];
  const initialSlots = testGarage.availableSlots;
  console.log(`[Test 2] Selected Garage: ${testGarage.name} (Slots: ${initialSlots}/${testGarage.capacity})`);

  // 3. Perform Purchase (Create Order)
  console.log('\n[Test 3] Executing Simulated Purchase...');
  const orderRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, {
    vehicleId: testVehicle._id,
    garageId: testGarage._id,
    email: 'alexander.vance@legendarymotors.vip',
    name: 'Alexander Vance',
    phone: '+855 12 888 777'
  });

  console.log(`[Test 3] Order API Status: ${orderRes.status}`);
  console.log(`[Test 3] Order Success: ${orderRes.body.success}`);
  console.log(`[Test 3] Order Number: ${orderRes.body.data?.order?.orderNumber}`);
  console.log(`[Test 3] Email Dispatched: ${orderRes.body.data?.emailSent}`);

  if (!orderRes.body.success || !orderRes.body.data?.order?.orderNumber) {
    throw new Error('Order creation failed: ' + JSON.stringify(orderRes.body));
  }

  // 4. Verify Garage Capacity Reduced Atomically
  const updatedGarageRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: `/api/garages/${testGarage._id}`,
    method: 'GET'
  });
  const updatedSlots = updatedGarageRes.body.data.availableSlots;
  console.log(`[Test 4] Garage Slots Updated: Initial ${initialSlots} -> Updated ${updatedSlots}`);
  if (updatedSlots !== initialSlots - 1) {
    throw new Error(`Garage slot count mismatch: Expected ${initialSlots - 1}, got ${updatedSlots}`);
  }

  // 5. Verify Customer "My Garage" Fleet
  const fleetRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: `/api/customers/alexander.vance@legendarymotors.vip/garage`,
    method: 'GET'
  });
  console.log(`[Test 5] Customer Fleet Retrieved: Total Vehicles: ${fleetRes.body.totalVehicles}`);
  if (fleetRes.body.totalVehicles < 1) {
    throw new Error('Customer fleet did not register newly purchased vehicle');
  }

  // 6. Verify Email Dispatched Logs
  const emailRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/emails/recent',
    method: 'GET'
  });
  console.log(`[Test 6] Recent Sent Emails Count: ${emailRes.body.count}`);
  const latestEmail = emailRes.body.data[0];
  console.log(`[Test 6] Latest Sent Email: Subject "${latestEmail?.subject}" to ${latestEmail?.to}`);

  // 7. Error Handling: Invalid Email Test
  const invalidEmailRes = await makeRequest({
    hostname: 'localhost',
    port: 5001,
    path: '/api/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    vehicleId: testVehicle._id,
    garageId: testGarage._id,
    email: 'invalid-email-format'
  });
  console.log(`[Test 7] Invalid Email Rejected Properly: Status ${invalidEmailRes.status} (Message: "${invalidEmailRes.body.message}")`);
  if (invalidEmailRes.status !== 400) throw new Error('Invalid email was not rejected');

  console.log('\n--- ALL BACKEND & WORKFLOW TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
