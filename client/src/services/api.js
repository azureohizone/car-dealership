const API_BASE = '/api';

export async function fetchVehicles(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.minPrice) query.append('minPrice', params.minPrice);
  if (params.maxPrice) query.append('maxPrice', params.maxPrice);
  if (params.availability && params.availability !== 'All') query.append('availability', params.availability);
  if (params.sort) query.append('sort', params.sort);
  if (params.featured) query.append('featured', 'true');

  const res = await fetch(`${API_BASE}/vehicles?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/vehicles/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchVehicleById(id) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`);
  if (!res.ok) throw new Error('Failed to fetch vehicle');
  return res.json();
}

export async function fetchGarages() {
  const res = await fetch(`${API_BASE}/garages`);
  if (!res.ok) throw new Error('Failed to fetch garages');
  return res.json();
}

export async function fetchGarageById(id) {
  const res = await fetch(`${API_BASE}/garages/${id}`);
  if (!res.ok) throw new Error('Failed to fetch garage details');
  return res.json();
}

export async function createOrder(orderPayload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderPayload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to complete vehicle purchase');
  }
  return data;
}

export async function fetchCustomerGarage(email) {
  const cleanEmail = encodeURIComponent(email.trim().toLowerCase());
  const res = await fetch(`${API_BASE}/customers/${cleanEmail}/garage`);
  if (!res.ok) throw new Error('Failed to fetch customer garage fleet');
  return res.json();
}

export async function fetchRecentEmails() {
  const res = await fetch(`${API_BASE}/emails/recent`);
  if (!res.ok) throw new Error('Failed to fetch email logs');
  return res.json();
}

export async function fetchOrderByNumber(orderNumber) {
  const res = await fetch(`${API_BASE}/orders/by-number/${encodeURIComponent(orderNumber)}`);
  if (!res.ok) throw new Error('Failed to fetch order details');
  return res.json();
}
