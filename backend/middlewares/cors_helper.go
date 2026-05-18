package middlewares

import (
	"strings"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/config"
)

func GetCORSOrigins() []string {
	originsEnv := config.GetEnv("FRONTEND_URL")
	rawOrigins := strings.Split(originsEnv, ",")
	uniqueMap := make(map[string]bool)

	var cleanOrigins []string
	for _, o := range rawOrigins {
		trimmed := strings.TrimSpace(o)
		trimmed = strings.Trim(trimmed, "\"'")
		trimmed = strings.TrimRight(trimmed, "/")

		if trimmed == "" {
			continue
		}

		if !uniqueMap[trimmed] {
			uniqueMap[trimmed] = true
			cleanOrigins = append(cleanOrigins, trimmed)
		}
	}

	return cleanOrigins
}
