import * as React from "react";

export const DataContext = React.createContext({
    timeSlots: [],
    users: new Map(), // key=userId, value = user object

});