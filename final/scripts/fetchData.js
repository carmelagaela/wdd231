// scripts/fetchData.js
export async function fetchMedications(url = 'data/medications.json') {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}