import dynamic from 'next/dynamic'
import React from 'react'

const NoSsr = (props: { children: string | number | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | React.ReactFragment | React.ReactPortal | null | undefined }) => {
    return (
        <React.Fragment>{props.children}</React.Fragment>
    )
}

export default dynamic(() => { return Promise.resolve(NoSsr) }, {
    ssr: false
})