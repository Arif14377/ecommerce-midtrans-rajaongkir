package helpers

import "github.com/arif14377/ecommerce-midtrans-rajaongkir/models"

func GetPermissionMap(roles []models.Role) map[string]bool {
	permissionMap := make(map[string]bool)

	for _, role := range roles {
		for _, perm := range role.Permissions {
			permissionMap[perm.Name] = true
		}
	}

	return permissionMap
}
