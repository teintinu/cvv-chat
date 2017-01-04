package hoda5Server

import (
	"fmt"
	"net/http"
	"time"
)

func handlePing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, time.Now().Format(time.RFC3339))
}
