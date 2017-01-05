package hoda5Server

import (
	"log"
	// "strconv"
	// "strings"
	"time"

	"appengine"
	"appengine/datastore"
	"appengine/memcache"
	// "errors"
)

// entidy
var filaEntity = "h5_fila"
 
// data
type Fila struct {
	TS     time.Time `datastore:",noindex"`
	Tokens []string `datastore:",noindex"`
}

// cache
type FilaCache struct {
	key  *datastore.Key
	data *Fila
}

// cache
type FilaCacheTokens = []string

func qryFila(contexto appengine.Context, nome string) (fila FilaCacheTokens, err error) {

	var chaveCache = FilaEntity+nome
	log.Printf("qryFila %v", chave_cache)

	var cache FilaCache

	var _, cacheerr = memcache.Gob.Get(contexto, chave_cache, &cache)
	if cacheerr == nil {
		log.Printf("qryFila get cache %v", cache)
		return &cache, nil
	}	

	var ancestor []*datastore.Key
	var rm_keys []*datastore.Key
	var novo FilaCache

  ancestor, cache, novo, rm_keys, err = load(contexto, nome)

	if err == datastore.Done {
		cache=novo;
		_, err = datastore.Put(contexto, cache.key, cache.data)
	} 
	if err != nil {
		return nil, err
	}

	fila = cache
	var item = &memcache.Item{
		Key:    chave_cache,
		Object: cache,
	}
  log.Printf("qryFila set cache %v + %v", item.Key, item.Object)
	memcache.Gob.Set(contexto, item)
	if len(rm_keys)>0 {
	  _ = datastore.DeleteMulti(contexto, rm_keys)
	}
	return
}

func updFila(m_contexto appengine.Context, nome string, upd_fn func(fila *Fila) (updated bool, err error)) (updated bool, filaUpd *Fila, err error) {
	var chave_cache = FilaEntity+nome
	log.Printf("updFila %v", chave_cache)
	updated=false
  var rm_keys []*datastore.Key
	var cache FilaCache; 
	
	err=datastore.RunInTransaction(m_contexto, func (contexto appengine.Context) error {
		  var ancestor []*datastore.Key
			var maior FilaCache
			var novo FilaCache
			var rm_keys []*datastore.Key
			
			ancestor, maior, novo, rm_keys, err = load(contexto, nome)

			var cache=novo;

			log.Printf("updFila - upd_fn - %v ", data)
			updated, err = upd_fn(cache.data);
			if err != nil {
				log.Printf("updFila - upd_fn - err")
				return err
			}   
			if (updated) {
				log.Printf("updFila - upd_fn - update %v", data)
				cache.key=datastore.NewKey(contexto, FilaEntity, "", data.TS.Unix(), ancestor)
				cache.data=&data
			  _, err = datastore.Put(contexto, cache.key, &data)
  			log.Printf("gravado %v %v %v", cache.key, &data, err)
				var item = &memcache.Item{
					Key:    chave_cache,
					Object: cache,
				}
				log.Printf("updFila set cache %v + %v", item.Key, item.Object)
				memcache.Gob.Set(contexto, item)
			}

			var rm_key, rm_err = cursor.Next(&data)
			for rm_err != datastore.Done {
				rm_keys=append(rm_keys, rm_key)
				rm_key, rm_err = cursor.Next(&data)
			}
  		return err
	}, nil)	

	if len(rm_keys)>0 {
			  _ = datastore.DeleteMulti(contexto, rm_keys)
	}
	
	return updated, cache.data, err;
}

func load(contexto appengine.Context, nome string ) (ancestor []*datastore.Key, maior FilaCache, novo FilaCache, rm_keys []*datastore.Key, err error  ) {
	ancestor=datastore.NewKey(contexto, FilaEntity, nome, 0, nil)
	var query = datastore.
		NewQuery(FilaEntity).
		Ancestor(ancestor)
		
	var cursor = query.Run(contexto)
	var data Fila;
	var key []*datastore.Key
	var first = true
	key, err = cursor.Next(&data)
	maior = FilaCache{	
		key: key,
		data: &data,
	}
	for err != datastore.Done {
		if (first) {
			first=false
		} else {
			if (maior.data.TS < data.TD) {
		    rm_keys=append(rm_keys, maior.key)
				maior = FilaCache{	
					key: key,
					data: &data,
				}
			} else {
		    keys=append(rm_keys, key)
			}
		  key, err = cursor.Next(&data)
		}
	}	
	novo.key=datastore.NewKey(contexto, FilaEntity, "", data.TS.Unix(), ancestor)		
	if (first) {
		novo.data = Fila{
			TS: time.Now(),
			Tokens: []string{},
		} 
	}	else {
		novo.data = maior.data;
		novo.data.TS=time.Now(),
		if (err = datastore.Done) {
			err=nil;
		}
	}
	return
}

func soaDisponibilizar(contexto appengine.Context, token string, canal string) (updated bool, fila *Fila, err error) {	
	log.Printf("soaDisponibilizar %v %v", token, canal)
	return updFila(contexto, canal, func(fila *Fila) (updated bool, err error) {		
		log.Printf("antes %v", fila)
	  updated = put_token(fila, token)
		log.Printf("depois %v", fila)
		return updated, nil
	})	
}

func put_token(fila *Fila, token string) bool{
	for i := 0; i < len(fila.Tokens); i++ {		
		if fila.Tokens[i] == token {
			return false
		}
	}

	fila.Tokens = append(fila.Tokens, token)
  return true;
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
