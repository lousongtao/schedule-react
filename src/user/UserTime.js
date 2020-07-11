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
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

class UserTime extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selectUserId: undefined,
            selectUserTime: [],
            users: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:9000/users")
            .then(res => res.json())
            .then(json => this.setState({users: json.data}));
    }

    isAvailable = (timeSlotId, day) => {
        if (this.state.selectUserId == undefined)
            return false;
        if (this.state.selectUserTime == undefined)
            return false;
        for (let i = 0; i < this.state.selectUserTime.length; i++) {
            let ut = this.state.selectUserTime[i];
            if (ut.timeSlotId.id == timeSlotId){
                var date = new Date(ut.date);

                if (ut.day == day) {
                    return ut.isAvailable;
                }
            }
        }
        return false;
    }

    changeAvailable = (timeSlotId, day) => {
        const that = this;
        const data = {
            timeSlotId: timeSlotId,
            day: day,
            isAvailable: that.isAvailable(timeSlotId, day)
        };
        fetch("http://localhost:9000/users/usertime", {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(response => response.json());
        return undefined;
    }

    changeStaff = (userId) => {
        var url = "http://localhost:9000/users/usertime?userId=" + userId;
        var monday = this.formatDate(this.props.monday);
        var date = new Date();
        date.setDate(this.props.monday.getDate() + 6);
        var sunday = this.formatDateYYYYMMDD(date);
        url += "&startDate=" + monday + "&endDate="+sunday;
        fetch(url)
            .then(res => res.json())
            .then(json => this.setState({
                selectUserId: userId,
                selectUserTime: json.data
            }));
    }

    formatDateYYYYMMDD = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    formatDateMMDD = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        var date = new Date();
        date.setDate(this.props.monday.getDate());
        var monday = this.formatDateMMDD(date);
        date.setDate(date.getDate() + 1);
        var tuesday = this.formatDateMMDD(date);
        date.setDate(date.getDate() + 1);
        var wednesday = this.formatDateMMDD(date);
        date.setDate(date.getDate() + 1);
        var thursday = this.formatDateMMDD(date);
        date.setDate(date.getDate() + 1);
        var friday = this.formatDateMMDD(date);
        date.setDate(date.getDate() + 1);
        var saturday = this.formatDateMMDD(date);
        date.setDate(date.getDate() + 1);
        var sunday = this.formatDateMMDD(date);
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl>
                            <InputLabel>Choose a staff</InputLabel>
                            <Select onChange={(event) => this.changeStaff(event.target.value)}>
                                {this.state.users.map(user => (
                                    <MenuItem value={user.id} key={user.id}>{user.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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
                                    {this.props.timeSlots.map(ts => (
                                        <TableRow key={ts.id} hover={true}>
                                            <TableCell component="th" scope="row">
                                                {ts.displayText}
                                            </TableCell>
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
    }


}

export default UserTime;