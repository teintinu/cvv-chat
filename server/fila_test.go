package hoda5Server

import (
	// "bytes"
	// "errors"
	"fmt"
	// "net/http"
	// "strconv"
	// "strings"

	"testing"
	"time"

	"appengine"
	"appengine/aetest"
	// "appengine/datastore"
)

func TestChatTexto(t *testing.T) {
	var inst, errinst = aetest.NewInstance(nil)
	if errinst != nil {
		t.Fatalf("Failed to create instance: %v", errinst)
		return
	}
	defer inst.Close()

  var contexto appengine.Context;
	var err error;
	contexto, err = aetest.NewContext(nil)
	if err != nil {
		t.Fatal(err)
		return
	}

  assertQryFila(t, contexto, "texto", []string{})
  assertQryFila(t, contexto, "audio", []string{})
  assertQryFila(t, contexto, "video", []string{})

	var fila1 *Fila
	_, fila1, err = soaDisponibilizar(contexto, "tk-ana", "audio")
	if err != nil {
		t.Fatal(err)
		return
	}
	time.Sleep(300000000)
  assertQryFila(t, contexto, "texto", []string{})
  assertQryFila(t, contexto, "audio", []string{"tk-ana"})
  assertQryFila(t, contexto, "audio", fila1.Tokens)
  assertQryFila(t, contexto, "video", []string{})
	
}	

func assertQryFila(t *testing.T, contexto appengine.Context, nome string, esperado []string) {
	var cache, err = qryFila(contexto, nome)
	if err != nil {
		t.Fatal(err)
		return
	}
	assertFila(t, contexto, cache.data, esperado);
}

func assertFila(t *testing.T, contexto appengine.Context, data *Fila, esperado []string) {
	var erro="";
	for i := 0; i < len(data.Tokens); i++ {		
		var atual=data.Tokens[i]
		if (i>=len(esperado)) {
			erro=fmt.Sprintf("\n  tokens[%v] inesperado",i)
			break;
		} 
			if (atual != esperado[i]) {
				erro=fmt.Sprintf("\n  tokens[%v]=%v esperado=%v",atual, esperado[i])
			}
	}

	if len(data.Tokens) < len(esperado) {
		erro=fmt.Sprintf("\n  Era esperado mais itens")
	}
	if (erro!="") {
		t.Fatalf("\nassertFila:%v \n  esperado=%v \n  atual=%v", erro, esperado, data.Tokens)
	}
}

// 	if len(fila1.Voluntarios) != 1 {
// 		t.Fatalf("somente voluntaria ana deveria estar logada Voluntarios=%v", fila1.Voluntarios)
// 		return
// 	}
// 	if (fila1.Voluntarios[0].Token != "tk-ana") || fila1.Voluntarios[0].Pausado || fila1.Voluntarios[0].Texto || (!fila1.Voluntarios[0].Audio) || fila1.Voluntarios[0].Video {
// 		t.Fatalf("erro na voluntaria logada %v ", fila1.Voluntarios[0])
// 		return
// 	}
// 	if len(fila1.OP) != 0 {
// 		t.Fatalf("fila1 de atendimento deveria estar vazia")
// 		return
// 	}

//   var fila2	 *Fila
// 	updated, fila2, err = soaDisponibilizar(contexto, "tk-ana", "texto")
// 	if err != nil {
// 		t.Fatal(err)
// 		return
// 	}

// 	if len(fila2.Voluntarios) != 1 {
// 		t.Fatalf("somente voluntaria ana deveria estar logada Voluntarios=%v", fila2.Voluntarios)
// 		return
// 	}
// 	if (fila2.Voluntarios[0].Token != "tk-ana") || fila2.Voluntarios[0].Pausado || (!fila2.Voluntarios[0].Texto) || (!fila2.Voluntarios[0].Audio) || fila2.Voluntarios[0].Video {
// 		t.Fatalf("erro na voluntaria logada %v ", fila2.Voluntarios[0])
// 		return
// 	}
// 	if len(fila2.OP) != 0 {
// 		t.Fatalf("fila2 de atendimento deveria estar vazia")
// 		return
// 	}

