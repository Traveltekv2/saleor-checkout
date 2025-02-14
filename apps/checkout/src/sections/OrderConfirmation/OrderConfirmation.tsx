import { Suspense } from "react";

import PageHeader from "@/checkout/sections/PageHeader";
import { FinalizedSummary } from "@/checkout/sections/Summary";
import { OrderInfo } from "@/checkout/sections/OrderInfo";
import { Title } from "@/checkout/components/Title";
import { Text } from "@saleor/ui-kit";
import { useOrder } from "@/checkout/hooks/useOrder";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { Divider } from "@/checkout/components/Divider";
import { SummarySkeleton } from "@/checkout/sections/Summary/SummarySkeleton";
import "./OrderConfirmationStyles.css";

export const OrderConfirmation = ({ orderId }: { orderId: string }) => {
  const { order } = useOrder(orderId);
  const formatMessage = useFormattedMessages();

  return (
    <div className="page">
      <header className="order-header">
        <PageHeader />
        <Title>
          {formatMessage("orderConfirmationTitle", { number: order.number })}
        </Title>
        <Text size="md" className="max-w-[692px]">
          {formatMessage("orderConfirmationSubtitle", {
            email: order.userEmail!,
          })}
        </Text>
      </header>
      <Divider />
      <main className="order-content overflow-hidden">
        <OrderInfo order={order} />
        <div className="order-divider" />
        <Suspense fallback={<SummarySkeleton />}>
          <FinalizedSummary order={order} />
        </Suspense>
      </main>
    </div>
  );
};
