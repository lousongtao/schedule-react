import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {DataContext} from "../utils/DataContext";
import React, {useContext} from "react";
import {UserContext} from "./UserMgmt";


function UserTable() {
    const {state, dispatch} = useContext(UserContext);

    function doubleClickUser(user) {
        dispatch({type: 'chooseUpdateUser', data: user});
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Shift Times</TableCell>
                        <TableCell>Available</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(state.userList.values()).map(user => (
                        <TableRow key={user.id} hover={true} onDoubleClick={() => doubleClickUser(user)}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.shiftTimes}</TableCell>
                            <TableCell>{user.available? '✓  ': '  ×'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;