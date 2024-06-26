import { useEffect, useRef } from "react"
import useScript from "react-script-hook"

declare global {
    interface Window {
        onGoogleLogin: (arg: any) => void
    }
}

type GoogleLoginProps = {
    onLogin: (token: string) => void
}

export const GoogleLogin = (props: GoogleLoginProps) => {
    const googleButton = useRef<HTMLDivElement | null>(null);

    const onGoogleLogin = (response: google.accounts.id.CredentialResponse) => {
        props.onLogin(response.credential)
    }

    const [gsiLoading, gsiError] = useScript({
        src: "https://accounts.google.com/gsi/client",
        onload: () => {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: onGoogleLogin
            })
        }
    })

    useEffect(() => {
        if (!gsiLoading && !gsiError && googleButton.current !== null) {
            window.google.accounts.id.renderButton(googleButton.current, {
                type: "standard",
                shape: 'rectangular',
                theme: 'filled_black',
                text: 'continue_with',
                size: 'medium',
                logo_alignment: 'left'
            });
        }
    }, [gsiLoading, gsiError, googleButton])


    return <>
        <div ref={googleButton}></div>
    </>
}