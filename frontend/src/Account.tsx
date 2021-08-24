import { Avatar, Button, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, makeStyles, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core"
import { AccountCircleOutlined, Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { FieldSpecificAPIResponse, useAuth, UserState } from "./use-auth";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(5),
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
    },
}));

function Account() {

    const classes = useStyles();
    const auth = useAuth();
    const history = useHistory();

    const [values, setValues] = useState<UserState>({
        displayName: '',
        username: '',
        email: '',
        password: '',
    });

    const [apiResponse, setApiResponse] = useState<FieldSpecificAPIResponse>({
        success: false,
        field: '',
        error: '',
    })

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (prop: keyof UserState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        if (!auth.authenticated)
            history.push('/login')
    }, [auth, history]);

    useEffect(() => {

        setValues({
            username: auth.user.username,
            email: auth.user.email,
            displayName: auth.user.displayName,
            password: '',
        });
    }, [auth])

    return (
        <Container maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountCircleOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Your account
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        margin="dense"
                        autoComplete="username"
                        name="username"
                        variant="outlined"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">@</InputAdornment>,
                            placeholder: 'super.cool.username'
                        }}
                        value={values.username}
                        onChange={handleChange('username')}
                        error={apiResponse.field === 'username'}
                        helperText={apiResponse.field === 'username' ? apiResponse.error : ''}
                    />
                    <TextField
                        margin="dense"
                        variant="outlined"
                        autoComplete="email"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange('email')}
                        error={apiResponse.field === 'email'}
                        helperText={apiResponse.field === 'email' ? apiResponse.error : ''}
                    />
                    <TextField
                        margin="dense"
                        variant="outlined"
                        required
                        fullWidth
                        id="displayName"
                        label="Name"
                        name="displayName"
                        value={values.displayName}
                        onChange={handleChange('displayName')}
                    />
                    <FormControl variant="outlined" fullWidth margin="dense">
                        <InputLabel
                            htmlFor="outlined-adornment-password"
                            error={apiResponse.field === 'password'}
                        >
                            New Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={110}
                            error={apiResponse.field === 'password'}
                        />
                        <FormHelperText
                            error={apiResponse.field === 'password'}
                        >
                            {apiResponse.field === 'password' ? apiResponse.error : 'Leave empty to leave your password unchanged'}
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        size="large"
                        onClick={(e) => {
                            e.preventDefault();
                            (async () => {
                                const response = await auth.update(values);
                                setApiResponse(response);
                            })();
                        }}
                    >
                        Update
                    </Button>
                    <Snackbar open={apiResponse.success} autoHideDuration={6000}>
                        <Alert severity="success" onClose={() => { setApiResponse({ success: false, field: '', error: '' }) }}>
                            Account Updated!
                        </Alert>
                    </Snackbar>
                </form>
            </div>
        </Container>)
}

export default Account