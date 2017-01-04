package hoda5Server

import (
	"net/http"
)

func init() {
	http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, "/site/index.html", http.StatusMovedPermanently)
  });
	http.HandleFunc("/api/ping", handlePing)
	http.HandleFunc("/api/voluntario/conectar", handleVoluntarioConectar)
}