// 	time.Sleep(300000000)
// 	fmt.Printf("\n%v", updated)
// 	fmt.Printf("\n%v", fila2)
// }

// 	var lab1, errlab1 = qryLaboratorioPorCodigo(contexto, codigolab)
// 	if errlab1 != nil {
// 		t.Fatal(errlab1)
// 		return
// 	}
// 	if lab1.data.CodLab != codigolab {
// 		t.Fatalf("CodLab está %v e deveria ser %v", lab1.data.CodLab, codigolab)
// 		return
// 	}
// 	if lab1.data.Chaves[0] != tokenlab {
// 		t.Fatalf("Chave está %v e deveria ser %v", lab1.data.Chaves, tokenlab)
// 		return
// 	}

// 	time.Sleep(300000000)
// 	var lab, errlab = qryLaboratorioPorToken(contexto, tokenlab)
// 	if errlab != nil {
// 		t.Fatal(errlab)
// 		return
// 	}
// 	if lab.data.CodLab != codigolab {
// 		t.Fatalf("CodLab está %v e deveria ser %v", lab.data.CodLab, codigolab)
// 		return
// 	}
// 	if lab.data.Chaves[0] != tokenlab {
// 		t.Fatalf("Chave está %v e deveria ser %v", lab.data.Chaves, tokenlab)
// 		return
// 	}

// 	var cpf = "123456789"
// 	var nomePaciente = "Maria da Silva"
// 	var protocolo = "1601.000.000-9"
// 	var senha = "123456"
// 	var nomeArquivo = "1601.000.000-9-001"
// 	var codvals = []string{"B0D330000063B49F0396012002F", "B0D330000063B49F03960320031"}
// 	var pdfcontentstr = "pdf:" + time.Now().String()
// 	log.Println(pdfcontentstr)
// 	var pdfcontent = []byte(pdfcontentstr)
// 	var arquivar = false
// 	var examesPendentes = 3

// 	var medico, errmed = MedicoOpRegistrar(contexto, lab, "med01", "Dra. Ana", "ana", "123")
// 	if errmed != nil {
// 		t.Fatal("erro ao registrar médico %v", errmed)
// 		return
// 	}

// 	var convenio, errconv = ConvenioOpRegistrar(contexto, lab, "conv01", "particular", "part", "456")
// 	if errconv != nil {
// 		t.Fatal("erro ao registrar convênio %v", errconv)
// 		return
// 	}

// 	var clinica, errclin = ClinicaOpRegistrar(contexto, lab, "clin01", "Clinica X", "", "")
// 	if errclin != nil {
// 		t.Fatal("erro ao registrar clínica %v", errclin)
// 		return
// 	}

// 	_, erropreg := ResultadoOpRegistrar(contexto, nomeArquivo, lab, cpf, nomePaciente, protocolo, senha, codvals, examesPendentes, medico, convenio, clinica, arquivar, int32(len(pdfcontent)))
// 	if erropreg != nil {
// 		t.Fatalf("erro ao registrar resultado %v", erropreg)
// 		return
// 	}
// 	time.Sleep(300000000)

// 	var res1, errres1 = qryResultadoPorNomeArquivo(contexto, nomeArquivo)
// 	if errres1 != nil {
// 		t.Fatal(errres1)
// 		return
// 	}
// 	if res1.data.Protocolo() != protocolo {
// 		t.Fatal("protocolo1 invalido deveria ser %v mas está %v", protocolo, res1.data.Protocolo)
// 		return
// 	}
// 	if res1.data.Senha != senha {
// 		t.Fatal("Senha1 invalida deveria ser %v mas está %v", protocolo, res1.data.Senha)
// 		return
// 	}

// 	var signeduploadpdfurl, errsign1 = ResultadoOpGerarURL(res1, "PUT", 5, false)
// 	if errsign1 != nil {
// 		t.Fatal("erro ao gerar url de envio %v", errsign1)
// 		return
// 	}

