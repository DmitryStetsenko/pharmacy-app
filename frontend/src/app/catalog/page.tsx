import { Suspense } from "react";
import { CatalogPage } from "@/pages-flat/catalog/ui/CatalogPage";

export default function Catalog() {
  return (
    <Suspense fallback={<div>Завантаження каталогу...</div>}>
      <CatalogPage />
    </Suspense>
  );
}
