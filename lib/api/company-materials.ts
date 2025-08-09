// This file was deleted but we need to export the missing API for compatibility
export const companyMaterialsApi = {
  getMaterials: async () => {
    console.warn("Company materials API has been removed")
    return { data: [], error: null }
  },
  createMaterial: async () => {
    console.warn("Company materials API has been removed")
    return { data: null, error: "Feature removed" }
  },
  updateMaterial: async () => {
    console.warn("Company materials API has been removed")
    return { data: null, error: "Feature removed" }
  },
  deleteMaterial: async () => {
    console.warn("Company materials API has been removed")
    return { success: false, error: "Feature removed" }
  },
}