// 	var respupload, errupload = fazUploadPdf(t, inst, signeduploadpdfurl, pdfcontent, false)
// 	if errupload != nil {
// 		t.Fatal("erro no upload %v %v", errupload, respupload)
// 		return
// 	}
// 	log.Printf("resupload = %v", respupload)

// 	var res2, errres2 = qryResultadosPorProtocolo(contexto, lab, protocolo, &senha)
// 	if errres2 != nil {
// 		t.Fatal(errres2)
// 		return
// 	}
// 	if len(res2) != 1 {
// 		t.Fatal("res2 invalido %v", res2)
// 		return
// 	}
// 	if res2[0].data.Protocolo() != protocolo {
// 		t.Fatal("protocolo2 invalido deveria ser %v mas está %v", protocolo, res2[0].data.Protocolo)
// 		return
// 	}
// 	if res2[0].data.Senha != senha {
// 		t.Fatal("Senha2 invalida deveria ser %v mas está %v", protocolo, res2[0].data.Senha)
// 		return
// 	}
// 	if res2[0].data.IdxPorMedico != medico.key.StringID() {
// 		t.Fatal("IdxPorMedico invalida deveria ser %v mas está %v", medico.key.StringID(), res2[0].data.IdxPorMedico)
// 		return
// 	}

// 	var resmednome1, errmednome1 = qryResultadosPorMedicoNome(contexto, lab, medico, nomePaciente)
// 	if errmednome1 != nil {
// 		t.Fatal(errmednome1)
// 		return
// 	}
// 	if len(resmednome1) != 1 {
// 		t.Fatal("resmednome1 invalido %v", resmednome1)
// 		return
// 	}
// 	if resmednome1[0].data.Protocolo() != protocolo {
// 		t.Fatal("protocolo2 invalido deveria ser %v mas está %v", protocolo, resmednome1[0].data.Protocolo)
// 		return
// 	}
// 	if resmednome1[0].data.Senha != senha {
// 		t.Fatal("Senha2 invalida deveria ser %v mas está %v", protocolo, resmednome1[0].data.Senha)
// 		return
// 	}

// 	var resmeddata1, errmeddata1 = qryResultadosPorMedicoData(contexto, lab, medico, time.Now().Add(-time.Minute), time.Now())
// 	if errmeddata1 != nil {
// 		t.Fatal(errmeddata1)
// 		return
// 	}
// 	if len(resmeddata1) != 1 {
// 		t.Fatal("resmeddata1 invalido %v", resmeddata1)
// 		return
// 	}
// 	if resmeddata1[0].data.Protocolo() != protocolo {
// 		t.Fatal("protocolo2 invalido deveria ser %v mas está %v", protocolo, resmeddata1[0].data.Protocolo)
// 		return
// 	}
// 	if resmeddata1[0].data.Senha != senha {
// 		t.Fatal("Senha2 invalida deveria ser %v mas está %v", protocolo, resmeddata1[0].data.Senha)
// 		return
// 	}

// 	var signeddownloadpdfurl, errsign2 = ResultadoOpGerarURL(&res2[0], "GET", 5, false)
// 	if errsign2 != nil {
// 		t.Fatal("erro ao gerar url de envio %v", errsign2)
// 		return
// 	}

// 	var respdownload, errdownload = fazDownloadPdf(t, inst, signeddownloadpdfurl, false)
// 	if errdownload != nil {
// 		t.Fatal("erro no download %v %v", errdownload, respdownload)
// 		return
// 	}
// 	if respdownload != pdfcontentstr {
// 		t.Fatal("erro no download esperado: '%v' != retornado: '%v'", pdfcontent, respdownload)
// 		return
// 	}

// 	var lab3, prot3, errres3 = qryResultadosPorCodVal(contexto, codvals[0])
// 	if errres3 != nil {
// 		t.Fatal(errres3)
// 		return
// 	}
// 	if prot3 != protocolo {
// 		t.Fatal("protocolo2 invalido deveria ser %v mas está %v", protocolo, prot3)
// 		return
// 	}
// 	if lab3 != codigolab {
// 		t.Fatal("codigolab3 invalida deveria ser %v mas está %v", protocolo, lab3)
// 		return
// 	}

