import React from 'react';
import Schedule from "./schedule/schedule";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>

                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6} spacing={2}>
                            <Button variant={'contained'} color={'primary'}>{'< <'}</Button>
                            <Button variant={'contained'} color={'primary'}>{'> >'}</Button>
                        </Grid>
                        <Grid container xs={6} spacing={2}>
                            <Button variant={'contained'} color={'primary'}>{'Add new staff'}</Button>
                            <Button variant={'contained'} color={'primary'}>{'Set staff time'}</Button>
                        </Grid>`
                    </Grid>

                    <Grid item xs={12}>
                        <Schedule ts={this.state.timeSlots}/>
                    </Grid>
                </Grid>

            </div>

        );
    }
}

export default MainUI;