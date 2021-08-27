import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, PropTypes } from "@material-ui/core"
import { Visibility, VisibilityOff } from "@material-ui/icons"
import { useState } from "react";

interface PasswordFieldProps {
    id: string,
    error: boolean,
    value: string,
    onChange(event: React.ChangeEvent<HTMLInputElement>): void,
    label: string,
    helperText: string,
    variant?: "filled" | "outlined" | "standard" | undefined,
    margin?: PropTypes.Margin | undefined,
    className?: string,
}

function PasswordField(props: PasswordFieldProps) {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl variant={props.variant} fullWidth margin={props.margin} className={props.className}>
            <InputLabel
                htmlFor={props.id}
                error={props.error}
            >
                {props.label}
            </InputLabel>
            <OutlinedInput
                id={props.id}
                type={showPassword ? 'text' : 'password'}
                value={props.value}
                onChange={props.onChange}
                required={true}
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
                labelWidth={(props.label.length - 1) * 10}
                error={props.error}
            />
            <FormHelperText error={props.error}>
                {props.helperText}
            </FormHelperText>
        </FormControl>
    )
}

export default PasswordField