// use-auth.tsx
// Heavily inspired by:
// https://usehooks.com/useAuth/

import { createContext, useContext, useEffect, useState } from 'react';

import axios from 'axios';

type User = {
    id: number,
    username: string,
    email: string,
    displayName: string
};

const defaultUser: User = { id: -1, username: '', email: '', displayName: '' }

export interface FieldSpecificAPIResponse {
    success: boolean,
    error: string,
    field: string
}

export interface UserState {
    displayName: string;
    username: string;
    email: string
    password: string;
}

interface UseAuthContext {
    authenticated: boolean
    user: User,
    signin(email: string, password: string): Promise<FieldSpecificAPIResponse>,
    signup(state: UserState): Promise<FieldSpecificAPIResponse>,
    signout(): void,
    update(state: UserState): Promise<FieldSpecificAPIResponse>
}

const initialContext: UseAuthContext = {
    authenticated: false,
    user: defaultUser,
    signin: (userIdentifier: string, password: string) => Promise.resolve({ success: false, error: '', field: '' }),
    signup: (state: UserState) => Promise.resolve({ success: false, error: '', field: '' }),
    signout: () => { },
    update: (state: UserState) => Promise.resolve({ success: false, error: '', field: '' }),
}

const authContext = createContext(initialContext);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }: { children: any }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}> {children} </authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth(): UseAuthContext {
    const [user, setUser] = useState<User>(defaultUser);

    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const signin = async (userIdentifier: string, password: string) => {
        const res = await axios.post('/login', { userIdentifier, password }, { withCredentials: true });
        if (res.data.success) {
            setAuthenticated(true);
            setUser(res.data.user);
        }
        return {
            success: res.data.success,
            error: res.data.error || '',
            field: res.data.field || '',
        }
    };

    const signup = async (state: UserState) => {
        console.log(state)
        const res = await axios.post('/register', state, { withCredentials: true });
        if (res.data.success) {
            setAuthenticated(true);
            setUser(res.data.user);
        }

        return {
            success: res.data.success,
            error: res.data.error || '',
            field: res.data.field || '',
        }
    };

    const signout = () => {
        axios.get('/logout');
        setAuthenticated(false);
        setUser(defaultUser);
        return
    };

    const update = async (state: UserState) => {
        console.log(state);
        const response = await axios.put('/user', state, { withCredentials: true });
        if(response.data.success) {
            setUser({
                id: user.id,
                username: state.username,
                email: state.email,
                displayName: state.displayName,
            });
        }

        return {
            success: response.data.success,
            error: response.data.error || '',
            field: response.data.field || '',
        }
    }

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    useEffect(() => {
        // Cleanup subscription on unmount
        return () => setUser(defaultUser);
    }, []);
    // Return the user object and auth methods
    return {
        authenticated,
        user,
        signin,
        signup,
        signout,
        update,
    };
}