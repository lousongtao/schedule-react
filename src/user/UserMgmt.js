import {createContext, useReducer} from "react";
import {Grid} from "@material-ui/core";
import React from "react";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import {DataContext} from "../utils/DataContext";
import UserTable from "./UserTable";

export const UserContext = createContext(null);

function reducer(state, action) {
    //react 使用reducer返回的state, 必须是一个全新的对象, 不能在原有state上进行修改.
    const newState = {...state};
    switch (action.type) {
        case 'update.user.name':
            newState.updateUser.name = action.data;
            return newState;
        case 'update.user.password':
            newState.updateUser.password = action.data;
            return newState;
        case 'update.user.shiftTimes':
            newState.updateUser.shiftTimes = action.data;
            return newState;
        case 'update.user.available':
            newState.updateUser.available = action.data;
            return newState;
        case 'chooseUpdateUser':
            //double click table row, set this use into state.updateUser and display the user info into update form
            //must copy a structure, otherwise, edit the user info in update form, it will change the table data
            newState.updateUser = {...action.data};
            return newState;
        case 'refreshUserList':
            DataContext.users.set(action.data.id, action.data);
            newState.userList = DataContext.users;
            return newState;
        default: return state;
    }
}

function UserMgmt() {

    const initState = {
        userList: DataContext.users,
        updateUser: {name : '', id: '', password: '', available: false}, //可能是MaterialUI的bug, 如果不设定一个初始值, 通过修改state, 界面显示不正常
    };
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <UserContext.Provider value={{state, dispatch}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <UserTable users={state.userList}/>
                        </Grid>
                        <Grid item xs={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <AddUserForm/>
                                </Grid>
                                <Grid item xs={12}>
                                    <UpdateUserForm/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </UserContext.Provider>
    );
}

export default UserMgmt;