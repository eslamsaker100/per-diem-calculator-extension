const policyLimit = 180;

function createDestinationRow() {
  const row = document.createElement('div');
  row.className = 'destination-row';
  row.innerHTML = `
    <label>Destination:</label>
    <select class="destination">
      <option value="150">Dubai - $150/day</option>
      <option value="200">New York - $200/day</option>
      <option value="180">London - $180/day</option>
      <option value="170">Paris - $170/day</option>
      <option value="120">Cairo - $120/day</option>
      <option value="140">Riyadh - $140/day</option>
      <option value="160">Doha - $160/day</option>
      <option value="175">Singapore - $175/day</option>
    </select>

    <label>Per Diem Rate:</label>
    <input type="number" class="rate" value="150" min="1" placeholder="Rate">

    <label>Days:</label>
    <input type="number" class="days" value="1" min="1" placeholder="Days">

    <button class="save-fav">Save Favorite</button>
    <button class="remove-row">Remove</button>
  `;
  row.querySelector('.destination').addEventListener('change', e =>
    row.querySelector('.rate').value = e.target.value);
  row.querySelector('.remove-row').addEventListener('click', () => row.remove());
  row.querySelector('.save-fav').addEventListener('click', () => saveFavorite(row.querySelector('.destination').value));
  return row;
}

function saveFavorite(value) {
  let favs = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favs.includes(value)) {
    favs.push(value);
    localStorage.setItem('favorites', JSON.stringify(favs));
    alert('Added to favorites!');
  } else {
    alert('Already in favorites.');
  }
}

function calculateTotal() {
  const currency = document.getElementById('currency').value;
  let total = 0;
  let overLimit = false;
  document.querySelectorAll('.destination-row').forEach(row => {
    const rate = parseFloat(row.querySelector('.rate').value);
    const days = parseInt(row.querySelector('.days').value);
    if (!isNaN(rate) && !isNaN(days) && rate > 0 && days > 0) {
      total += rate * days;
      if (rate > policyLimit) overLimit = true;
    }
  });
  document.getElementById('result').innerText = `Total Per Diem: ${currency}${total.toFixed(2)}`;
  document.getElementById('policy-warning').style.display = overLimit ? 'block' : 'none';
  localStorage.setItem('lastTotal', total);
}

document.getElementById('destinations-container').appendChild(createDestinationRow());
document.getElementById('add-destination').addEventListener('click', () =>
  document.getElementById('destinations-container').appendChild(createDestinationRow()));

document.getElementById('calculate').addEventListener('click', calculateTotal);
document.getElementById('export').addEventListener('click', () => {
  const content = `Total: ${document.getElementById('result').innerText}\nNotes: ${document.getElementById('notes').value}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'PerDiemEstimate.txt';
  link.click();
});
document.getElementById('print').addEventListener('click', () => window.print());
document.getElementById('toggle-dark').addEventListener('click', () => document.body.classList.toggle('dark'));
document.getElementById('copy-result').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('result').innerText);
  alert('Result copied to clipboard!');
});