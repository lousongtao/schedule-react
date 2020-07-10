import React from 'react';
import './App.css';
import Schedule from "./schedule/schedule";

function App() {
    let timeSlots;
    fetch("http://localhost:9000/common/timeslot").then(res => res.json()).then(json => timeSlots = json.data);

    return (
        <Schedule ts={timeSlots}/>
    );
}

export default App;
