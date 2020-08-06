import {Button, Grid, MenuItem} from "@material-ui/core";
import React, {useContext, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {UserContext} from "./UserMgmt";
import {DataContext} from "../utils/DataContext";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";



function AddUserForm() {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [shiftTimes, setShiftTimes] = useState(0);
    const {state, dispatch} = useContext(UserContext);

    function addUser(){
        if (name === undefined || name.length === 0 || password === undefined || password.length === 0){
            alert('must input user name and password');
            return;
        }
        const headers = {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        };
        const data = {
            method:'POST',
            headers: headers,
            body: JSON.stringify({
                name: name,
                password: password,
                shiftTimes: shiftTimes
            })
        };
        fetch(DataContext.serverURL + "/users", data)
            .then(res => res.json())
            .then(json => {
                if (json.result) {
                    let user = json.data;
                    setName('');
                    setPassword('');
                    setShiftTimes(0);
                    alert('Save successfully.');
                    dispatch({type: 'refreshUserList', data: user});
                } else {
                    alert('Add user failed');
                }
            })
            .catch((error) => alert(error));
    }

    function ShiftWorkSelect(){
        let items = [];
        for (let i = 0; i <= DataContext.timeSlots.length * 7; i++) {
            items.push(<MenuItem value={i} key={'shiftTimes'+i}>{i}</MenuItem>);
        }
        return (
            <FormControl>
                <InputLabel>Shift Times</InputLabel>
                <Select value={shiftTimes} onChange={(event) => setShiftTimes(event.target.value)}>
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
                        <Grid item xs={3}>
                            <TextField id={'name'} label={'name'} value={name}
                                       onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id={'password'} label={'password'} value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                        </Grid>
                        <Grid item xs={3}>
                            <ShiftWorkSelect/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={addUser}>ADD STAFF</Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddUserForm;