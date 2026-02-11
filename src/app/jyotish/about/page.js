import React from 'react'
import DefaultPageJyotish from '@/components/Jyotish/DefaultPageJyotish'
import AboutUs from '@/components/Jyotish/About/AboutUs'

const page = () => {
    return (
        <>
            <DefaultPageJyotish>
                <AboutUs />
            </DefaultPageJyotish>
        </>
    )
}

export default page