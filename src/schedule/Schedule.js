import React from "react";
import {List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Checkbox, Table, TableContainer, TableHead, TableRow, TableBody,
    TableCell, Grid, Button} from "@material-ui/core";
import {DataContext} from "../utils/DataContext";

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        console.log('in schedule constructor');
        this.state = {
            refreshTimes: 0,
            monday: props.monday,
            mapSchedule: new Map(), // 初始化为一个空map; key=date(like '2020-07-07'), value = map which key = timeSlotId and value = list of userId
            mapUserTimes: new Map(), //初始化为一个空map; key=date(like '2020-07-06'), value = map(key = timeSlotId, value = map{key = userId, value = boolean(available)})
            mapUser: new Map(), //初始化为一个空map; key=userId, value = user
            selectDay: undefined, //双击一个日期时, 改变这个值, 刷新右侧的排班列表
            selectTimeSlot: undefined, //双击一个日期时, 改变这个值, 刷新右侧的排班列表
        }
    };

    //1. load current schedule with user //2. load all user's available in this week
    componentDidMount() {
        console.log('in schedule componentDidMount');
        var urlSchedule = "http://localhost:9000/schedule/byday?startDate=" + this.getDateString(1) + "&endDate="+this.getDateString(7);
        fetch(urlSchedule).then(res => res.json())
            .then(json => {
                var schedules = json.data;
                for (let i = 0; schedules != undefined && i < schedules.length; i++) {
                    let date = schedules[i].date;
                    let mapDate = this.state.mapSchedule.get(date);
                    if (mapDate == undefined){
                        mapDate = new Map();
                        this.state.mapSchedule.set(date, mapDate);
                    }
                    let listUsers = mapDate.get(schedules[i].timeSlotId);
                    if (listUsers == undefined){
                        listUsers = [];
                        mapDate.set(schedules[i].timeSlotId, listUsers);
                    }
                    listUsers.push(schedules[i].userId);
                }
                this.setState({refreshTimes: this.state.refreshTimes + 1}); //每个fetch都要刷新一次, 因为不同fetch返回的循序不一样
            })
            .catch((error) => alert(error));
        var urlUserTime = "http://localhost:9000/users/usertime?startDate=" + this.getDateString(1) + "&endDate="+this.getDateString(7);
        fetch(urlUserTime).then(res => res.json())
            .then(json => {
                let userTimes = json.data;
                for (let i = 0; userTimes != undefined && i < userTimes.length; i++) {
                    let mapTimeSlot = this.state.mapUserTimes.get(userTimes[i].date);
                    if (mapTimeSlot == undefined){
                        mapTimeSlot = new Map();
                        this.state.mapUserTimes.set(userTimes[i].date, mapTimeSlot);
                    }
                    let mapUserAvailable = mapTimeSlot.get(userTimes[i].timeSlotId);
                    if (mapUserAvailable == undefined){
                        mapUserAvailable = new Map();
                        mapTimeSlot.set(userTimes[i].timeSlotId, mapUserAvailable);
                    }
                    mapUserAvailable.set(userTimes[i].userId, userTimes[i].available);
                }
                this.setState({refreshTimes: this.state.refreshTimes + 1}); //每个fetch都要刷新一次, 因为不同fetch返回的循序不一样
            })
            .catch((error) => alert(error));
    };

    //day is the format of "2020-07-06"
    getScheduledUsers = (timeSlotId, day) => {
        let mapTimeSlot = this.state.mapSchedule.get(day);
        if (mapTimeSlot == undefined){
            return '';
        }
        let listUserId = mapTimeSlot.get(timeSlotId);
        if (listUserId == undefined)
            return '';
        let userNames = '';
        listUserId.forEach((item) => userNames += ' ' + this.state.mapUser.get(item));

        return mapTimeSlot;
    };

    formatDateYYYYMMDD = (d) => {
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    previousWeek = () => {
        var date = new Date(this.state.monday);
        date.setDate(date.getDate() - 7);
        this.setState({monday: date});
        console.log('after click previous week, this.state.monday = ' + this.state.monday);
    };

    nextWeek = () => {
        var date = new Date(this.state.monday);
        date.setDate(date.getDate() + 7);
        this.setState({monday: date});
        console.log('after click next week, this.state.monday = ' + this.state.monday);
    };

    //day = {1,2,3,4,5,6,7} monday = 1 , sunday = 7
    getDateString = (day) =>{
        var date = new Date(this.state.monday);
        date.setDate(date.getDate() + day - 1);
        return this.formatDateYYYYMMDD(date);
    };

    //day is the format of "2020-07-06"
    editScheduleUser = (timeSlotId, day) => {
        this.setState({selectDay: day, selectTimeSlot: timeSlotId});
    };

    buildScheduleTable = () =>{
        console.log('DataContext.timeSlots = ' + DataContext.timeSlots)
        var monday = this.getDateString(1);
        var tuesday = this.getDateString(2);
        var wednesday = this.getDateString(3);
        var thursday = this.getDateString(4);
        var friday = this.getDateString(5);
        var saturday = this.getDateString(6);
        var sunday = this.getDateString(7);
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Time Slot</TableCell>
                            <TableCell align="right">{'Mon / ' + monday}</TableCell>
                            <TableCell align="right">{'Tue / ' + tuesday}</TableCell>
                            <TableCell align="right">{'Wed / ' + wednesday}</TableCell>
                            <TableCell align="right">{'Thu / ' + thursday}</TableCell>
                            <TableCell align="right">{'Fri / ' + friday}</TableCell>
                            <TableCell align="right">{'Sat / ' + saturday}</TableCell>
                            <TableCell align="right">{'Sun / ' + sunday}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {DataContext.timeSlots.map(ts => (
                            <TableRow key={ts.id} hover={true}>
                                <TableCell component="th" scope="row">
                                    {ts.displayText}
                                </TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, monday)}>{() =>this.getScheduledUsers(ts.id, monday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, tuesday)}>{() => this.getScheduledUsers(ts.id, tuesday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, wednesday)}>{() => this.getScheduledUsers(ts.id, wednesday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, thursday)}>{() => this.getScheduledUsers(ts.id, thursday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, friday)}>{() => this.getScheduledUsers(ts.id, friday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, saturday)}>{() => this.getScheduledUsers(ts.id, saturday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, sunday)}>{() => this.getScheduledUsers(ts.id, sunday)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    changeUserSchedule = (checked, userId) => {
        let url = "http://localhost:9000/schedule/arrangeschedule?userId=" + userId + "&timeSlotId=" + this.state.selectTimeSlot + "&date=" + this.state.selectDay;
        let method = checked ? 'POST' : 'DELETE';
        fetch(url, {method: method}).then(response => response.json())
            .then(userTime => {
                let success = userTime.result;
                if (success){
                    let mapDate = this.state.mapSchedule.get(this.state.selectDay);
                    if (mapDate == undefined){
                        mapDate = new Map();
                        this.state.mapSchedule.set(this.state.selectDay, mapDate);
                    }
                    let listUsers = mapDate.get(this.state.selectTimeSlot);
                    if (listUsers == undefined){
                        listUsers = [];
                        mapDate.set(this.state.selectTimeSlot, listUsers);
                    }
                    if (checked)
                        listUsers.push(userId);
                    else {
                        listUsers.splice(listUsers.indexOf(userId), 1);//Javascript array delete one element. Looks very ugly writing like this.
                    }
                }
                this.setState({refreshTimes: this.state.refreshTimes+1});
            })
            .catch((error) => alert(error));
    };

    buildUserList = () => {
        let availableUsers = [];
        let scheduledUsers = [];
        let unAvailableUsers = [];
        let scheduleDate = '';
        let scheduleTimeSlot = '';
        if (this.state.selectDay != undefined && this.state.selectTimeSlot != undefined){
            let mapTimeSlot = this.state.mapSchedule.get(this.state.selectDay);
            if (mapTimeSlot != undefined){
                let listUser = mapTimeSlot.get(this.state.selectTimeSlot);
                if (listUser != undefined)
                    listUser.forEach((userId) => scheduledUsers.push(this.state.mapUser.get(userId)));
            }

            mapTimeSlot = this.state.mapUserTimes.get(this.state.selectDay);
            if (mapTimeSlot != undefined){
                let mapUserAvailable = mapTimeSlot.get(this.state.selectTimeSlot);
                if (mapUserAvailable != undefined){
                    mapUserAvailable.forEach((avai, userId) => {
                        if (avai){
                            availableUsers.push(this.state.mapUser.get(userId));
                        } else {
                            unAvailableUsers.push(this.state.mapUser.get(userId));
                        }
                    });
                }
            }
            scheduleDate = this.state.selectDay;
            DataContext.timeSlots.forEach(ts => {
                if (ts.id == this.state.selectTimeSlot){
                    scheduleTimeSlot = ts.displayText;
                }
            });
        }
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        Date: {scheduleDate} {scheduleTimeSlot}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <List subheader={<ListSubheader>Available Staffs</ListSubheader>}>
                                    {scheduledUsers.map(user => {
                                        return (
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Checkbox edge={'start'} />
                                                </ListItemIcon>
                                                <ListItemText primary={user.name}/>
                                            </ListItem>
                                        )
                                    })}
                                    {availableUsers.map(user => {
                                        return (
                                            <ListItem >
                                                <ListItemIcon>
                                                    <Checkbox edge={'start'} onChange={(o, status) => this.changeUserSchedule(status, user.id)}/>
                                                </ListItemIcon>
                                                <ListItemText primary={user.name}/>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Grid>
                            <Grid item xs={12}>
                                <List subheader={<ListSubheader>Unavailable Staffs</ListSubheader>}>
                                    {unAvailableUsers.map(user => {
                                        return (
                                            <ListItem>
                                                <ListItemText primary={user.name}/>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    };

    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.previousWeek()}>{'< <'}</Button>
                            </Grid>
                            <Grid item >
                                <Button variant={'contained'} color={'primary'} onClick={() => this.nextWeek()}>{'> >'}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                {this.buildScheduleTable()}
                            </Grid>
                            <Grid item xs={2}>
                                {this.buildUserList()}
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </div>
        );
    };
}

export default Schedule;