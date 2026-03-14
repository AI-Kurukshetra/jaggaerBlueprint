import { DollarSign } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { getExchangeRates } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Exchange Rates"
};

export default async function CurrenciesPage() {
  const rates = await getExchangeRates();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Multi-currency Support"
        description="Maintain up-to-date exchange rates for global suppliers."
      />
      <Card className="p-6">
        {rates.length === 0 ? (
          <EmptyState
            title="No exchange rates"
            description="Rates will appear after integration setup."
            icon={<DollarSign className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Base</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>As Of</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {rate.base_currency}
                  </TableCell>
                  <TableCell>{rate.quote_currency}</TableCell>
                  <TableCell>{Number(rate.rate).toFixed(4)}</TableCell>
                  <TableCell>
                    <Badge variant="neutral">{rate.as_of}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
