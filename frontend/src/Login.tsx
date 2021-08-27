import { Avatar, Button, Container, makeStyles, TextField, Typography } from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PasswordField from "./PasswordField";
import { useAuth } from "./use-auth";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
    },
}));

function Login() {
    const classes = useStyles();
    const history = useHistory();

    const auth = useAuth();

    const [userIdentifier, setUserIdentifier] = useState('');
    const [userIdentifierError, setUserIdentifierError] = useState(false);
    const [userIdentifierHelperText, setUserIdentifierHelperText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelperText, setPasswordHelperText] = useState('');

    useEffect(() => {
        if (auth.authenticated)
            history.push('/')
    }, [auth, history])

    return (
        <Container maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="userIdentifier"
                        label="Username or email"
                        name="userIdentifier"
                        autoComplete="on"
                        autoFocus
                        value={userIdentifier}
                        onChange={(e) => setUserIdentifier(e.target.value)}
                        error={userIdentifierError}
                        helperText={userIdentifierHelperText}
                    />
                    <PasswordField
                        variant="outlined"
                        label="Password"
                        id="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        helperText={passwordHelperText}
                     />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        size="large"
                        onClick={(e) => {
                            e.preventDefault();
                            setUserIdentifierError(false);
                            setUserIdentifierHelperText('');
                            setPasswordError(false);
                            setPasswordHelperText('');
                            (async () => {
                                const response = await auth.signin(userIdentifier, password);
                                switch (response.field) {
                                    case 'userIdentifier':
                                        setUserIdentifierError(true);
                                        setUserIdentifierHelperText(response.error)
                                        break;
                                    case 'password':
                                        setPasswordError(true);
                                        setPasswordHelperText(response.error)
                                        break;
                                    default:
                                        break;
                                };
                            })()
                        }}
                    >
                        Sign In
                    </Button>
                </form>
            </div>

        </Container>)
}

export default Login