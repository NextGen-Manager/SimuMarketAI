import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerBoundary } from "@/features/auth/PermissionBoundary";
import { ProductManager } from "@/features/products/ProductManager";

export default function ProductsPage() {
  return <WorkspacePage eyebrow="Usaha" title="Produk" description="Kelola menu, harga jual, dan HPP untuk setiap usaha."><OwnerBoundary><ProductManager /></OwnerBoundary></WorkspacePage>;
}
