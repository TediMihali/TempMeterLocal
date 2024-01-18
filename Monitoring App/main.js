import './style.css'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, orderByChild, onValue } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfbqCGIL5zjFtl3XZ39uPAMmtklvqbyGM",
  authDomain: "temperature-humidity-mon-e21cb.firebaseapp.com",
  databaseURL: "https://temperature-humidity-mon-e21cb-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "temperature-humidity-mon-e21cb",
  storageBucket: "temperature-humidity-mon-e21cb.appspot.com",
  messagingSenderId: "682992713015",
  appId: "1:682992713015:web:944d95b61e0ad451dd2eb2",
  measurementId: "G-41NCKB8336"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const humidityPath = '1x';  // Assuming '1x' is your humidity data path
const temperaturePath = '1x';  // Assuming '1x' is your temperature data path

const humidityRef = ref(database, humidityPath);
const temperatureRef = ref(database, temperaturePath);

// Function to update the latest values
function updateLatestValues(snapshot) {
  const latestData = snapshot.val();
  const latestEntryKey = Object.keys(latestData)[Object.keys(latestData).length - 1];
  const latestEntry = latestData[latestEntryKey];

  // Update humidity and temperature values
  document.getElementById('humidity').textContent = latestEntry.humidity_value + "%";
  document.getElementById('temperature').textContent = latestEntry.temperature_value + "°C";
}


// Listen for changes in humidity and get the latest entry
onValue(humidityRef, (snapshot) => {
  updateLatestValues(snapshot);
});


// Listen for changes in temperature and update the table
onValue(temperatureRef, (snapshot) => {
  updateTable(snapshot);
});


function updateTable(snapshot) {
  const measurementsData = snapshot.val();
  const table = document.querySelector('.measurements-table');

  // Clear existing rows
  table.innerHTML = '<thead><th>Time: </th><th>Temperature: </th><th>Humidity: </th></thead>';

  // Get the last 10 measurements
  const lastMeasurements = Object.values(measurementsData).slice(-10).reverse();

  // Populate the table with the last 10 measurements
  lastMeasurements.forEach((measurement) => {
    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = measurement.time;
    cell2.textContent = measurement.temperature_value + "°C";
    cell3.textContent = measurement.humidity_value + "%";
  });
}

// Function to load more measurements
function loadMoreMeasurements() {
  // You can adjust the limit based on your requirement
  const newLimit = 10;
  const updatedTable = document.querySelector('.measurements-table');

  // Add more rows to the table
  const additionalMeasurements = Object.values(snapshot.val()).slice(-newLimit).reverse();

  additionalMeasurements.forEach((measurement) => {
    const row = updatedTable.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = measurement.time;
    cell2.textContent = measurement.temperature_value + "°C";
    cell3.textContent = measurement.humidity_value + "%";
  });
}

// Add a button click event listener to load more measurements
const loadMoreButton = document.getElementById('loadMoreButton');
loadMoreButton.addEventListener('click', loadMoreMeasurements);