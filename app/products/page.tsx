// app/products/page.tsx
import swell from "../../lib/swell";
import ProductsClient from "./ProductsClient";

export const revalidate = 60;

export default async function ProductsPage() {
  const response = await swell.products.list({
    limit: 20,
    expand: ["images"],
  });

  return <ProductsClient products={response.results} />;
}