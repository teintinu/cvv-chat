package hoda5Server

import (
	"fmt"
	// "log"
	// "strconv"
	// "strings"
	"time"

	"appengine"
	"appengine/datastore"
	"appengine/memcache"
	// "errors"
)

var FilaEntity = "h5_fila_"

type Fila struct {
	TS            time.Time `datastore:",index"`
	tokens []string `datastore:",noindex"`
}

type FilaCache struct {
	key  *datastore.Key
	data *Fila
}

func qryFila(contexto appengine.Context, nome string) (fila *FilaCache, err error) {

	var chave_cache = FilaEntity+nome
	fmt.Printf("\nqryFila %v", chave_cache)

	var cache FilaCache

	var _, cacheerr = memcache.Gob.Get(contexto, chave_cache, &cache)
	if cacheerr == nil {
		fmt.Printf("\nqryFila get cache %v", cache)
		return &cache, nil
	}	

	var query = datastore.
		NewQuery(FilaEntity+nome).
		Order("-TS").
		Limit(1)
		
	var cursor = query.Run(contexto)

	var data Fila
	cache.key, err = cursor.Next(&data)
	if err == datastore.Done {
		data = Fila{
			TS: time.Now(),
			tokens: []string{},
		}
		cache.key=datastore.NewKey(contexto, chave_cache, "", data.TS.Unix(), nil)
		_, err = datastore.Put(contexto, cache.key, &data)
		if err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	}

	cache.data = &data
	fila = &cache
	var item = &memcache.Item{
		Key:    chave_cache,
		Object: cache,
	}
  fmt.Printf("\nqryFila set cache %v + %v", item.Key, *item.Object)
	memcache.Gob.Set(contexto, item)
	return
}

func updFila(contexto appengine.Context, nome string, upd_fn func(fila *Fila) (updated bool, err error)) (updated bool, filaUpd *Fila, err error) {
	var chave_cache = FilaEntity+nome
	fmt.Printf("\nupdFila %v", chave_cache)
	updated=false
  var rm_keys []*datastore.Key
	var cache *FilaCache; 
	
	err=datastore.RunInTransaction(contexto, func (contexto appengine.Context) error {
		var query = datastore.
				NewQuery(FilaEntity+nome).
				Order("-TS").
				Limit(10)
				
			var cursor = query.Run(contexto)

			var data Fila
			cache.key, err = cursor.Next(&data)
			if err == datastore.Done {
				data = Fila{
					TS: time.Now(),
					tokens: []string{},
				}
				if err != nil {
					return err
				}
			} else if err != nil {
				return err
			}   
			updated, err = upd_fn(&data);
			if err != nil {
				return err
			}   
			if (updated) {
  		cache.data.TS = time.Now()
				cache.key=datastore.NewKey(contexto, chave_cache, "", data.TS.Unix(), nil)
  			fmt.Printf("\ngravando %v", data)
			  _, err = datastore.Put(contexto, cache.key, &data)
			}
		var item = &memcache.Item{
			Key:    chave_cache,
			Object: *cache,
		}
		fmt.Printf("\nupdFila set cache %v + %v", item.Key, *item.Object)
		memcache.Gob.Set(contexto, item)


var rm_key *datastore.Key
	 rm_key, err = cursor.Next(&data)
	 for err != datastore.Done {
		 rm_keys=append(rm_keys, rm_key)
	   rm_key, err = cursor.Next(&data)
	 }
		return err
	}, nil)	

	if len(rm_keys)>0 {
			  _ = datastore.DeleteMulti(contexto, rm_keys)
	}
	
	return updated, cache.data, err;
}

func soaDisponibilizar(contexto appengine.Context, token string, canal string) (updated bool, fila *Fila, err error) {	
	return updFila(contexto, canal, func(fila *Fila) (updated bool, err error) {		
		fmt.Printf("\nantes %v", fila)
	  updated = put_token(fila, token)
		fmt.Printf("\ndepois %v", fila)
		return updated, nil
	})	
}

func put_token(fila *Fila, token string) bool{
	for i := 0; i < len(fila.tokens); i++ {		
		if fila.tokens[i] == token {
			return false
		}
	}

	fila.tokens = append(fila.tokens, token)
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
