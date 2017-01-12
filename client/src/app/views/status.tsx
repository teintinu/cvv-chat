import { state } from '../State';
import * as React from 'react';

export function Status() {
 return <div style={{border: "dotted black 1px", marginTop: "1em"}}>
    <table width="100%" id="tableStatus">
    <tbody> 
      <tr>
        <th></th>
        <th>Voz</th>
        <th>Chat</th>
        <th>Video</th>
      </tr>
      <tr>
        <th colSpan={4}>Demanda neste momento</th>
      </tr>
      <tr>
        <td>Em atendimento</td>
        <td>{state.server_state.status.onAudio-state.server_state.status.idleAudio}</td>
        <td>{state.server_state.status.onTexto-state.server_state.status.idleTexto}</td>
        <td>{state.server_state.status.onVideo-state.server_state.status.idleVideo}</td>
      </tr>
      <tr>
        <td>Tamanho da fila</td>
        <td>{state.server_state.status.filaAudio}</td>
        <td>{state.server_state.status.filaTexto}</td>
        <td>{state.server_state.status.filaVideo}</td>
      </tr>
      <tr>
        <th colSpan={4}>Disponibilidade neste momento</th>
      </tr>
      <tr>
        <td>Voluntários logados</td>
        <td>{state.server_state.status.onAudio}</td>
        <td>{state.server_state.status.onTexto}</td>
        <td>{state.server_state.status.onVideo}</td>
      </tr>
      <tr>
        <td>Voluntários disponíveis</td>
        <td>{state.server_state.status.idleAudio}</td>
        <td>{state.server_state.status.idleTexto}</td>
        <td>{state.server_state.status.idleVideo}</td>
      </tr>
    </tbody>
  </table>
  </div>
}