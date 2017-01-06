package hoda5Server

import (
	"net/http"

	"github.com/pubnub/go/messaging"
)

func init() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/site/index.html", http.StatusMovedPermanently)
	})
	http.HandleFunc("/api/ping", handlePing)

  var publishKey = "pub-c-49136a4f-fa36-4cb8-9218-52c6aeb38b85";
	var subscribeKey = "sub-c-9200256c-d334-11e6-b72f-02ee2ddab7fe"
	var secretKey = "sec-c-ZTI1NDgwMTUtNDRjOC00ODhmLWE0ZmMtZmRlYTViM2UyMjBk"
	var cipherKey = ""
	var sslOn = false
	var customUuid = ""
	var pubnub = messaging.NewPubnub(publishKey, subscribeKey, secretKey, cipherKey, sslOn, customUuid)
	var channel = "hello_world"
}
