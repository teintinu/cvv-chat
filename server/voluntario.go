package hoda5Server

import (

	// "log"
	// "strconv"
	// "strings"

	"appengine"
	// "errors"
)

func soaVoluntarioConectar(contexto appengine.Context, token string, texto bool, audio bool, video bool) (fila *Fila, err error) {
  fila=nil;
	if texto {
		_,fila,err=soaDisponibilizar(contexto, token, "texto")
    if (err!=nil) {
      return nil,err
    }
	}
	if audio {
		_,fila,err=soaDisponibilizar(contexto, token, "audio")
    if (err!=nil) {
      return nil,err
    }
	}
	if video {
		_,fila,err=soaDisponibilizar(contexto, token, "video")
    if (err!=nil) {
      return nil,err
    }
	}
  return fila,nil
}
