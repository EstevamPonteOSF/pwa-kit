/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import {FormattedMessage, useIntl} from 'react-intl'

// Components
import {
    Text
} from '@chakra-ui/react'

const ProductDetails = ({product}) => {
    return (
        <div className="t-product-details" itemScope itemType='http://schema.org/Product'>
            <Text>This product is: {product.name}</Text>
            {product && (
                <Helmet>
                    <title>{product.name}</title>
                    <meta name='description' content={product.name}/>
                </Helmet>
            )}
        </div>
    )
}

ProductDetails.getTemplateName = () => "product-details"

ProductDetails.shouldGetProps = async ({previousParams, params}) => {
   return !previousParams || previousParams.productId !== params.productId
}

ProductDetails.getProps = async ({params, api}) => {
    await api.auth.login()
    console.log(api)
    const product = await api.shopperProducts.getProduct({
        parameters: {id: params.productId, allImages: true}
    })
    return {
        product: product
    }
}

ProductDetails.propType = {
    errorMessage: PropTypes.string,
    product: PropTypes.object,
    params: PropTypes.object,
    trackPageLoad: PropTypes.func
}

export default ProductDetails
