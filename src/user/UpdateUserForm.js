import {useContext} from "react";
import {Button, Grid, MenuItem} from "@material-ui/core";
import React from "react";
import {UserContext} from "./UserMgmt";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import {DataContext} from "../utils/DataContext";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

export default function UpdateUserForm() {
    const {state, dispatch} = useContext(UserContext);
    let user = state.updateUser;//copy value from state, otherwise change value will update the original data
    const header = {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        };
    const postdata = {
        method:'POST',
        headers: header,
        body: JSON.stringify(user)
    };
    function updateUser(){
        if (user.id.length === 0){
            alert('Must double click a user from left table.');
            return;
        }
        if (user.name.length === 0 || user.password.length === 0){
            alert('Must input name and password.');
            return;
        }
        fetch(DataContext.serverURL + "/users", postdata)
            .then(res => res.json())
            .then(json => {
                if (json.result) {
                    let user = json.data;
                    alert('Save successfully.');
                    dispatch({type: 'refreshUserList', data: user});
                } else {
                    alert('Update user failed');
                }
            })
            .catch((error) => alert(error));
    };

    function ShiftWorkSelect(){
        let items = [];
        for (let i = 0; i <= DataContext.timeSlots.length * 7; i++) {
            items.push(<MenuItem value={i} key={'shiftTimes'+i}>{i}</MenuItem>);
        }
        return (
            <FormControl>
                <InputLabel>Shift Times</InputLabel>
                <Select value={user.shiftTimes} onChange={(e) => dispatch({type:'update.user.shiftTimes', data: e.target.value})}>
                    {items}
                </Select>
            </FormControl>
        )
    }
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={1}>
                            <TextField id={'id'} label={'id'} disabled value={user.id}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField id={'name'} label={'name'}
                                       onChange={(e) => dispatch({type:'update.user.name', data: e.target.value})}
                                       value={user.name}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField id={'password'} label={'password'}
                                       onChange={(e) => dispatch({type:'update.user.password', data: e.target.value})}
                                       value={user.password}/>
                        </Grid>
                        <Grid item xs={2}>
                            <ShiftWorkSelect/>
                        </Grid>
                        <Grid item xs={2}>
                            <InputLabel htmlFor={'available'}>Available</InputLabel>
                            <Switch id={'available'} label={'available'}
                                    onChange={(e) => dispatch({type:'update.user.available', data: e.target.checked})}
                                    checked={user.available}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={updateUser}>UPDATE STAFF</Button>
                </Grid>
            </Grid>
        </form>
    )
}