import React from "react";
import {List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Checkbox, Table, TableContainer, TableHead, TableRow, TableBody,
    TableCell, Grid, Button} from "@material-ui/core";
import {DataContext} from "../utils/DataContext";

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshTimes: 0,
            monday: props.monday,
            mapSchedule: new Map(), // 初始化为一个空map; key=date(like '2020-07-07'), value = map which key = timeSlotId and value = list of userId
            mapUserTimes: new Map(), //初始化为一个空map; key=date(like '2020-07-06'), value = map(key = timeSlotId, value = map{key = userId, value = boolean(available)})
            selectDay: undefined, //双击一个日期时, 改变这个值, 刷新右侧的排班列表
            selectTimeSlot: undefined, //双击一个日期时, 改变这个值, 刷新右侧的排班列表
        }
    };

    //1. load current schedule with user //2. load all user's available in this week
    componentDidMount() {
        let urlSchedule = DataContext.serverURL + "/schedule/byday?startDate=" + this.getDateString(this.state.monday,1) + "&endDate="+this.getDateString(this.state.monday,7);
        fetch(urlSchedule).then(res => res.json())
            .then(json => {
                let schedules = json.data;
                for (let i = 0; schedules !== undefined && i < schedules.length; i++) {
                    let date = schedules[i].date;
                    let mapDate = this.state.mapSchedule.get(date);
                    if (mapDate === undefined){
                        mapDate = new Map();
                        this.state.mapSchedule.set(date, mapDate);
                    }
                    let listUserId = mapDate.get(schedules[i].timeSlotId);
                    if (listUserId === undefined){
                        listUserId = [];
                        mapDate.set(schedules[i].timeSlotId, listUserId);
                    }
                    listUserId.push(...schedules[i].userIds);
                }
                this.setState({refreshTimes: this.state.refreshTimes + 1}); //每个fetch都要刷新一次, 因为不同fetch返回的循序不一样
            })
            .catch((error) => alert(error));
            this.fetchUserTime(this.state.monday);
    };

    //计算员工已排班次数, 根据monday, 往后计算一周时间内的
    countUserScheduledTime = (userId) => {
        let count = 0;
        for (let i = 1; i <=7 ; i++) {
            let sday = this.getDateString(this.state.monday, i);
            let mapDate = this.state.mapSchedule.get(sday);
            if (mapDate !== undefined){
                for (let j = 0; j < DataContext.timeSlots.length; j++) {
                    let listUserId = mapDate.get(DataContext.timeSlots[j].id);
                    if (listUserId !== undefined){
                        for (let k = 0; k < listUserId.length; k++) {
                            if (userId === listUserId[k])
                                count++;
                        }
                    }
                }
            }
        }
        console.log('count = ' + count);
        return count;
    };

    //react setState是个异步动作, 不能根据state.monday查询, 否则不是最新时间, 这个要调用方主动传递参数
    fetchUserTime = (monday) => {
        let urlUserTime = DataContext.serverURL + "/users/usertime?startDate=" + this.getDateString(monday, 1) + "&endDate="+this.getDateString(monday, 7);
        fetch(urlUserTime).then(res => res.json())
            .then(json => {
                let userTimes = json.data;
                for (let i = 0; userTimes !== undefined && i < userTimes.length; i++) {
                    let mapTimeSlot = this.state.mapUserTimes.get(userTimes[i].date);
                    if (mapTimeSlot === undefined){
                        mapTimeSlot = new Map();
                        this.state.mapUserTimes.set(userTimes[i].date, mapTimeSlot);
                    }
                    let mapUserAvailable = mapTimeSlot.get(userTimes[i].timeSlotId);
                    if (mapUserAvailable === undefined){
                        mapUserAvailable = new Map();
                        mapTimeSlot.set(userTimes[i].timeSlotId, mapUserAvailable);
                    }
                    mapUserAvailable.set(userTimes[i].userId, userTimes[i].available);
                }
                this.setState({refreshTimes: this.state.refreshTimes + 1}); //每个fetch都要刷新一次, 因为不同fetch返回的循序不一样
            })
            .catch((error) => alert(error));
    };


    //day is the format of "2020-07-06", 根据日期和时间段, 返回这个时间已排班的员工
    getScheduledUsers = (timeSlotId, day) => {
        let mapTimeSlot = this.state.mapSchedule.get(day);
        if (mapTimeSlot === undefined){
            return '';
        }
        let listUserId = mapTimeSlot.get(timeSlotId);
        if (listUserId === undefined)
            return '';
        let userNames = '';
        listUserId.forEach((userId) => {
            let user = DataContext.users.get(userId);

            userNames += (user === undefined ? '' : user.name) + ', '});
        return userNames;
    };

    formatDateYYYYMMDD = (d) => {
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    previousWeek = () => {
        let date = new Date(this.state.monday);
        date.setDate(date.getDate() - 7);
        this.setState({monday: date});
        this.fetchUserTime(date);
    };

    nextWeek = () => {
        let date = new Date(this.state.monday);
        date.setDate(date.getDate() + 7);
        this.setState({monday: date});
        this.fetchUserTime(date);
    };

    //day = {1,2,3,4,5,6,7} monday = 1 , sunday = 7. 这里要主动传入monday, 不能使用state中的monday, 因为react的setState是个异步操作, 取值的时候不一定是最新的值
    getDateString = (monday, day) =>{
        let date = new Date(monday);
        date.setDate(date.getDate() + day - 1);
        return this.formatDateYYYYMMDD(date);
    };

    //day is the format of "2020-07-06"
    editScheduleUser = (timeSlotId, day) => {
        this.setState({selectDay: day, selectTimeSlot: timeSlotId});
    };

    buildScheduleTable = () =>{
        let monday = this.getDateString(this.state.monday,1);
        let tuesday = this.getDateString(this.state.monday,2);
        let wednesday = this.getDateString(this.state.monday,3);
        let thursday = this.getDateString(this.state.monday,4);
        let friday = this.getDateString(this.state.monday,5);
        let saturday = this.getDateString(this.state.monday,6);
        let sunday = this.getDateString(this.state.monday,7);
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
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, monday)}>{this.getScheduledUsers(ts.id, monday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, tuesday)}>{this.getScheduledUsers(ts.id, tuesday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, wednesday)}>{this.getScheduledUsers(ts.id, wednesday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, thursday)}>{this.getScheduledUsers(ts.id, thursday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, friday)}>{this.getScheduledUsers(ts.id, friday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, saturday)}>{this.getScheduledUsers(ts.id, saturday)}</TableCell>
                                <TableCell align="right" onDoubleClick={() => this.editScheduleUser(ts.id, sunday)}>{this.getScheduledUsers(ts.id, sunday)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    //勾选/取消勾选用户的排班状态
    changeUserSchedule = (checked, userId) => {
        let url = DataContext.serverURL + "/schedule/arrangeschedule?userId=" + userId + "&timeSlotId=" + this.state.selectTimeSlot + "&date=" + this.state.selectDay;
        let method = checked ? 'POST' : 'DELETE';
        fetch(url, {method: method}).then(response => response.json())
            .then(userTime => {
                let success = userTime.result;
                if (success){
                    let mapDate = this.state.mapSchedule.get(this.state.selectDay);
                    if (mapDate === undefined){
                        mapDate = new Map();
                        this.state.mapSchedule.set(this.state.selectDay, mapDate);
                    }
                    let listUserId = mapDate.get(this.state.selectTimeSlot);
                    if (listUserId === undefined){
                        listUserId = [];
                        mapDate.set(this.state.selectTimeSlot, listUserId);
                    }
                    if (checked)
                        listUserId.push(userId);
                    else {
                        listUserId.splice(listUserId.indexOf(userId), 1);//Javascript array delete one element. Looks very ugly writing like this.
                    }
                }
                this.setState({refreshTimes: this.state.refreshTimes+1});
            })
            .catch((error) => alert(error));
    };

    /**
     * 构造员工list界面,
     * 数据来源于state.mapSchedule和state.mapUserTimes.
     * 员工信息分成三组, 可用员工, 不可用员工, 已经排入班次的员工, 每次doubleclick一个单元格的时候, 刷新数据.
     */
    buildUserList = () => {
        let availableUsers = [];
        let scheduledUsers = [];
        let unAvailableUsers = Array.from(DataContext.users.values());
        let scheduleDate = '';
        let scheduleTimeSlot = '';
        if (this.state.selectDay !== undefined && this.state.selectTimeSlot !== undefined){
            let mapTimeSlot = this.state.mapSchedule.get(this.state.selectDay);
            if (mapTimeSlot !== undefined){
                let listUserId = mapTimeSlot.get(this.state.selectTimeSlot);
                if (listUserId !== undefined)
                    listUserId.forEach((userId) => scheduledUsers.push(DataContext.users.get(userId)));
            }

            mapTimeSlot = this.state.mapUserTimes.get(this.state.selectDay);
            if (mapTimeSlot !== undefined){
                let mapUserAvailable = mapTimeSlot.get(this.state.selectTimeSlot);
                if (mapUserAvailable !== undefined){
                    mapUserAvailable.forEach((avai, userId) => {
                        if (avai){
                            availableUsers.push(DataContext.users.get(userId));
                            let index = -1;
                            for (let i = 0; i < unAvailableUsers.length; i++) {
                                if (userId === unAvailableUsers[i].id){
                                    index = i;
                                    break;
                                }
                            }
                            if (index >= 0)
                                unAvailableUsers.splice(index, 1);
                        }
                    });
                }
            }
            scheduleDate = this.state.selectDay;
            DataContext.timeSlots.forEach(ts => {
                if (ts.id === this.state.selectTimeSlot){
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
                                    {availableUsers.map(user => {
                                        let scheduled = false;
                                        let count = this.countUserScheduledTime(user.id);
                                        for (let i = 0; i < scheduledUsers.length; i++) {
                                            if (user.id === scheduledUsers[i].id){
                                                scheduled = true;
                                            }
                                        }
                                        return (
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Checkbox edge={'start'} checked={scheduled} onChange={(o, status) => this.changeUserSchedule(status, user.id)}/>
                                                </ListItemIcon>
                                                <ListItemText primary={user.name + ' (' + count + ' / ' + user.shiftTimes + ')'}/>
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