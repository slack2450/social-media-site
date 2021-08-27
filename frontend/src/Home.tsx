import { Button, Container, Grid, IconButton, InputAdornment, makeStyles, Snackbar, TextField, Typography, withStyles } from "@material-ui/core"
import { FavoriteBorderRounded, FavoriteRounded } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "./use-auth"
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
    },
}));

interface PostInterface {
    content: string,
    date: Date,
    id: number,
    likes: Array<number>,
    owner: {
        displayName: string,
        id: number,
        username: string,
    },
}

const Post = withStyles({
    root: {
        "& .MuiInputBase-root.Mui-disabled": {
            color: "black" // (default alpha is 0.38)
        }
    },
})(TextField);

function Home() {

    const auth = useAuth();
    const classes = useStyles();

    const [newPost, setNewPost] = useState('');
    const [showNewPostMessage, setShowNewPostMessage] = useState(false);
    const [posts, setPosts] = useState<Array<PostInterface>>([]);

    useEffect(() => {
        axios.get('/posts').then(res => setPosts(res.data.posts))
    }, [])

    return (
        <Container maxWidth='sm'>
            <div className={classes.paper}>
                {auth.authenticated ? <>
                    <TextField
                        autoComplete='off'
                        name='newPost'
                        variant='outlined'
                        fullWidth
                        id='newPost'
                        label='New post'
                        autoFocus
                        multiline
                        minRows={3}
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                        onClick={(e) => {
                            e.preventDefault();
                            (async () => {
                                const response = await axios.post('/post', { content: newPost }, { withCredentials: true });
                                if (response.data.success === true) {
                                    setShowNewPostMessage(true)
                                    setNewPost('');
                                    axios.get('/posts').then(res => setPosts(res.data.posts))
                                }
                            })();
                        }}
                    >
                        Post
                    </Button>
                    <Snackbar open={showNewPostMessage} autoHideDuration={6000}>
                        <Alert severity="info" onClose={() => { setShowNewPostMessage(false) }}>
                            New post created!
                        </Alert>
                    </Snackbar>
                </> : <></>
                }
                <Typography><strong>Latest posts</strong></Typography>
                <br />
                <Grid container spacing={2}>
                    {
                        posts.map((post) => {
                            return (
                                <Grid item xs={12} key={post.id}>
                                    <Post
                                        autoComplete='off'
                                        variant='outlined'
                                        fullWidth
                                        label={`${post.owner.displayName} <@${post.owner.username}> at ${post.date}`}
                                        multiline
                                        minRows={3}
                                        value={post.content}
                                        disabled
                                        InputProps={{
                                            endAdornment:
                                                <InputAdornment position="end">
                                                    {post.likes.length}
                                                    {
                                                        post.likes.includes(auth.user.id) ?
                                                            <IconButton color="secondary"
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    axios.post('/unlike', { post: post.id }, { withCredentials: true }).then(() => axios.get('/posts').then(res => setPosts(res.data.posts)))
                                                                }}
                                                            >
                                                                <FavoriteRounded />
                                                            </IconButton>
                                                            :
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    axios.post('/like', { post: post.id }, { withCredentials: true }).then(() => axios.get('/posts').then(res => setPosts(res.data.posts)))
                                                                }}
                                                            >
                                                                <FavoriteBorderRounded />
                                                            </IconButton>
                                                    }

                                                </InputAdornment>
                                        }}
                                    />
                                </Grid>);
                        })
                    }
                </Grid>
            </div>
        </Container>
    )
}

export default Home