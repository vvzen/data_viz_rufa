## Incidenti_sett_ott_2016.csv
========
Il file contiene dati open tratti da [http://dati.comune.roma.it](http://dati.comune.roma.it).
<br>

Le colonne descritte sono:

	• Protocollo • Gruppo • DataOraIncidente • Localizzazione1 • STRADA1 • Localizzazione2 • STRADA2 • Strada02 • Chilometrica • DaSpecificare • NaturaIncidente • particolaritastrade • TipoStrada • FondoStradale • Pavimentazione • Segnaletica • CondizioneAtmosferica • Traffico • Visibilita • Illuminazione • NUM_FERITI • NUM_RISERVATA • NUM_MORTI • NUM_ILLESI • Longitudine • Latitudine •  Confermato • Progressivo • TipoVeicolo • StatoVeicolo • Marca • Modello • TipoPersona • AnnoNascita • Sesso • Tipolesione • Deceduto • DecedutoDopo • CinturaCascoUtilizzato • Airbag

La colonna **Progressivo** contiene una numerazione crescente da 1 in poi, e indica se due o più row nel file descrivono lo stesso incidente ma sono riferite a veicoli diversi.

*Esempi*: 

1. in caso di incidente che coinvolge 3 macchine e 3 persone (3 conducenti), saranno presenti 3 row per descrivere l'incidente e la colonna **Progressivo** conterrà i valori 1, 2, 3.

2. in caso di incidente che coinvolge 3 macchine e 4 persone (3 conducenti e 1 passeggero), saranno presenti 4 row per descrivere l'incidente e la colonna **Progressivo** conterrà i valori 1, 2, 3.
Questo perché la macchina con 1 conducente e 1 passeggero comparirà in due row, ognuna delle quali con **Progressivo** 3 (in quanto stessa macchina) e con **TipoPersona** rispettivamente *Conducente* e *Passeggero*.
