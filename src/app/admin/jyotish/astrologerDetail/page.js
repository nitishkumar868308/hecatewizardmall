import React from 'react'
import DefaultPageAdmin from '@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin'
import AstologerDetail from '@/components/Admin/jyotish/AstologerDetail/AstologerDetail'

const page = () => {
    return (
        <>
            <DefaultPageAdmin>
                <AstologerDetail />
            </DefaultPageAdmin>
        </>
    )
}

export default page