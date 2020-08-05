import React, {useReducer} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


export const AppContext = React.createContext(null);

const initialState = {inputText: 'init'};

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                inputText: action.data
            };
        default:
            return initialState;
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Container maxWidth="lg">
            <Grid container spacing={1}>
                <AppContext.Provider value={{state, dispatch}}>

                </AppContext.Provider>
            </Grid>

        </Container>
    );
}

export default App;
