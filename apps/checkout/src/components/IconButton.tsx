import { AriaLabel } from "@/checkout/lib/globalTypes";
import {
  IconButton as UiKitIconButton,
  IconButtonProps as UiKitIconButtonProps,
} from "@saleor/ui-kit";

export type IconButtonProps = AriaLabel & UiKitIconButtonProps;

export const IconButton: React.FC<IconButtonProps> = ({
  ariaLabel,
  ...rest
}) => <UiKitIconButton aria-label={ariaLabel} {...rest} />;
