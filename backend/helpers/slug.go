package helpers

import (
	"regexp"
	"strings"
)

// Slugify mengubah teks menjadi slug URL-friendly.
//
// Function ini mengubah teks menjadi huruf kecil, menghapus karakter selain
// huruf/angka/spasi/tanda hubung, lalu mengganti spasi dengan tanda hubung.
//
// Contoh:
//
//	slug := helpers.Slugify("Kaos Polos Hitam") // hasil: "kaos-polos-hitam"
func Slugify(text string) string {
	slug := strings.TrimSpace(text)

	slug = strings.ToLower(slug)

	re := regexp.MustCompile(`[^a-z0-9\s-]`)
	slug = re.ReplaceAllString(slug, "")

	slug = strings.ReplaceAll(slug, " ", "-")

	reDoubleDash := regexp.MustCompile(`-+`)
	slug = reDoubleDash.ReplaceAllString(slug, "-")

	slug = strings.Trim(slug, "-")

	return slug
}
