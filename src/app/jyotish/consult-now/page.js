import React from 'react'
import DefaultPageJyotish from '@/components/Jyotish/DefaultPageJyotish';
import ConsultNow from '@/components/Jyotish/ConsultNow/ConsultNow';

const page = () => {
    return (
        <>
            <DefaultPageJyotish>
                <ConsultNow />
            </DefaultPageJyotish>
        </>
    )
}

export default page