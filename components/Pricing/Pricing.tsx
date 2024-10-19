// export default Pricing;
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import axios from 'axios';

interface Props {

}

const Pricing: React.FC<Props> = (props) => {

    const [loading, setLoading] = useState(false);

    // const { location } = props;
    const [response, setResponse] = useState('');


    const data = {
        price: 300,
    }
    // const handleCheckout = async () => {
    //     setLoading(true);

    //     const { res, err } = await ArtPortfolioServer.checkout(data)
    //     if (err) {
    //         enqueueSnackbar('Server Error', { variant: 'error' });
    //     }
    //     else {
    //         console.log(res)
    //         // if (res.data?.length > 30) {
    //         //     setLoading(false);
    //         //     window.location.replace(res.data);
    //         // } else {
    //         //     alert('Checkout failed'); // eslint-disable-line no-alert
    //         // }
    //     }
    // }

    // const handlePayment = () => {
    //     handleCheckout();
    // }
    const onHandleCheckout = async () => {
        setLoading(true);

        const SERVER_URL =
            'http://localhost:8000';

        const res = await axios.post(`${SERVER_URL}/payments/checkout`, data);

        console.log(res);
        if (res.data.GatewayPageURL?.length > 30) {
            setLoading(false);
            window.location.replace(res.data.GatewayPageURL);
        } else {
            alert('Checkout failed'); // eslint-disable-line no-alert
        }
    };

    useEffect(() => {
        const path = window.location.pathname?.split('/')[2];
        if (path && path === 'success') setResponse('success');
        else if (path && path === 'fail') setResponse('failed');
        else if (path && path === 'cancel') setResponse('canceled');
    }, []);


    return (
        <>
            {response.length > 0 && (
                <div style={{ margin: '5rem', textAlign: 'center' }}>
                    <h3
                        style={{
                            margin: '2.5rem 0',
                            color:
                                // eslint-disable-next-line no-nested-ternary
                                response === 'success'
                                    ? 'green'
                                    : response === 'failed'
                                        ? 'red'
                                        : '#ff8300',
                        }}
                    >
                        payment {response}
                    </h3>
                    {response === 'success' && (
                        <h4 style={{ margin: '2.5rem 0' }}>
                            Your transaction id is{' '}
                            <strong style={{ color: 'gray' }}>
                                {location.pathname.split('/')[3]}
                            </strong>
                        </h4>
                    )}

                    <Link href="/login">
                        <button
                            type="button"
                            style={{
                                margin: '2.5rem 0',
                                padding: '8px 14px',
                                border: 'none',
                                background: 'black',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                borderRadius: '25px',
                            }}
                        >
                            Go back to home page
                        </button>
                    </Link>
                </div>
            )}
            <div>
                <p>Price: {data.price}</p>
                <button
                    type="button"
                    id="button"
                    style={{ marginTop: '2rem' }}
                    onClick={onHandleCheckout}
                    disabled={loading}
                >
                    {loading && (
                        <>

                            <span>Checking out...</span>
                        </>
                    )}
                    {!loading && <span>Checkout</span>}
                </button>
            </div>
        </>

    )


}

export default Pricing;