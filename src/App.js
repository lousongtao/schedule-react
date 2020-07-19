import React from 'react';
import './App.css';
import {DataContext} from "./utils/DataContext";

function App() {
    let timeSlots;
    fetch(DataContext.serverURL + "/common/timeslot").then(res => res.json()).then(json => timeSlots = json.data);

    return (
        <div></div>
    );
}

export default App;
