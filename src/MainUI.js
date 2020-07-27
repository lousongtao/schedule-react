import React from 'react';
import Schedule from "./schedule/Schedule";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import UserTime from "./user/UserTime";
import {DataContext} from "./utils/DataContext";
import StaffMgmt from "./user/StaffMgmt";

const CONTENT_PAGE_SCHEDULE = 1;
const CONTENT_PAGE_STAFFCALENDAR = 2;
const CONTENT_PAGE_STAFFMANAGEMENT = 3;

class MainUI extends React.Component{


    constructor(props) {
        super(props);
        //init the DataContext from app entrance
        DataContext.timeSlots = [];
        DataContext.users = new Map();
        // DataContext.serverURL = 'http://schedule.js-link.com.au:9000';
        DataContext.serverURL = 'http://127.0.0.1:9000';
        let date = new Date();
        date.setDate(date.getDate() - date.getDay() + 1);
        this.state = {
            monday: date,
            refreshTimes: 0,
            contentPage: CONTENT_PAGE_STAFFMANAGEMENT, //1 = schedule; 2 = staff calendar; 3 = staff management
        }
    }

    componentDidMount() {
        fetch(DataContext.serverURL + "/common/timeslot")
            .then(res => res.json())
            .then(json => {
                DataContext.timeSlots = json.data;
                this.setState({refreshTimes: this.state.refreshTimes + 1})
            })
            .catch((error) => alert(error));
        fetch(DataContext.serverURL + "/users")
            .then(res => res.json())
            .then(json => {
                for (let i = 0; i < json.data.length; i++) {
                    DataContext.users.set(json.data[i].id, json.data[i]);
                }
                this.setState({refreshTimes: this.state.refreshTimes + 1});
            })
            .catch((error) => alert(error));
    }

    //显示员工个人的时刻表, 是否能排班
    showStaffCalendar = () => {
        this.setState({contentPage:CONTENT_PAGE_STAFFCALENDAR});
    };

    showSchedule = () => {
        this.setState({contentPage:CONTENT_PAGE_SCHEDULE});
    };

    showContentPage = (page) => {
        console.log('showContentPage, monday = ' + this.state.monday);
        if (page === CONTENT_PAGE_SCHEDULE)
            return <Schedule monday={this.state.monday}/>;
        else if (page === CONTENT_PAGE_STAFFCALENDAR)
            return <UserTime monday={this.state.monday}/>
        else if (page === CONTENT_PAGE_STAFFMANAGEMENT)
            return <StaffMgmt/>
    };

    showStaffMgmt = () => {
        this.setState({contentPage:CONTENT_PAGE_STAFFMANAGEMENT});
    };

    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.showStaffMgmt()}>Staff Management</Button>
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
                        {this.showContentPage(this.state.contentPage)}
                    </Grid>
                </Grid>
            </div>
        );
    }


}

export default MainUI;