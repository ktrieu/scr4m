import { useEffect } from "react"
import { Helmet } from "react-helmet-async"

declare global {
    interface Window {
        onGoogleLogin: (arg: any) => void
    }
}

type GoogleLoginProps = {
    onLogin: (token: string) => void
}

type GoogleLoginResponse = {
    clientId: string,
    client_id: string,
    credential: string,
    select_by: string,
}

export const GoogleLogin = (props: GoogleLoginProps) => {
    useEffect(() => {
        window.onGoogleLogin = (resp: GoogleLoginResponse) => {
            props.onLogin(resp.credential)
        }
    }, [])

    return <>
        <Helmet>
            <script src="https://accounts.google.com/gsi/client" async></script>
        </Helmet>
        <div id="g_id_onload"
            data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            data-context="signin"
            data-ux_mode="popup"
            data-callback="onGoogleLogin"
            data-auto_prompt="false">
        </div>

        <div className="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="filled_black"
            data-text="continue_with"
            data-size="medium"
            data-logo_alignment="left">
        </div>
    </>
}