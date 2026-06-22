import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComentariosSoapService {
  
  private url = 'http://localhost:8098/ws'; // Reemplaza con tu endpoint

  constructor(private http: HttpClient) {}

  obtenerComentariosSoap(): Observable<any[]> {
    const xmlRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:com="http://example.com/veterinaria-vitalvet/comentarios">
         <soapenv:Header/>
         <soapenv:Body>
            <com:getComentarioRequest/>
         </soapenv:Body>
      </soapenv:Envelope>
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Accept': 'text/xml'
    });

    return this.http.post(this.url, xmlRequest, { headers, responseType: 'text' }).pipe(
      map(xmlString => this.parsearXmlComentarios(xmlString))
    );
  }

  // Helper para convertir el XML crudo en una lista de objetos legibles por TypeScript
  private parsearXmlComentarios(xmlString: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Buscamos todos los nodos <ns2:salida> o simplemente 'salida' (por si varía el namespace)
    const salidas = xmlDoc.getElementsByTagNameNS('*', 'salida');
    const listaComentarios: any[] = [];

    for (let i = 0; i < salidas.length; i++) {
      const nodo = salidas[i];
      listaComentarios.push({
        idComentario: nodo.getElementsByTagNameNS('*', 'id_coment')[0]?.textContent,
        nombreVeterinario: nodo.getElementsByTagNameNS('*', 'nombreVeterinario')[0]?.textContent,
        opinion: nodo.getElementsByTagNameNS('*', 'opinion')[0]?.textContent,
        estrellas: Number(nodo.getElementsByTagNameNS('*', 'estrellas')[0]?.textContent || 0)
      });
    }

    return listaComentarios;
  }
}