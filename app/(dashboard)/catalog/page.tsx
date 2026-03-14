import { Package } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { getCatalogs, getProducts } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Catalogs"
};

export default async function CatalogPage() {
  const [catalogs, products] = await Promise.all([getCatalogs(), getProducts()]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Catalog Management"
        description="Manage supplier catalogs, pricing, and availability."
      />
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Supplier Catalogs</CardTitle>
          </CardHeader>
          <CardContent>
            {catalogs.length === 0 ? (
              <EmptyState
                title="No catalogs"
                description="Catalogs will appear once suppliers upload data."
                icon={<Package className="h-5 w-5" />}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catalog</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogs.map((catalog) => (
                    <TableRow key={catalog.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {catalog.name}
                      </TableCell>
                      <TableCell>{catalog.supplier?.name ?? "Unassigned"}</TableCell>
                      <TableCell>
                        <Badge variant={catalog.status === "active" ? "success" : "neutral"}>
                          {catalog.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{catalog.products_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <EmptyState
                title="No products"
                description="Add products to build supplier catalogs."
                icon={<Package className="h-5 w-5" />}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Catalog</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice(0, 6).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.sku ?? "-"}</TableCell>
                      <TableCell>
                        {product.price
                          ? `${product.currency ?? "USD"} ${Number(product.price).toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell>{product.catalog?.name ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
