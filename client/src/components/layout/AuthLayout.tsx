import React from "react"

type AuthLayoutProps = {
    children: React.ReactNode
}

export const AuthLayout = (props: AuthLayoutProps) => {
    return <div className="mx-auto flex flex-col justify-center items-center w-1/3 min-w-36 h-full">
        {props.children}
    </div>
}