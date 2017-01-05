package hoda5Server

import (
	"io"
	"fmt"
	"net/http"
	"appengine"
)

// http://localhost:8080/api/voluntario/conectar?i=tk_ana&t=1&a=1&v=0
func handleVoluntarioConectar(w http.ResponseWriter, r *http.Request) {
	var ctx = appengine.NewContext(r)
	var q = r.URL.Query()

	var token = q["i"][0]
	var texto = q["t"][0] == "1"
	var audio = q["a"][0] == "1"
	var video = q["v"][0] == "1"

	 info, err := soaVoluntarioConectar(ctx, token, texto, audio, video)
	if err != nil {
		w.WriteHeader(501)
		w.Header().Set("Content-Type", "text/plain")
		io.WriteString(w, "Internal Server Error\n")
		io.WriteString(w, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	fmt.Fprintf(w, "{")
	fmt.Fprintf(w, "\"nome\": \"%v\"", info)
	fmt.Fprintf(w, "}")
}

// // // http://localhost:8080/api/multlab/ResultadoOpRegistrar?t=t0k3n_t3st3&p=1601.000.000-9&s=123456&m=m3d&d=26-jan-2016&l=100&e=60&u=n
// // // https://hoda5.com/api/multlab/ResultadoOpRegistrar?t=t0k3n_t3st3&p=1601.000.000-9&s=123456&m=m3d&d=26-jan-2016&l=100&e=60&u=n

// // func obrigatorio(r *http.Request, fields []string) error {
// // 	for _, field := range fields {
// // 		var value = r.FormValue(field)
// // 		if value == "" {
// // 			return errors.New("O campo '" + field + "' nao pode ser deixado em branco")
// // 		}
// // 	}
// // 	return nil
// // }

// // func handleResultadoOpRegistrar(w http.ResponseWriter, r *http.Request) {
// // 	var ctx, errinsecure = h5lib.Hoda5Context(r)
// // 	if errinsecure != nil {
// // 		h5lib.ServeError(ctx, w, r, errinsecure, http.StatusForbidden)
// // 		return
// // 	}

// // 	var errform = r.ParseMultipartForm(30000)
// // 	if errform != nil {
// // 		h5lib.ServeError(ctx, w, r, errform, http.StatusBadRequest)
// // 		return
// // 	}

// // 	ctx.Debugf("handleResultadoOpRegistrar: %v", r)

// // 	var errobrigatorio = obrigatorio(r, []string{
// // 		"na", "np", "t", "p", "s", "l", "a", "e", "u", "mc", "mn", "pc", "pn", "cv", "ep",
// // 	})
// // 	if errobrigatorio != nil {
// // 		h5lib.ServeError(ctx, w, r, errobrigatorio, http.StatusBadRequest)
// // 		return
// // 	}

// // 	var nomeArquivo = r.FormValue("na")
// // 	var nomePaciente = r.FormValue("np")

// // 	var token = r.FormValue("t")

// // 	var cpf = r.FormValue("c")
// // 	var protocolo = r.FormValue("p")
// // 	var senha = r.FormValue("s")
// // 	var tamanho, errtam = strconv.Atoi(r.FormValue("l"))
// // 	if errtam != nil {
// // 		h5lib.ServeError(ctx, w, r, errtam, http.StatusBadRequest)
// // 		return
// // 	}
// // 	var examesPendentes, errep = strconv.Atoi(r.FormValue("ep"))
// // 	if errep != nil {
// // 		h5lib.ServeError(ctx, w, r, errep, http.StatusBadRequest)
// // 		return
// // 	}
// // 	var codvals = strings.Split(r.FormValue("cv"), ",")
// // 	if len(codvals) == 0 {
// // 		h5lib.ServeError(ctx, w, r, errors.New("cv"), http.StatusBadRequest)
// // 		return
// // 	}
// // 	var secstoexpires, errexp = strconv.Atoi(r.FormValue("e"))
// // 	if errexp != nil {
// // 		secstoexpires = 60
// // 	}
// // 	var usehttps = r.FormValue("u") == "y"
// // 	var arquivar = r.FormValue("a") == "y"

// // 	var lab, errlab = qryLaboratorioPorToken(ctx, token)
// // 	if errlab != nil {
// // 		h5lib.ServeError(ctx, w, r, errlab, http.StatusNotAcceptable)
// // 		return
// // 	}

// // 	var medico, errmed = MedicoOpRegistrar(ctx, lab, r.FormValue("mc"), r.FormValue("mn"), r.FormValue("mr"), r.FormValue("ms"))
// // 	if errmed != nil {
// // 		h5lib.ServeError(ctx, w, r, errmed, http.StatusNotAcceptable)
// // 		return
// // 	}

// // 	var convenio, errconv = ConvenioOpRegistrar(ctx, lab, r.FormValue("pc"), r.FormValue("pn"), r.FormValue("pr"), r.FormValue("ps"))
// // 	if errconv != nil {
// // 		h5lib.ServeError(ctx, w, r, errconv, http.StatusNotAcceptable)
// // 		return
// // 	}

// // 	var clinica, errclin = ClinicaOpRegistrar(ctx, lab, r.FormValue("cc"), r.FormValue("cn"), r.FormValue("cr"), r.FormValue("cs"))
// // 	if errclin != nil {
// // 		h5lib.ServeError(ctx, w, r, errclin, http.StatusNotAcceptable)
// // 		return
// // 	}

// // 	var resultado, errreg = ResultadoOpRegistrar(ctx, nomeArquivo, lab, cpf, nomePaciente, protocolo, senha, codvals, examesPendentes, medico, convenio, clinica, arquivar, int32(tamanho))

// // 	if errreg != nil {
// // 		h5lib.ServeError(ctx, w, r, errreg, http.StatusNotAcceptable)
// // 		return
// // 	}

// // 	var signeduploadpdfurl, errsign = ResultadoOpGerarURL(resultado, "PUT", secstoexpires, usehttps)
// // 	if errsign != nil {
// // 		h5lib.ServeError(ctx, w, r, errsign, http.StatusNotAcceptable)
// // 		return
// // 	}
// // 	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
// // 	w.Write([]byte(signeduploadpdfurl))
// // }

// // // http://localhost:8080/api/multlab/ResultadosPorProtocolo?t=t0k3n_t3st3&p=1601.000.000-9&s=123456
// // func handleResultadosPorProtocolo(w http.ResponseWriter, req *http.Request) {
// // 	var ctx, errinsecure = h5lib.Hoda5Context(req)
// // 	if errinsecure != nil {
// // 		h5lib.ServeError(ctx, w, req, errinsecure, http.StatusForbidden)
// // 		return
// // 	}
// // 	var q = req.URL.Query()

// // 	var token = q["t"][0]
// // 	var protocolo = q["p"][0]
// // 	var senha = q["s"][0]
// // 	var secstoexpires = 60 * 10
// // 	var usehttps = false
// // 	var textplain = false
// // 	if q["tp"] != nil {
// // 		textplain = q["tp"][0] == "y"
// // 	}

// // 	var lab, errlab = qryLaboratorioPorToken(ctx, token)
// // 	if errlab != nil {
// // 		h5lib.ServeError(ctx, w, req, errlab, http.StatusNotFound)
// // 		return
// // 	}

// // 	printProtocolo(ctx, w, req, lab, protocolo, &senha, secstoexpires, usehttps, textplain)
// // }

// // func printProtocolo(ctx appengine.Context, w http.ResponseWriter, req *http.Request, lab *LaboratorioCache, protocolo string, senha *string, secstoexpires int, usehttps bool, textplain bool) {
// // 	var resultados, errqry = qryResultadosPorProtocolo(ctx, lab, protocolo, senha)
// // 	if errqry != nil {
// // 		h5lib.ServeError(ctx, w, req, errqry, http.StatusNotFound)
// // 		return
// // 	}
// // 	printResultados(ctx, w, req, lab, resultados, secstoexpires, usehttps, textplain)
// // }

// // func printResultados(ctx appengine.Context, w http.ResponseWriter, req *http.Request, lab *LaboratorioCache, resultados []ResultadoCache, secstoexpires int, usehttps bool, textplain bool) {

// // 	if textplain {
// // 		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
// // 	} else {
// // 		w.Header().Set("Content-Type", "application/json; charset=utf-8")
// // 	}

// // 	var primeiro = true

// // 	fmt.Fprintf(w, "[")
// // 	for _, res := range resultados {

// // 		if primeiro {
// // 			primeiro = false
// // 		} else {
// // 			fmt.Fprintf(w, ",")
// // 		}
// // 		printResultado(ctx, w, req, lab, &res, secstoexpires, usehttps)
// // 	}
// // 	fmt.Fprintf(w, "]")
// // }

// // func printResultado(ctx appengine.Context, w http.ResponseWriter, req *http.Request, lab *LaboratorioCache, r *ResultadoCache, secstoexpires int, usehttps bool) {
// // 	var url string
// // 	var errsign error
// // 	if secstoexpires != -1 {
// // 		url, errsign = ResultadoOpGerarURL(r, "GET", secstoexpires, usehttps)
// // 		if errsign != nil {
// // 			h5lib.ServeError(ctx, w, req, errsign, http.StatusNotAcceptable)
// // 			return
// // 		}
// // 	}
// // 	var med, errmed = qryMedicoPorCodigo(ctx, lab.data, r.data.Medico())
// // 	if errmed != nil {
// // 		h5lib.ServeError(ctx, w, req, errmed, http.StatusNotAcceptable)
// // 		return
// // 	}
// // 	fmt.Fprintf(w, "{")
// // 	fmt.Fprintf(w, "\"protocolo\": \"%v\",", r.data.Protocolo())
// // 	fmt.Fprintf(w, "\"senha\": \"%v\",", r.data.Senha)
// // 	fmt.Fprintf(w, "\"nomeArquivo\": \"%v\",", r.key.StringID())
// // 	fmt.Fprintf(w, "\"paciente\": \"%v\",", r.data.NomePaciente)
// // 	fmt.Fprintf(w, "\"data\": \"%v\",", r.data.Data.Format(time.RFC3339))
// // 	fmt.Fprintf(w, "\"examesPendentes\": \"%v\",", r.data.ExamesPendentes)
// // 	fmt.Fprintf(w, "\"medicoNome\": \"%v\",", med.data.Nome)
// // 	fmt.Fprintf(w, "\"codvals\": \"%v\",", strings.Join(r.data.CodVals, ","))
// // 	if secstoexpires != -1 {
// // 		fmt.Fprintf(w, "\"link\": \"%v\"", url)
// // 	}
// // 	fmt.Fprintf(w, "}")
// // }

// // // // http://localhost:8080/api/multlab/handleResultadosPorCodVal?c=3451245124
// // func handleResultadosPorCodVal(w http.ResponseWriter, req *http.Request) {
// // 	var ctx, errinsecure = h5lib.Hoda5Context(req)
// // 	if errinsecure != nil {
// // 		h5lib.ServeError(ctx, w, req, errinsecure, http.StatusForbidden)
// // 		return
// // 	}
// // 	var q = req.URL.Query()

// // 	var codval = q["cv"][0]

// // 	var codlab, protocolo, errqry = qryResultadosPorCodVal(ctx, codval)
// // 	if errqry != nil {
// // 		h5lib.ServeError(ctx, w, req, errqry, http.StatusNotFound)
// // 		return
// // 	}

// // 	var lab, errlab = qryLaboratorioPorCodigo(ctx, codlab)
// // 	if errlab != nil {
// // 		h5lib.ServeError(ctx, w, req, errlab, http.StatusNotFound)
// // 		return
// // 	}

// // 	var secstoexpires = 60 * 10
// // 	var usehttps = false
// // 	var textplain = false
// // 	if q["tp"] != nil {
// // 		textplain = q["tp"][0] == "y"
// // 	}

// // 	printProtocolo(ctx, w, req, lab, protocolo, nil, secstoexpires, usehttps, textplain)
// // }

// // // // http://localhost:8080/api/multlab/ResultadosPorMedicoNome?t=t0k3n_t3st3&p=1601.000.000-9&s=123456
// // // func handleResultadosPorMedicoNome(w http.ResponseWriter, req *http.Request) {
// // // 	var ctx, errinsecure = h5lib.Hoda5Context(req)
// // // 	if errinsecure != nil {
// // // 		h5lib.ServeError(ctx, w, req, errinsecure, http.StatusForbidden)
// // // 		return
// // // 	}
// // // 	var q = req.URL.Query()

// // // 	var token = q["t"][0]
// // // 	var nome = q["n"][0]
// // // 	var secstoexpires = -1
// // // 	var usehttps = false
// // // 	var textplain = false

// // // 	var lab, errlab = qryLaboratorioPorToken(ctx, token)
// // // 	if errlab != nil {
// // // 		h5lib.ServeError(ctx, w, req, errlab, http.StatusNotFound)
// // // 		return
// // // 	}

// // // 	var resultados, errqry = qryResultadosPorMedicoNome(ctx, lab, protocolo, senha)
// // // 	if errqry != nil {
// // // 		h5lib.ServeError(ctx, w, req, errqry, http.StatusNotFound)
// // // 		return
// // // 	}
// // // 	printResultados(ctx, w, req, lab, resultados, secstoexpires, usehttps, textplain)
// // // }

// // // http://localhost:8080/api/multlab/ResultadoGerarUrl?t=t0k3n-t3st3&p=1601.000.000-9&s=123456&d=26-jan-2016&e=60&u=n&o=g
// // func handleResultadoGerarURL(w http.ResponseWriter, r *http.Request) {

// // 	var ctx, errinsecure = h5lib.Hoda5Context(r)
// // 	if errinsecure != nil {
// // 		h5lib.ServeError(ctx, w, r, errinsecure, http.StatusForbidden)
// // 		return
// // 	}
// // 	var q = r.URL.Query()

// // 	var token = q["t"][0]
// // 	var nomeArquivo string
// // 	if q["na"] != nil {
// // 		nomeArquivo = q["na"][0]
// // 	}
// // 	var operacao = q["o"][0]

// // 	var secstoexpires, errexp = strconv.Atoi(q["e"][0])
// // 	if errexp != nil {
// // 		secstoexpires = 60
// // 	}
// // 	var usehttps = q["u"][0] == "y"

// // 	switch operacao {
// // 	case "g":
// // 		operacao = "GET"
// // 		break
// // 	case "p":
// // 		operacao = "PUT"
// // 		break
// // 	case "d":
// // 		operacao = "DELETE"
// // 		break
// // 	default:
// // 		h5lib.ServeError(ctx, w, r, errors.New("operacao invalida"), http.StatusBadRequest)
// // 		return
// // 	}

// // 	var responder = func(resultados []ResultadoCache) {
// // 		var links = bytes.NewBuffer(nil)
// // 		for _, res := range resultados {
// // 			var url, errsign = ResultadoOpGerarURL(&res, operacao, secstoexpires, usehttps)
// // 			if errsign != nil {
// // 				h5lib.ServeError(ctx, w, r, errsign, http.StatusNotAcceptable)
// // 				return
// // 			}
// // 			links.WriteString(url)
// // 			links.WriteString("\r\n")
// // 		}
// // 		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
// // 		links.WriteTo(w)
// // 	}

// // 	if nomeArquivo != "" {
// // 		var resultado, errqry = qryResultadoPorNomeArquivo(ctx, nomeArquivo)

// // 		if errqry != nil {
// // 			h5lib.ServeError(ctx, w, r, errqry, http.StatusNotFound)
// // 			return
// // 		}

// // 		responder([]ResultadoCache{*resultado})
// // 		return
// // 	}
// // 	var codVal = q["cv"][0]
// // 	var protocolo string
// // 	var senha *string

// // 	if codVal != "" {
// // 		var errqry1 error
// // 		_, protocolo, errqry1 = qryResultadosPorCodVal(ctx, codVal)

// // 		if errqry1 != nil {
// // 			h5lib.ServeError(ctx, w, r, errqry1, http.StatusNotFound)
// // 			return
// // 		}

// // 	} else {
// // 		protocolo = q["p"][0]
// // 		senha = &q["s"][0]
// // 	}

// // 	var lab, errlab = qryLaboratorioPorToken(ctx, token)
// // 	if errlab != nil {
// // 		h5lib.ServeError(ctx, w, r, errlab, http.StatusNotFound)
// // 		return
// // 	}

// // 	var resultados, errqry = qryResultadosPorProtocolo(ctx, lab, protocolo, senha)

// // 	if errqry != nil || len(resultados) != 1 {
// // 		h5lib.ServeError(ctx, w, r, errqry, http.StatusNotFound)
// // 		return
// // 	}
// // }

// // // http://localhost:8080/api/multlab/ExcluirResultadosPorProtocolo?t=t0k3n_t3st3&p=1601.000.000-9&s=123456
// // func handleResultadosExcluirArquivo(w http.ResponseWriter, req *http.Request) {
// // 	var ctx, errinsecure = h5lib.Hoda5Context(req)
// // 	if errinsecure != nil {
// // 		h5lib.ServeError(ctx, w, req, errinsecure, http.StatusForbidden)
// // 		return
// // 	}
// // 	var q = req.URL.Query()

// // 	var token = q["t"][0]
// // 	var nomeArquivo = q["na"][0]
// // 	var secstoexpires = 60 * 10
// // 	var usehttps = false

// // 	var lab, errlab = qryLaboratorioPorToken(ctx, token)
// // 	if errlab != nil {
// // 		h5lib.ServeError(ctx, w, req, errlab, http.StatusNotFound)
// // 		return
// // 	}

// // 	var deleteurl, errres = ResultadoOpExcluirDadosDoArquivo(ctx, nomeArquivo, lab, secstoexpires, usehttps)
// // 	if errres != nil {
// //     w.Header().Set("Content-Type", "text/plain; charset=utf-8")
// // 	  w.Write([]byte("NOT FOUND"))
// // 		// h5lib.ServeError(ctx, w, req, errres, http.StatusNotAcceptable)
// // 		return
// // 	}

// // 	var deleteerr = ResultadoOpExcluirConteudoDoArquivo(ctx, deleteurl)
// // 	if deleteerr != nil {
// // 		h5lib.ServeError(ctx, w, req, deleteerr, http.StatusInternalServerError)
// // 		return
// // 	}

// // 	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
// // 	w.Write([]byte("OK"))
// // }