// 	//testHttp(t, inst, contexto, )

// 	var deleteURL, errExcluir = ResultadoOpExcluirDadosDoArquivo(contexto, nomeArquivo, lab, 600, false)
// 	if errExcluir != nil {
// 		t.Fatal(errExcluir)
// 		return
// 	}
// 	var deleteErr = ResultadoOpExcluirConteudoDoArquivo(contexto, deleteURL)
// 	if deleteErr != nil {
// 		t.Fatal(deleteErr)
// 		return
// 	}

// 	var _, errAposExcluir = qryResultadoPorNomeArquivo(contexto, nomeArquivo)
// 	if errAposExcluir == nil {
// 		t.Fatal("errAposExcluir")
// 		return
// 	}
// 	if errAposExcluir != datastore.ErrNoSuchEntity {
// 		t.Fatal(errAposExcluir)
// 		return
// 	}
// }

// func TestMod26(t *testing.T) {
// 	if h5lib.Mod256("0106024B39001003F360390BD", false) != "30" {
// 		t.Fatal("h5lib.Mod256 de 0106024B39001003F360390BD deveria ser 30")
// 		return
// 	}
// 	if h5lib.Mod256("0106024B39005003F3603D6C8", false) != "3a" {
// 		t.Fatal("h5lib.Mod256 de 0106024B39005003F3603D6C8 deveria ser 3a")
// 		return
// 	}
// 	if h5lib.Mod256("0106024B39007003F360390BD", false) != "36" {
// 		t.Fatal("h5lib.Mod256 de 0106024B39007003F360390BD deveria ser 36")
// 		return
// 	}
// 	if h5lib.Mod256("0106024B3900405293602F34E", false) != "2c" {
// 		t.Fatal("h5lib.Mod256 de 0106024B3900405293602F34E deveria ser 2c")
// 		return
// 	}
// }

// func TestCodigoValidacao(t *testing.T) {
// 	caso := func(normal string, embaralhado string) {
// 		if Embaralhar(normal) != embaralhado {
// 			t.Fatalf("Erro de embaralhamento em %v, esperado = %v mas está %v", normal, embaralhado, Embaralhar(normal))
// 			return
// 		}
// 		if Desembaralhar(embaralhado) != normal {
// 			t.Fatalf("Erro de desembaralhamento em %v, esperado = %v mas está %v", embaralhado, normal, Desembaralhar(embaralhado))
// 			return
// 		}
// 		if len(normal) != 27 {
// 			t.Fatalf("codval invalido ", normal)
// 		}
// 		if strings.ToUpper(h5lib.Mod256(normal[:25], false)) != normal[25:] {
// 			t.Fatalf("codval invalido ", normal, normal[:25], normal[25:], h5lib.Mod256(normal[:25], false))
// 		}
// 	}
// 	caso("0006024B39001003F360390BD2F", "B0D330000063B49F0396012002F")
// 	caso("0006024B39002003F360390BD30", "B0D330000063B49F03960220030")
// 	caso("0006024B39003003F360390BD31", "B0D330000063B49F03960320031")
// 	caso("0106024B39001003F360390BD30", "B0D330000063B49F13960120030")
// 	caso("0106024B39005003F3603D6C83A", "B08330600063C49F13D6052003A")
// 	caso("0106024B39007003F360390BD36", "B0D330000063B49F13960720036")
// 	caso("0106024B3900405293602F34E2C", "B0E230300063449912F6042502C")

// }

// // func TestUploadResultado(t *testing.T) {

// // 	inst, errinst := aetest.NewInstance(nil)
// // 	if errinst != nil {
// // 		t.Fatalf("Failed to create instance: %v", errinst)
// //     return
// // 	}
// // 	defer inst.Close()

// // 	var contexto = CriaCenario1(t)

// //   var lab, errlab  = qryLaboratorioPorToken("t3st3t0k3n")
// //   if (errlab != nil ) {
// // 		t.Fatalf("erro ao acessar laboratorio de teste: %v", errinst)
// //     return;
// //   }
// // 	var protocolo = "00010000009"
// // 	var senha = "123456"
// // 	var medico = "m1"
// // 	var pdfcontent = []byte("pdf") //[]byte("conteúdo do pdf")

