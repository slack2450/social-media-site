import { Typography, makeStyles, Container, Avatar, TextField, Grid, InputAdornment, FormControl, InputLabel, OutlinedInput, IconButton, Button, FormHelperText } from "@material-ui/core"
import { LockOutlined, Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { UserState, useAuth } from "./use-auth";

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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    fieldFix: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
    },
}));

interface ErrorField {
    field: string,
    message: string,
}

function Register() {

    const auth = useAuth();
    const history = useHistory();

    const classes = useStyles();

    const [values, setValues] = React.useState<UserState>({
        displayName: '',
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = React.useState<ErrorField>({
        field: '',
        message: '',
    })

    const [showPassword, setShowPassword] = React.useState(false);

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
        if (auth.authenticated)
            history.push('/')
    }, [auth, history])

    return (
        <Container maxWidth='sm'>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="name"
                                name="displayName"
                                variant="outlined"
                                required
                                fullWidth
                                id="displayName"
                                label="Name"
                                autoFocus
                                value={values.displayName}
                                onChange={handleChange('displayName')}
                                error={error.field === 'displayName'}
                                helperText={error.field === 'displayName' ? error.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
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
                                error={error.field === 'username'}
                                helperText={error.field === 'username' ? error.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField className={classes.fieldFix}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={values.email}
                                onChange={handleChange('email')}
                                error={error.field === 'email'}
                                helperText={error.field === 'email' ? error.message : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel
                                    htmlFor="outlined-adornment-password"
                                    error={error.field === 'password'}
                                >
                                    Password
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
                                    labelWidth={70}
                                    error={error.field === 'password'}
                                />
                                <FormHelperText
                                    error={error.field === 'password'}
                                >{error.field === 'password' ? error.message : ''}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        size="large"
                        onClick={(e) => {
                            e.preventDefault();
                            setError({
                                field: '',
                                message: '',
                            });
                            (async () => {
                                const response = await auth.signup(values);
                                setError({
                                    field: response.field,
                                    message: response.error,
                                });
                            })()

                        }}
                    >
                        Register
                    </Button>
                    <Typography variant="caption">By registering you agree to the use of cookies</Typography>
                </form>
            </div>
        </Container>
    )
}

export default Register