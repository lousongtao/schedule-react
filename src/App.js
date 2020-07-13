import React from 'react';
import './App.css';

function App() {
    let timeSlots;
    fetch("http://localhost:9000/common/timeslot").then(res => res.json()).then(json => timeSlots = json.data);

    return (
        <div></div>
    );
}

export default App;
