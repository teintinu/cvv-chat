package hoda5Server

import (

	"log"
	// "strconv"
	// "strings"

	"appengine"
	// "errors"
)

func soaVoluntarioConectar(contexto appengine.Context, status *Status, token string, texto bool, audio bool, video bool) (err error) {
  log.Printf("\n1")
  var nomefila="v:"+token;
	if texto {
		_,status.Voluntarios.texto,err=soaDisponibilizar(contexto, nomefila, "texto")
    if (err!=nil) {
      return nil,err
    }
	}
  log.Printf("\n2")
	if audio {
		_,status.Voluntarios.,err=soaDisponibilizar(contexto, nomefila, "audio")
    if (err!=nil) {
      return nil,err
    }
	}
	if video {
		_,status.Voluntarios.,err=soaDisponibilizar(contexto, nomefila, "video")
    if (err!=nil) {
      return nil,err
    }
	}
  return nil
}
