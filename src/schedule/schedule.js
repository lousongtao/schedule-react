import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Schedule extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            schedule: [{
                day: '7 - 6',
                users:[{
                    timeSlotId: 1,
                    timeSlot: '8.00-9.00',
                    users: ['Jason', 'Maggie']
                }, {
                    timeSlotId: 2,
                    timeSlot: '9.00-10.00',
                    users: ['Tom', 'Jack']
                }]
            }]
        }
    }

    componentDidMount() {

    }

    //day is the format of "7 - 6", 7 means July, 6 is the day
    getScheduleUsers = (timeSlotId, day) => {
        return undefined;
        // var ss = this.state.schedule.filter(s => s.day == day);
        // var s2 = ss[0].users.filter(s => s.timeSlotId == timeSlotId);
        // return s2[0].users.join("; ");
    }
    render() {
        var date = new Date();
        date.setDate(this.props.monday.getDate());
        var monday = (date.getMonth() + 1) + '-' + date.getDate();
        date.setDate(date.getDate() + 1);
        var tuesday = (date.getMonth() + 1) + '-' + date.getDate();
        date.setDate(date.getDate() + 1);
        var wednesday = (date.getMonth() + 1) + '-' + date.getDate();
        date.setDate(date.getDate() + 1);
        var thursday = (date.getMonth() + 1) + '-' + date.getDate();
        date.setDate(date.getDate() + 1);
        var friday = (date.getMonth() + 1) + '-' + date.getDate();
        date.setDate(date.getDate() + 1);
        var saturday = (date.getMonth() + 1) + '-' + date.getDate();
        date.setDate(date.getDate() + 1);
        var sunday = (date.getMonth() + 1) + '-' + date.getDate();
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
                        {this.props.timeSlots.map(ts => (
                            <TableRow key={ts.id} hover={true}>
                                <TableCell component="th" scope="row">
                                    {ts.displayText}
                                </TableCell>
                                <TableCell align="right">{this.getScheduleUsers(ts.id, monday)}</TableCell>
                                <TableCell align="right">{123}</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default Schedule;