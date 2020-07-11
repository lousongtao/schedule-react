import React from 'react';
import Schedule from "./schedule/schedule";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import UserTime from "./user/UserTime";

const CONTENT_PAGE_SCHEDULE = 1;
const CONTENT_PAGE_STAFFCALENDAR = 2;

class MainUI extends React.Component{


    constructor(props) {
        super(props);
        var date = new Date();
        date.setDate(date.getDate() - date.getDay() + 1);
        this.state = {
            monday: date,
            contentPage: CONTENT_PAGE_SCHEDULE, //1 = schedule; 2 = staff calendar
            timeSlots: []
        }
    }

    componentDidMount() {
        fetch("http://127.0.0.1:9000/common/timeslot")
            .then(res => res.json())
            .then(json => this.setState({timeSlots: json.data}));
    }

    previousWeek = () => {
        var date = new Date();
        date.setDate(this.state.monday.getDate() - 7);
        this.setState({monday: date});
        console.log('after click previous week, this.state.monday = ' + this.state.monday);
    }

    nextWeek = () => {
        var date = new Date();
        date.setDate(this.state.monday.getDate() + 7);
        this.setState({monday: date});
        console.log('after click next week, this.state.monday = ' + this.state.monday);
    }

    //显示员工个人的时刻表, 是否能排班
    showStaffCalendar = () => {
        this.setState({contentPage:CONTENT_PAGE_STAFFCALENDAR});
    }

    showSchedule = () => {
        this.setState({contentPage:CONTENT_PAGE_SCHEDULE});
    }
    showContentPage = () => {
        if (this.state.contentPage == CONTENT_PAGE_SCHEDULE)
            return <Schedule timeSlots={this.state.timeSlots} monday={this.state.monday}/>;
        else if (this.state.contentPage == CONTENT_PAGE_STAFFCALENDAR)
            return <UserTime timeSlots={this.state.timeSlots} monday={this.state.monday}/>
    }
    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.previousWeek()}>{'< <'}</Button>
                            </Grid>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.nextWeek()}>{'> >'}</Button>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} >Add new staff</Button>
                            </Grid>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.showStaffCalendar()}>Set staff time</Button>
                            </Grid>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.showSchedule()}>Schedule</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {this.showContentPage()}
                    </Grid>
                </Grid>

            </div>

        );
    }


}

export default MainUI;