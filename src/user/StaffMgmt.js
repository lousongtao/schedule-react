import {
    Button,
    Checkbox,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from "@material-ui/core";
import React from "react";
import {DataContext} from "../utils/DataContext";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import InputLabel from "@material-ui/core/InputLabel";

class StaffMgmt extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            refreshTimes:0,
            addUser: {},
            updateUser: {}
        }

    }

    editUser = (userId) => {
        this.setState({updateUser: DataContext.users.get(userId)});
    };

    buildTable = () =>{
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Available</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(DataContext.users.values()).map(user => (
                            <TableRow key={user.id} hover={true} onDoubleClick={() => this.editUser(user.id)}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.available}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    addStaff = () => {
        if (!this.state.addUser.name || !this.state.addUser.password){
            alert('must input user name and password');
            return;
        }
        fetch("http://localhost:9000/users", {
            method:'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(this.state.addUser)
        }).then(res => res.json())
            .then(json => {
                if (json.result) {
                    let user = json.data;
                    DataContext.users.set(user.id, user);
                    this.setState({addUser: {}});
                } else {
                    alert('Add user failed');
                }
            })
            .catch((error) => alert(error));
    };

    updateStaff = () => {
        fetch("http://localhost:9000/users", {
            method:'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(this.state.updateUser)
        }).then(res => res.json())
            .then(json => {
                if (json.result) {
                    let user = json.data;
                    DataContext.users.set(user.id, user);
                    this.setState({updateUser: {}});
                } else {
                    alert('Update user failed');
                }
            })
            .catch((error) => alert(error));
    };

    buildAddForm = () => {
        return (
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextField id={'name'} label={'name'} onChange={(e) => this.state.addUser.name = e.target.value}></TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id={'password'} label={'password'} onChange={(e) => this.state.addUser.password = e.target.value}></TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={() => this.addStaff()}>ADD STAFF</Button>
                    </Grid>
                </Grid>
            </form>
        )
    };

    buildUpdateForm = () => {
        return (
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextField id={'id'} label={'id'} disabled value={this.state.updateUser ? this.state.updateUser.id : ''}></TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id={'name'} label={'name'}
                                           onChange={(e) => this.state.updateUser.name = e.target.value}
                                           value={this.state.updateUser ? this.state.updateUser.name : ''}></TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id={'password'} label={'password'}
                                           onChange={(e) => this.state.updateUser.password = e.target.value}
                                           value={this.state.updateUser ? this.state.updateUser.password : ''}></TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <InputLabel htmlFor={'available'}>Available</InputLabel>
                                <Switch id={'available'} label={'available'}
                                        onChange={(e) => this.state.updateUser.available = e.target.value}
                                        checked={this.state.updateUser ? this.state.updateUser.available : false}></Switch>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={() => this.updateStaff()}>UPDATE STAFF</Button>
                    </Grid>
                </Grid>
            </form>
        )
    };

    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {this.buildTable()}
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        {this.buildAddForm()}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {this.buildUpdateForm()}
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default StaffMgmt;