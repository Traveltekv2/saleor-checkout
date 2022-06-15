import createMollieClient, { OrderStatus, PaymentMethod } from "@mollie/api-client";

import { OrderFragment, TransactionCreateMutationVariables } from "@/checkout-app/graphql";
import { envVars } from "@/checkout-app/constants";
import { formatRedirectUrl } from "@/checkout-app/backend/payments/utils";

import {
  getDiscountLines,
  getLines,
  getShippingLines,
  parseAmountToString,
} from "./utils";

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

export const createMolliePayment = async (
  data: OrderFragment,
  redirectUrl: string
) => {
  const discountLines = getDiscountLines(data.discounts);
  const shippingLines = getShippingLines(data);
  const lines = getLines(data.lines);
  console.log(envVars.appUrl);
  console.log('URLS REDIRECT')
  console.log(formatRedirectUrl(redirectUrl, data.id))
  const mollieData = await mollieClient.orders.create({
    orderNumber: data.number!,
    webhookUrl: `${envVars.appUrl}/api/webhooks/mollie`,
    locale: "en_US",
    redirectUrl: formatRedirectUrl(redirectUrl, data.id),
    metadata: {
      orderId: data.id,
    },
    lines: [...discountLines, ...shippingLines, ...lines],
    billingAddress: {
      city: data.billingAddress!.city,
      country: data.billingAddress!.country.code,
      email: data.userEmail!,
      givenName: data.billingAddress!.firstName,
      familyName: data.billingAddress!.lastName,
      postalCode: data.billingAddress!.postalCode,
      streetAndNumber: data.billingAddress!.streetAddress1,
      organizationName: data.billingAddress?.companyName,
    },
    amount: {
      value: parseAmountToString(data.total.gross.amount),
      currency: data.total.gross.currency,
    },
    shippingAddress: data.shippingAddress
      ? {
          city: data.shippingAddress.city,
          country: data.shippingAddress.country.code,
          email: data.userEmail!,
          givenName: data.shippingAddress.firstName,
          familyName: data.shippingAddress.lastName,
          postalCode: data.shippingAddress.postalCode,
          streetAndNumber: data.shippingAddress.streetAddress1,
          organizationName: data.shippingAddress.companyName,
        }
      : undefined,
      method: PaymentMethod.paypal,
  });
  
  console.log('mollieData: ' )
  console.log(mollieData)
  return mollieData._links.checkout;
};

export const verifyPayment = async (
  id: string
): Promise<TransactionCreateMutationVariables | undefined> => {
  const { status, amountCaptured, metadata, method, amount } =
    await mollieClient.orders.get(id);

  if (status === OrderStatus.authorized) {
    return {
      id: metadata.orderId,
      transaction: {
        status,
        type: `mollie-${method}`,
        amountAuthorized: {
          amount: amount.value,
          currency: amount.currency,
        },
      },
    };
  }

  if (status === OrderStatus.paid) {
    return {
      id: metadata.orderId,
      transaction: {
        status,
        type: `mollie-${method}`,
        amountCharged: amountCaptured && {
          amount: parseFloat(amountCaptured.value),
          currency: amountCaptured.currency,
        },
      },
    };
  }
};
