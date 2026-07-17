package helpers

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
)

// GetPermissionMap mengubah daftar role user menjadi map permission.
//
// Map yang dihasilkan memudahkan pengecekan permission dengan akses langsung
// berdasarkan nama permission.
//
// Contoh:
//
//	permissionMap := helpers.GetPermissionMap(user.Roles)
//	canCreateProduct := permissionMap["product.create"]
func GetPermissionMap(roles []models.Role) map[string]bool {
	permissionMap := make(map[string]bool)

	for _, role := range roles {
		for _, perm := range role.Permissions {
			permissionMap[perm.Name] = true
		}
	}

	return permissionMap
}
