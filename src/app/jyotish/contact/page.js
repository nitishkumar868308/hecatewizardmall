import React from 'react'
import DefaultPageJyotish from '@/components/Jyotish/DefaultPageJyotish'
import ContactUs from '@/components/Jyotish/Contact/ContactUs'

const page = () => {
    return (
        <>
            <DefaultPageJyotish>
                <ContactUs />
            </DefaultPageJyotish>
        </>
    )
}

export default page