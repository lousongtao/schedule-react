import React from "react";
import {MenuItem,InputLabel, Select, Switch, TableContainer, TableBody, TableCell, TableRow, TableHead, Table, Grid, Paper, Button} from "@material-ui/core";
import {DataContext} from "../utils/DataContext";

class UserTime extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            refreshTimes: 0, //设置一个刷新参数, 在界面需要刷新, 但是没有改变state内其他数据的时候, 加1
            monday: props.monday,
            selectUserId: undefined, //当前选中员工, 默认为undefined
            mapSelectUserTime: new Map(), //当前选中员工的时刻表, 初始化为一个空map; key=date(like '2020-07-07'), value = another map which key = timeSlotId and value = boolean for isAvailable
        }
    }

    componentDidMount() {

    };

    //day is YYYY-MM-DD, such as 2020-06-09
    isAvailable = (timeSlotId, day) => {
        if (this.state.selectUserId == undefined)
            return false;
        if (this.state.mapSelectUserTime == undefined)
            return false;
        var mapTimeSlots = this.state.mapSelectUserTime.get(day);
        if (mapTimeSlots == undefined)
            return false;
        return mapTimeSlots.get(timeSlotId) | false;
    };

    //day is YYYY-MM-DD, such as 2020-06-09
    changeAvailable = (timeSlotId, day) => {
        if (this.state.selectUserId == undefined)
            return;
        const available = this.isAvailable(timeSlotId, day);
        const data = {
            timeSlotId: timeSlotId,
            date: day,
            available: !available,
            userId: this.state.selectUserId
        };
        fetch("http://localhost:9000/users/usertime", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(userTime => {
                userTime = userTime.data;
                var mapTimeSlots = this.state.mapSelectUserTime.get(day);
                if (mapTimeSlots == undefined){
                    mapTimeSlots = new Map();
                    this.state.mapSelectUserTime.set(day, mapTimeSlots);
                }
                mapTimeSlots.set(timeSlotId, userTime.available);
                this.setState({refreshTimes: this.state.refreshTimes+1});
            })
            .catch((error) => alert(error));
    };

    //切换用户时, 重新加载该用户的空闲时间
    //react 不是立即更新state中的值, 所以这里不能直接取用state.Monday, 要通过外部把需要显示的日期传入
    changeStaff = (monday, userId) => {
        this.state.mapSelectUserTime.clear();
        var url = "http://localhost:9000/users/usertime?userId=" + userId;
        var monday = this.getDateString(monday, 1);
        var sunday = this.getDateString(monday,7);
        url += "&startDate=" + monday + "&endDate="+sunday;
        fetch(url)
            .then(res => res.json())
            .then(listUserTime => {
                listUserTime = listUserTime.data;
                for (let i = 0; i < listUserTime.length; i++) {
                    var userTime = listUserTime[i];
                    var mapTimeSlots = this.state.mapSelectUserTime.get(userTime.date);
                    if (mapTimeSlots == undefined){
                        mapTimeSlots = new Map();
                        this.state.mapSelectUserTime.set(userTime.date, mapTimeSlots);
                    }
                    mapTimeSlots.set(userTime.timeSlotId, userTime.available);
                }
                this.setState({selectUserId: userId});
            })
            .catch((error) => alert(error));
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
        if (this.state.selectUserId != undefined){
            this.changeStaff(date, this.state.selectUserId);
        }
    };

    nextWeek = () => {
        var date = new Date(this.state.monday);
        date.setDate(date.getDate() + 7);
        this.setState({monday: date});
        if (this.state.selectUserId != undefined){
            this.changeStaff(date, this.state.selectUserId);
        }
    };

    //day = {1,2,3,4,5,6,7} monday = 1 , sunday = 7. 这里要主动传入monday, 不能使用state中的monday
    getDateString = (monday, day) =>{
        var date = new Date(monday);
        date.setDate(date.getDate() + day - 1);
        return this.formatDateYYYYMMDD(date);
    };

    buildTimeTable = () => {
        var monday = this.getDateString(this.state.monday,1);
        var tuesday = this.getDateString(this.state.monday,2);
        var wednesday = this.getDateString(this.state.monday,3);
        var thursday = this.getDateString(this.state.monday,4);
        var friday = this.getDateString(this.state.monday,5);
        var saturday = this.getDateString(this.state.monday,6);
        var sunday = this.getDateString(this.state.monday,7);
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputLabel>Choose a staff</InputLabel>
                        <Select onChange={(event) => this.changeStaff(this.state.monday, event.target.value)}>
                            {Array.from(DataContext.users.values()).map(user => (
                                <MenuItem value={user.id} key={user.id}>{user.name}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
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
                                            <TableCell component="th" scope="row">{ts.displayText}</TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, monday)} onChange={() => this.changeAvailable(ts.id, monday)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, tuesday)} onChange={() => this.changeAvailable(ts.id, tuesday)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, wednesday)} onChange={() => this.changeAvailable(ts.id, wednesday)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, thursday)} onChange={() => this.changeAvailable(ts.id, thursday)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, friday)} onChange={() => this.changeAvailable(ts.id, friday)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, saturday)} onChange={() => this.changeAvailable(ts.id, saturday)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Switch checked={this.isAvailable(ts.id, sunday)} onChange={() => this.changeAvailable(ts.id, sunday)}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </div>
        );
    };

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
                    <Grid item xs={12}>
                        {this.buildTimeTable()}
                    </Grid>
                </Grid>


            </div>
        );
    }


}

export default UserTime;