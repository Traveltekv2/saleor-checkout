import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { SummaryItem } from "./SummaryItem";
import { OrderFragment } from "@/checkout/graphql";
import { Divider } from "@/checkout/components/Divider";
import { Money } from "@/checkout/components/Money";

import { getTaxPercentage } from "./utils";

export const FinalizedSummary = ({ order }: { order: OrderFragment }) => {
  const formatMessage = useFormattedMessages();

  const totalPrice = order.total.gross;
  const taxCost = order.total.tax;
  const taxPercentage = getTaxPercentage(taxCost, totalPrice);

  return (
    <div className="summary w-[594px]">
      <div className="summary-title open">
        <div className="flex flex-row items-center">
          <Text size="lg" weight="bold">
            {formatMessage("summary")}
          </Text>
        </div>
      </div>

      <div className="w-full h-12" />
      <ul className="summary-items">
        {order.lines.map((line) => (
          <SummaryItem key={line.id} line={line} isOrderConfirmation={true} />
        ))}
      </ul>
      <div className="summary-recap">
        <div className="summary-row">
          <Text weight="bold">{formatMessage("subtotal")}</Text>
          <Money
            ariaLabel={formatMessage("subtotalLabel")}
            weight="bold"
            money={order.subtotal.gross}
          />
        </div>
        <Divider className="my-4" />
        <div className="summary-row">
          <Text color="secondary">
            {formatMessage("taxCost", {
              taxPercentage,
            })}
          </Text>
          <Money
            ariaLabel={formatMessage("taxCostLabel")}
            color="secondary"
            money={taxCost}
          />
        </div>
        <Divider className="my-4" />
        <div className="summary-row">
          <Text size="md" weight="bold">
            {formatMessage("total")}
          </Text>
          <Money
            ariaLabel={formatMessage("totalLabel")}
            weight="bold"
            money={totalPrice}
          />
        </div>
      </div>
    </div>
  );
};