// // 	var url, err = ResultadoOpRegistrar(contexto, "00010000009_123456", lab, token, protocolo, senha, medico, descricao, tamanho)
// // 	log.Printf("%v %v", url, err)

// // 	// var upload_url, errurl_upload = pega_url_pra_fazer_upload(t, inst)
// // 	// if errurl_upload != nil {
// // 	// 	return
// // 	// }

// // 	// log.Printf("upload_url: %v", upload_url)

// // 	//var blob_ids, erruploading = fazUploadPdf(t, inst, "http://hoda/api/multlab/uploadurl?t=token", protocolo, senha, medico, pdf_reader)
// // 	var _, erruploading = fazUploadPdf(t, inst, url, pdfcontent)
// // 	if erruploading != nil {
// // 		return
// // 	}
// // 	// log.Printf("blob_ids: %v", blob_ids)
// // }

// func fazUploadPdf(t *testing.T, inst aetest.Instance, signeduploadpdfurl string, pdfcontent []byte, usehttps bool) (resp string, err error) {

// 	var reqhttp, errreq = inst.NewRequest("PUT", signeduploadpdfurl, bytes.NewReader(pdfcontent))

// 	if errreq != nil {
// 		t.Errorf("Erro de HTTP: %v %v", reqhttp, errreq)
// 		return "", errreq
// 	}

// 	log.Printf("l=%v pdf=%v", strconv.Itoa(len(pdfcontent)), pdfcontent)

// 	reqhttp.Header.Set("Content-type", "application/pdf")
// 	reqhttp.Header.Set("Content-Length", strconv.Itoa(len(pdfcontent)))

// 	var client *http.Client
// 	if usehttps {
// 		client = &http.Client{Transport: transport}
// 	} else {
// 		client = &http.Client{}
// 	}

// 	var reshttp, errres = client.Do(reqhttp)

// 	if errres != nil {
// 		t.Errorf("Erro de HTTP: %v", errres)
// 		return "", errreq
// 	}

// 	var bodyresp = &bytes.Buffer{}
// 	var _, errread = bodyresp.ReadFrom(reshttp.Body)
// 	if errread != nil {
// 		t.Errorf("Erro de HTTP: %v %v", errread, bodyresp.String())
// 		return "", errread
// 	}
// 	reshttp.Body.Close()

// 	if reshttp.StatusCode != 200 {
// 		t.Errorf("Erro de HTTP: response code %d bodyresp:\n%s", reshttp.StatusCode, bodyresp.String())
// 		return "", errors.New(bodyresp.String())
// 	}

// 	resp = bodyresp.String()
// 	return
// }

// func fazDownloadPdf(t *testing.T, inst aetest.Instance, signeddownloadpdfurl string, usehttps bool) (resp string, err error) {

// 	var reqhttp, errreq = inst.NewRequest("GET", signeddownloadpdfurl, nil)

// 	if errreq != nil {
// 		t.Errorf("Erro de HTTP: %v %v", reqhttp, errreq)
// 		return "", errreq
// 	}

// 	var client *http.Client
// 	if usehttps {
// 		client = &http.Client{Transport: transport}
// 	} else {
// 		client = &http.Client{}
// 	}

// 	var reshttp, errres = client.Do(reqhttp)

// 	if errres != nil {
// 		t.Errorf("Erro de HTTP: %v", errres)
// 		return "", errreq
// 	}

// 	var bodyresp = &bytes.Buffer{}
// 	var _, errread = bodyresp.ReadFrom(reshttp.Body)
// 	if errread != nil {
// 		t.Errorf("Erro de HTTP: %v %v", errread, bodyresp.String())
// 		return "", errread
// 	}
// 	reshttp.Body.Close()

// 	if reshttp.StatusCode != 200 {
// 		t.Errorf("Erro de HTTP: response code %d bodyresp:\n%s", reshttp.StatusCode, bodyresp.String())
// 		return "", errors.New(bodyresp.String())
// 	}

