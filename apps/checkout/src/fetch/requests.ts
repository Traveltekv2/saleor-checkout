import { FetchResponse } from "@/checkout/hooks/useFetch";
import { envVars } from "@/checkout/lib/utils";
import { AppConfig } from "@/checkout/providers/AppConfigProvider/types";
import { PayRequestBody } from "checkout-app/types/api/pay";

export const getPaymentProviders = () =>
  fetch(`${envVars.checkoutAppUrl}/active-payment-providers/channel-1`);

export interface PayResult {
  orderId: string;
  data: {
    paymentUrl: string;
  };
}

export const pay = (body: PayRequestBody): FetchResponse<PayResult> =>
{
  console.log('body in fetch request: ', body)
  console.log('pay api triggered? ', `${envVars.checkoutAppUrl}/pay`)
  const responsePay = fetch(`${envVars.checkoutAppUrl}/pay`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  responsePay.then(res => console.log('what does the api return as a response? ', res))
  
  return fetch(`${envVars.checkoutAppUrl}/pay`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
export const getAppConfig = (): FetchResponse<AppConfig> =>
  fetch(`${envVars.checkoutAppUrl}/customization-settings`);
