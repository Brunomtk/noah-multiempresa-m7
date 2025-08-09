import type React from "react"
import type { Material } from "../../types"
import MaterialList from "./material-list"

interface MaterialsContentProps {
  filteredMaterials: Material[] | null
  lowStockMaterials: Material[] | null
  outOfStockMaterials: Material[] | null
}

const MaterialsContent: React.FC<MaterialsContentProps> = ({
  filteredMaterials,
  lowStockMaterials,
  outOfStockMaterials,
}) => {
  // No início do componente, adicione verificações de segurança:
  const safeFilteredMaterials = filteredMaterials?.filter((material) => material != null) || []
  const safeLowStockMaterials = lowStockMaterials?.filter((material) => material != null) || []
  const safeOutOfStockMaterials = outOfStockMaterials?.filter((material) => material != null) || []

  return (
    <div>
      <h2>Filtered Materials</h2>
      <MaterialList materials={safeFilteredMaterials} />

      <h2>Low Stock Materials</h2>
      <MaterialList materials={safeLowStockMaterials} />

      <h2>Out of Stock Materials</h2>
      <MaterialList materials={safeOutOfStockMaterials} />
    </div>
  )
}

export default MaterialsContent
