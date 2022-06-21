import {
  CheckoutLineFragment,
  Money,
  OrderLineFragment,
} from "@/checkout/graphql";

export const getTaxPercentage = (taxCost: Money, totalPrice: Money): string => {
  if (!totalPrice?.amount || !taxCost?.amount) {
    return (0).toFixed(2);
  }

  return (taxCost.amount / totalPrice.amount).toFixed(2);
};

export const isCheckoutLine = (
  line: CheckoutLineFragment | OrderLineFragment
): line is CheckoutLineFragment => line.__typename === "CheckoutLine";

export const getThumbnailFromLine = (line: CheckoutLineFragment) =>
  line.variant.media?.find(({ type }) => type === "IMAGE") ||
  line.variant.product.media?.find(({ type }) => type === "IMAGE");

export const getSummaryLineProps = (
  line: OrderLineFragment | CheckoutLineFragment
) =>
  isCheckoutLine(line)
    ? {
        variantName: line.variant.name,
        productName: line.variant.product.name,
        productImage: getThumbnailFromLine(line),
        allAttributes: line.variant.metadata.map((attribute) => {
          return {
            name: attribute.key,
            value: attribute.value,
          }
        }),
        totalPrice: line.totalPrice.gross.amount
      }
    : {
        variantName: line.variantName,
        productName: line.productName,
        productImage: line.thumbnail,
        allAttributes: line.variant.metadata.map((attribute) => {
          return {
            name: attribute.key,
            value: attribute.value,
          }
        }),
        totalPrice: line.totalPrice.gross.amount
      };


type BreakdownItem = {
  code: string
  currency: string
  description: string
  fareType: string
  name: string
  passenger_number: string
  price: string
  __typename: string
}

const validateJSONBeforeParse = (data: string) :string => {
  data = data.replace(/None|'None'|False|True/g, '""')
  data = data.replace(/'/g, '"')

  return data
}

export const constructJSONAttributes = (
  (priceItem: string): any => {
  priceItem = validateJSONBeforeParse(priceItem)

  console.log(priceItem)
  const priceItemJSON = JSON.parse(priceItem ? priceItem : "{}")
  console.log(priceItemJSON)

  if(priceItemJSON){
    const nbOfGuests = priceItemJSON[0]['breakdown_items'].filter((breakdown: BreakdownItem) => breakdown.code === 'AMCT').length
    console.log(nbOfGuests)

    //full breakdown of each single passenger for easy accessibility and easy display
    const breakdownItems: any = {}
    let breakdownPerPassenger: Record<string, any> = {}
    let total = 0
    for(let i = 1; i <= nbOfGuests; i++){
      priceItemJSON[0]['breakdown_items'].filter((breakdown: BreakdownItem) => 
        parseInt(breakdown.passenger_number) === i
      ).forEach((breakdown: BreakdownItem) => {
        breakdownPerPassenger[breakdown.code] = {
          code: breakdown.code,
          currency: breakdown.currency,
          description: breakdown.description,
          fareType: breakdown.fareType,
          name: breakdown.name,
          passengerNumber: breakdown.passenger_number,
          price: breakdown.price,
          __typename: breakdown.__typename
          }
        }
      )

      breakdownItems[i] = breakdownPerPassenger
      breakdownPerPassenger = {}
    }
    
    console.log(breakdownItems)
    console.log(total)
    return {
      breakdownItemsPerPassenger: breakdownItems,
      priceItems: priceItemJSON[0],
    }
  } else {
    return {
    breakdownItemsPerPassenger: null,
    priceItems: null,
  }
}
})

