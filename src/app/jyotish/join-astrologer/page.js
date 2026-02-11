import React from 'react'
import DefaultPageJyotish from '@/components/Jyotish/DefaultPageJyotish'
import JoinAstrologer from '@/components/Jyotish/JoinAstrologer/JoinAstrologer'

const page = () => {
    return (
        <>
            <DefaultPageJyotish>
                <JoinAstrologer />
            </DefaultPageJyotish>
        </>
    )
}

export default page