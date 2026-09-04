"use client";

import { useEffect } from "react";
import { trackCommerceEvent } from "@/lib/analytics/events";

export default function ProductView({
  id,
  name,
  currency,
  value,
}: {
  id: string;
  name: string;
  currency: string;
  value: number;
}) {
  useEffect(() => {
    trackCommerceEvent("view_item", {
      currency,
      value,
      items: [{ item_id: id, item_name: name, price: value, quantity: 1 }],
    });
  }, [id, name, currency, value]);

  return null;
}