// 	resp = bodyresp.String()
// 	return
// }

// // // func pega_url_pra_fazer_upload(t *testing.T, inst aetest.Instance) (url_upload string, err error) {
// // // 	var req_http, errreq = inst.NewRequest("GET", "/api/multlab/uploadurl?t=token", nil)

// // // 	if errreq != nil {
// // // 		t.Errorf("Erro de HTTP: %v %v", req_http, errreq)
// // // 		return
// // // 	}

// // // 	var res_http = httptest.NewRecorder()
// // // 	http.DefaultServeMux.ServeHTTP(res_http, req_http)

// // // 	if res_http.Code != 200 {
// // // 		t.Errorf("Erro de HTTP: response code %d body:\n%s", res_http.Code, res_http.Body.String())
// // // 		return
// // // 	}

// // // 	url_upload = res_http.Body.String()

// // // 	return
// // // }

// // // func fazUploadPdf(t *testing.T, inst aetest.Instance, upload_url string, protocolo string, senha string, medico string, pdf_reader io.Reader) (blob_ids []string, err error) {
// // // 	log.Println("fazUploadPdf")
// // // 	var body = &bytes.Buffer{}
// // // 	writer := multipart.NewWriter(body)
// // // 	part_writer, errcff := writer.CreateFormFile("pdf", protocolo+"/"+senha+"/"+medico)
// // // 	if errcff != nil {
// // // 		t.Errorf("Erro de CreateFormFile: %v", err)
// // // 		return nil, errcff
// // // 	}

// // // 	if _, errcff = io.Copy(part_writer, pdf_reader); errcff != nil {
// // // 		t.Errorf("Erro de io.Copy(part_writer, pdf_reader): %v", errcff)
// // // 		return
// // // 	}

// // // 	// for key, val := range params {
// // // 	// 	_ = writer.WriteField(key, val)
// // // 	// }
// // // 	var errclose = writer.Close()
// // // 	if errclose != nil {
// // // 		t.Errorf("Erro de writer.Close: %v", errclose)
// // // 		return nil, errclose
// // // 	}

// // // 	log.Printf("req.body [%v]", body.String())

// // // 	var req_http, errreq = inst.NewRequest("POST", upload_url, body)

// // // 	if errreq != nil {
// // // 		t.Errorf("Erro de HTTP: %v %v", req_http, errreq)
// // // 		return nil, errreq
// // // 	}

// // // 	req_http.Header.Set("Content-type", writer.FormDataContentType())
// // // 	// req_http.Header.Add("Content-Length", strconv.Itoa(w.))

// // // 	var client = &http.Client{}

// // // 	var res_http, errres = client.Do(req_http) // http.Post(upload_url, "application/octet-stream", body)

// // // 	if errres != nil {
// // // 		t.Errorf("Erro de HTTP: %v", errres)
// // // 		return nil, errreq
// // // 	}

// // // 	body = &bytes.Buffer{}
// // // 	var _, errread = body.ReadFrom(res_http.Body)
// // // 	if errread != nil {
// // // 		t.Errorf("Erro de HTTP: %v", errread)
// // // 		return nil, errread
// // // 	}
// // // 	res_http.Body.Close()

// // // 	if res_http.StatusCode != 200 {
// // // 		t.Errorf("Erro de HTTP: response code %d body:\n%s", res_http.StatusCode, body.String())
// // // 		return nil, errors.New(body.String())
// // // 	}

// // // 	var resp = body.String()
// // // 	blob_ids = strings.Split(resp, "/")
// // // 	return
// // // }

// // func CriaCenario1(t *testing.T) (contexto aetest.Context) {
// // 	var err error
// // 	contexto, err = aetest.NewContext(nil)
// // 	if err != nil {
// // 		t.Fatal(err)
// // 	}

// // 	_, err = LaboratorioOpCadastrar(contexto, "teste", "t3st3t0k3n")
// // 	if err != nil {
// // 		t.Fatalf("Erro ao LaboratorioOpCadastrar: %v", err)
// // 		contexto = nil
// // 	}
// // 	return
// // }
