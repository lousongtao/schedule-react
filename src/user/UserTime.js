import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {DataContext} from "../utils/DataContext";

class UserTime extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: DataContext.users,
            refreshTimes: 0, //设置一个刷新参数, 在界面需要刷新, 但是没有改变state内其他数据的时候, 加1
            monday: props.monday,
            selectUserId: undefined, //当前选中员工, 默认为undefined
            mapSelectUserTime: new Map(), //当前选中员工的时刻表, 初始化为一个空map; key=date(like '2020-07-07'), value = another map which key = timeSlotId and value = boolean for isAvailable
        }
    }

    componentDidMount() {

    }

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
    }

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
    }

    //切换用户时, 重新加载该用户的空闲时间
    changeStaff = (userId) => {
        var url = "http://localhost:9000/users/usertime?userId=" + userId;
        var monday = this.getDateString(1);
        var sunday = this.getDateString(7);
        url += "&startDate=" + monday + "&endDate="+sunday;
        fetch(url)
            .then(res => res.json())
            .then(listUserTime => {
                this.state.mapSelectUserTime.clear();

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
        // if (this.state.selectUserId != undefined){
        //     this.changeStaff(this.state.selectUserId);
        // }
    };

    nextWeek = () => {
        var date = new Date(this.state.monday);
        date.setDate(date.getDate() + 7);
        this.setState({monday: date});
        // if (this.state.selectUserId != undefined){
        //     this.changeStaff(this.state.selectUserId);
        // }
    };

    //day = {1,2,3,4,5,6,7} monday = 1 , sunday = 7
    getDateString = (day) =>{
        var date = new Date(this.state.monday);
        date.setDate(date.getDate() + day - 1);
        return this.formatDateYYYYMMDD(date);
    };

    buildTimeTable = () => {
        var monday = this.getDateString(1);
        var tuesday = this.getDateString(2);
        var wednesday = this.getDateString(3);
        var thursday = this.getDateString(4);
        var friday = this.getDateString(5);
        var saturday = this.getDateString(6);
        var sunday = this.getDateString(7);
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputLabel>Choose a staff</InputLabel>
                        <Select onChange={(event) => this.changeStaff(event.target.value)}>
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