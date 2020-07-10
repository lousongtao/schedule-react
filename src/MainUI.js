import React from 'react';
import Schedule from "./schedule/schedule";

class MainUI extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            timeSlots: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:9000/common/timeslot")
            .then(res => res.json())
            .then(json => this.setState({timeSlots: json.data}));
    }

    render() {
        return (
            <Schedule ts={this.state.timeSlots}/>
        );
    }
}

export default MainUI;