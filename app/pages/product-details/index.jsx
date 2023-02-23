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
import {Tooltip, Spinner, Text} from '@chakra-ui/react'
import {useCommerceAPI} from '../../commerce-api/contexts'

const ProductDetails = ({product}) => {
    const api = useCommerceAPI()
    const [promotionMap, setPromotionMap] = useState([])
    const {productPromotions} = product
    const handleHover = (id) => {
        // Don't make a network request if you already loaded this data.

       const alreadyIn = promotionMap.findIndex((promo) => promo.id === id) > -1
        if (alreadyIn) {
            return
        }
        const getPromotion = async (id) => {
            const promotions = await api.shopperPromotions.getPromotions({
                parameters: {ids: id}
            })
            const newObject ={
                [id]: promotions.data[0]
            }
            console.log(newObject)
            setPromotionMap((current) => {
                return [...current, promotions.data[0]]
            })
        }
        getPromotion(id)
    }

    return (
        <div className="t-product-details" itemScope itemType='http://schema.org/Product'>
            <Text>This product is: {product.name}</Text>
            {product && (
                <Helmet>
                    <title>{product.name}</title>
                    <meta name='description' content={product.name}/>
                </Helmet>
            )}

            {/* <Text>These are thepromotions</Text>
            {promotions && promotions.map(({id, calloutMsg, details}) => (
                <Tooltip key={id} label={details} aria-label="Promotion detail">
                    <Text >{calloutMsg}</Text>
                </Tooltip>
            ))} */}
            <Text>These are the promotions (if any):</Text>
            {productPromotions &&
                productPromotions.map(({promotionId, calloutMsg}) => {
                    const alreadyIn = promotionMap.findIndex((promo) => promo.id === promotionId) > -1
                    let promo = promotionMap.find((promo) => promo.id === promotionId)
                    
                    return (
                    <Tooltip
                        onOpen={() => {
                            handleHover(promotionId)
                        }}
                        key={promotionId}
                        label={ (alreadyIn && promo.details) || (<Spinner />)
                    }
                    aria-label="Promotion details"
                    >
                    <Text>{calloutMsg}</Text>
                    </Tooltip>
                    )
                })
            }
        </div>
    )
}

ProductDetails.getTemplateName = () => "product-details"

ProductDetails.shouldGetProps = async ({previousParams, params}) => {
   return !previousParams || previousParams.productId !== params.productId
}

ProductDetails.getProps = async ({params, api}) => {
    await api.auth.login()
    const product = await api.shopperProducts.getProduct({
        parameters: {id: params.productId, allImages: true}
    })

    // const promotionsIds = plucksIds(product.productPromotions, "promotionId")

    // const promotions = await api.shopperPromotions.getPromotions({
    //     parameters: {ids: promotionsIds}
    // })

    return {
        product: product,
        // promotions: promotions
    }
}

ProductDetails.propType = {
    errorMessage: PropTypes.string,
    product: PropTypes.object,
    params: PropTypes.object,
    // promotions: PropTypes.array,
    trackPageLoad: PropTypes.func
}

export default ProductDetails
