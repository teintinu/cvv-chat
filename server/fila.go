package hoda5Server


import (
	// "fmt"
	// "log"
	// "strconv"
	// "strings"
	// "time"

	"appengine"
	"appengine/datastore"
	"appengine/memcache"

	// "errors"
)

var filaEntity = "h5_001"

type Fila struct {
	Voluntarios       []FilaVoluntario `datastore:",noindex"`
	OP       []FilaOP `datastore:",noindex"`
}

type FilaVoluntario struct {  
  token  string  `datastore:",noindex"`
  pausado  bool  `datastore:",noindex"`
	texto    bool `datastore:",noindex"`
	voz      bool `datastore:",noindex"`
	video    bool `datastore:",noindex"`
}

type FilaOP struct {
  token  string  `datastore:",noindex"`
	texto    bool `datastore:",noindex"`
	voz      bool `datastore:",noindex"`
	video    bool `datastore:",noindex"`
}

type FilaCache struct {
	key  *datastore.Key
	data *Fila
}


func qryFila(contexto appengine.Context) (fila *FilaCache, err error) {

	var cache FilaCache
	var chavecache = "hoda5-cvv-chat"

	var _, cacheerr = memcache.Gob.Get(contexto, chavecache, &cache)
	if cacheerr == nil {
		return &cache, nil
	}

	cache.key = datastore.NewKey(contexto, filaEntity, chavecache, 0, nil)
  var data Fila
	err = datastore.Get(contexto, cache.key, data)

	if err != nil {
    cache.data = &Fila{
      Voluntarios: []FilaVoluntario{},
      OP: []FilaOP{},
    }
    _, err = datastore.Put(contexto, cache.key, &data)
    if err != nil {
      return nil, err;
    }
	}
	cache.data = &data
  fila=&cache
	var item = &memcache.Item{
		Key:    chavecache,
		Object: cache,
	}
	memcache.Gob.Set(contexto, item)
	return
}

func soaDisponibilizar(contexto appengine.Context, token string, canal string) (fila *FilaCache, err error) {
  fila, err = qryFila(contexto);
  var v = procura_voluntario(fila)
  return
}

func procura_voluntario(fila *FilaCache, token string) *FilaVoluntario {
	for i := 0; i < len(fila.data.Voluntarios); i++ {
		var v = &fila.data.Voluntarios[i]
    if (v.token == token) return *v;
	}
  return nil;
}

	// if token == "" {
	// 	return nil, errors.New("LaboratorioOpCadastrar precisa de token")
	// }
	// if len(codigo) != 2 {
	// 	return nil, errors.New("LaboratorioOpCadastrar codigo invalido " + codigo)
	// }
	// var cd, _ = strconv.ParseUint("0x"+codigo, 0, 64)
	// if cd < 0 || cd > 0xFF {
	// 	return nil, errors.New("LaboratorioOpCadastrar codigo deve estar entre 0 e 255")
	// }
	// if sigla == "" {
	// 	return nil, errors.New("LaboratorioOpCadastrar precisa de codLab")
	// }
	// var _, errold = qryLaboratorioPorCodigo(contexto, codigo)
	// if errold == nil {
	// 	return nil, errors.New("token já existe em " + sigla + " codigo=" + codigo)
	// }
	// var _, errold2 = qryLaboratorioPorToken(contexto, token)
	// if errold2 == nil {
	// 	return nil, errors.New("token já existe em " + sigla + " token=" + token)
	// }
	// var data = Laboratorio{
	// 	CodLab:       codigo,
	// 	Sigla:        sigla,
	// 	Chaves:       []string{token},
	// 	BytesOnline:  0,
	// 	BytesArquivo: 0,
	// }
	// var l LaboratorioCache
	// l.data = &data
	// l.key = datastore.NewKey(contexto, LaboratorioEntity, data.CodLab, 0, nil)

	// var errget = datastore.Get(contexto, l.key, &data)
	// if errget == nil {
	// 	return nil, errors.New("ja existe sigla: " + sigla + " token=" + token)
	// }
	// _, err = datastore.Put(contexto, l.key, &data)
	// lab = &l
	// return
}
